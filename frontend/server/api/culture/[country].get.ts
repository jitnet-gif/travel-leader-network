import Anthropic from '@anthropic-ai/sdk';

type Severity = 'info' | 'warning' | 'important';
type Section = 'weather' | 'dress' | 'alcohol' | 'etiquette' | 'customs';

interface CultureRule {
  id: string;
  section: Section;
  severity: Severity;
  title: string;
  detail: string;
  source: string;
  sourceUrl: string;
}

export interface CultureResult {
  country: string;
  generatedAt: string;
  summary: string;
  rules: CultureRule[];
}

interface SupabasePayload {
  updatedAt: string;
  immigration?: object;
  culture?: CultureResult;
}

const cultureCache = new Map<string, { data: CultureResult; ts: number }>();
const TTL = 60 * 60 * 1000; // 1 hour

async function saveToSupabase(
  supabaseUrl: string,
  supabaseKey: string,
  country: string,
  culture: CultureResult,
  existing?: SupabasePayload | null
) {
  const payload: SupabasePayload = {
    updatedAt: new Date().toISOString().slice(0, 10),
    immigration: existing?.immigration,
    culture,
  };
  try {
    await $fetch(`${supabaseUrl}/rest/v1/countries?name=eq.${encodeURIComponent(country)}`, {
      method: 'PATCH',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: { immigration_tips: JSON.stringify(payload) },
    });
  } catch (e) {
    console.warn('[culture] Supabase save failed:', e);
  }
}

export default defineEventHandler(async (event): Promise<CultureResult> => {
  const config = useRuntimeConfig(event);
  const apiKey = config.anthropicApiKey;
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseAnonKey;

  const country = decodeURIComponent(getRouterParam(event, 'country') ?? '').trim();
  if (!country) throw createError({ statusCode: 400, message: 'country is required' });

  // 1. Memory cache
  const cached = cultureCache.get(country);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  // 2. Supabase cache
  let existingPayload: SupabasePayload | null = null;
  if (supabaseUrl && supabaseKey) {
    try {
      const rows = await $fetch<{ immigration_tips: string | null }[]>(
        `${supabaseUrl}/rest/v1/countries?name=eq.${encodeURIComponent(country)}&select=immigration_tips`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const raw = rows?.[0]?.immigration_tips;
      if (raw) {
        const parsed: SupabasePayload = JSON.parse(raw);
        existingPayload = parsed;
        if (parsed.culture) {
          cultureCache.set(country, { data: parsed.culture, ts: Date.now() });
          return parsed.culture;
        }
      }
    } catch (e) {
      console.warn('[culture] Supabase read failed:', e);
    }
  }

  // 3. Claude web_search
  if (!apiKey) throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY not configured' });
  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().getMonth() + 1;

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2560,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 } as any],
    system: `You are a travel culture and weather expert. Use web search to find current (${today}, month=${month}) dress code rules, seasonal weather, recommended clothing, alcohol import rules, and cultural etiquette for visitors to the specified country.
Return ONLY a valid JSON object — no markdown fences, no extra text:
{
  "country": "string",
  "generatedAt": "${today}",
  "summary": "One-sentence Korean overview of climate and dress culture",
  "rules": [
    {
      "id": "short-unique-slug",
      "section": "weather|dress|alcohol|etiquette|customs",
      "severity": "info|warning|important",
      "title": "Korean title (concise, ≤40 chars)",
      "detail": "Korean explanation (3–5 sentences, specific and actionable)",
      "source": "Source name in Korean",
      "sourceUrl": "https://..."
    }
  ]
}
Include 7–9 rules covering ALL of these sections:
- section "weather": current season climate (month ${month}), temperature range, humidity, rainfall — give specific °C ranges
- section "dress": recommended clothing for current season (month ${month}) — specific items e.g. 가벼운 면 소재, 레이어링, 우산 필수, 선크림 SPF50+
- section "dress": dress code for religious sites, conservative areas, beaches
- section "alcohol": duty-free import allowance (specific litres/bottles)
- section "alcohol": public drinking laws
- section "etiquette": 1–2 important cultural taboos or greeting customs
Prioritize practical, specific information for Korean group tour leaders.`,
    messages: [{
      role: 'user',
      content: `Search for ${country} in month ${month}: (1) current weather and temperature in major cities, (2) recommended clothing for tourists this season, (3) dress code rules for religious/public places, (4) alcohol import duty-free limits, (5) public drinking laws, (6) key cultural etiquette for Korean tourists.`,
    }],
  });

  const textBlock = [...message.content].reverse().find(c => c.type === 'text');
  const rawText = (textBlock as { type: 'text'; text: string } | undefined)?.text ?? '';

  let parsed: CultureResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
    else throw createError({ statusCode: 502, message: 'AI 응답 파싱 실패' });
  }

  cultureCache.set(country, { data: parsed, ts: Date.now() });

  // Save to Supabase
  if (supabaseUrl && supabaseKey) {
    await saveToSupabase(supabaseUrl, supabaseKey, country, parsed, existingPayload);
  }

  return parsed;
});
