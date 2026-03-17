import Anthropic from '@anthropic-ai/sdk';

type FacilityCategory = 'smoking' | 'taxi' | 'bus' | 'subway' | 'lounge' | 'baggage' | 'info' | 'parking' | 'general';

interface FacilityDetail {
  id: string;
  category: FacilityCategory;
  icon: string;
  title: string;
  location: string;
  detail: string;
  sourceUrl: string;
}

export interface AirportDetailResult {
  iata: string;
  name: string;
  officialSiteUrl: string;
  generatedAt: string;
  facilities: FacilityDetail[];
}

const detailCache = new Map<string, { data: AirportDetailResult; ts: number }>();
const TTL = 6 * 60 * 60 * 1000; // 6 hours

// Save to airports_i18n table using lang='facility_tips'
async function saveToSupabase(
  supabaseUrl: string,
  supabaseKey: string,
  iata: string,
  data: AirportDetailResult
) {
  try {
    // Find airport_id from iata
    const airports = await $fetch<{ id: number }[]>(
      `${supabaseUrl}/rest/v1/airports?iata=eq.${iata}&select=id&limit=1`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const airportId = airports?.[0]?.id;
    if (!airportId) return;

    const json = JSON.stringify(data);

    // Check if row exists
    const existing = await $fetch<{ id: number }[]>(
      `${supabaseUrl}/rest/v1/airports_i18n?airport_id=eq.${airportId}&lang=eq.facility_tips&select=id`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );

    if (existing?.length) {
      // Update
      await $fetch(`${supabaseUrl}/rest/v1/airports_i18n?id=eq.${existing[0].id}`, {
        method: 'PATCH',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: { name: json },
      });
    } else {
      // Insert
      await $fetch(`${supabaseUrl}/rest/v1/airports_i18n`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: { airport_id: airportId, lang: 'facility_tips', name: json },
      });
    }
  } catch (e) {
    console.warn('[airport-detail] Supabase save failed:', e);
  }
}

export default defineEventHandler(async (event): Promise<AirportDetailResult> => {
  const config = useRuntimeConfig(event);
  const apiKey = config.anthropicApiKey;
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseAnonKey;

  const iata = decodeURIComponent(getRouterParam(event, 'iata') ?? '').trim().toUpperCase();
  if (!iata) throw createError({ statusCode: 400, message: 'iata is required' });

  // 1. Memory cache
  const cached = detailCache.get(iata);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  // 2. Supabase cache
  if (supabaseUrl && supabaseKey) {
    try {
      const airports = await $fetch<{ id: number }[]>(
        `${supabaseUrl}/rest/v1/airports?iata=eq.${iata}&select=id&limit=1`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const airportId = airports?.[0]?.id;
      if (airportId) {
        const rows = await $fetch<{ name: string | null }[]>(
          `${supabaseUrl}/rest/v1/airports_i18n?airport_id=eq.${airportId}&lang=eq.facility_tips&select=name&limit=1`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
        );
        const raw = rows?.[0]?.name;
        if (raw) {
          const parsed: AirportDetailResult = JSON.parse(raw);
          detailCache.set(iata, { data: parsed, ts: Date.now() });
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[airport-detail] Supabase read failed:', e);
    }
  }

  // 3. Claude web_search
  if (!apiKey) throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY not configured' });

  const today = new Date().toISOString().slice(0, 10);
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 3072,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 6 } as any],
    system: `You are an airport facility specialist. Search the official airport website for precise facility locations as of ${today}. Return valid JSON only, no markdown. The JSON must have: iata, name, officialSiteUrl, generatedAt, and a facilities array. Each facility has: id, category (smoking/taxi/bus/subway/lounge/baggage/info/parking/general), icon (emoji), title (Korean), location (terminal/floor/zone), detail (4-6 Korean sentences covering location, hours, cost, travel time, group tips), sourceUrl. Include at least 6 facilities.`,
    messages: [{
      role: 'user',
      content: `Search official ${iata} airport site for: smoking room, taxi stand (exit/fare/time to city), bus terminal (routes/fare), subway/rail (entrance/fare/time), lounges, baggage claim, info desk. Korean step-by-step instructions with exact terminal/floor/gate numbers.`,
    }],
  });

  const textBlock = [...message.content].reverse().find(c => c.type === 'text');
  const rawText = (textBlock as { type: 'text'; text: string } | undefined)?.text ?? '';

  let parsed: AirportDetailResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
    else throw createError({ statusCode: 502, message: 'AI 응답 파싱 실패' });
  }

  detailCache.set(iata, { data: parsed, ts: Date.now() });

  // Save to Supabase
  if (supabaseUrl && supabaseKey) {
    saveToSupabase(supabaseUrl, supabaseKey, iata, parsed).catch(() => {});
  }

  return parsed;
});
