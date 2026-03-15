import Anthropic from '@anthropic-ai/sdk';

type Severity = 'info' | 'warning' | 'important';
type Category = 'visa' | 'customs' | 'health' | 'security' | 'general';

interface Tip {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  detail: string;
  source: string;
  sourceUrl: string;
}

interface ImmigrationResult {
  country: string;
  officialUrl: string;
  generatedAt: string;
  tips: Tip[];
}

// Combined Supabase payload structure stored in immigration_tips column
interface SupabasePayload {
  updatedAt: string;
  immigration?: ImmigrationResult;
  culture?: object;
}

const tipCache = new Map<string, { data: ImmigrationResult; ts: number }>();
const TTL = 60 * 60 * 1000; // 1 hour

async function saveToSupabase(
  supabaseUrl: string,
  supabaseKey: string,
  country: string,
  immigration: ImmigrationResult,
  existing?: SupabasePayload | null
) {
  const payload: SupabasePayload = {
    updatedAt: new Date().toISOString().slice(0, 10),
    immigration,
    culture: existing?.culture,
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
    console.warn('[immigration] Supabase save failed:', e);
  }
}

export default defineEventHandler(async (event): Promise<ImmigrationResult> => {
  const config = useRuntimeConfig(event);
  const apiKey = config.anthropicApiKey;
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseAnonKey;

  const country = decodeURIComponent(getRouterParam(event, 'country') ?? '').trim();
  if (!country) throw createError({ statusCode: 400, message: 'country is required' });

  // 1. Memory cache
  const cached = tipCache.get(country);
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
        if (parsed.immigration) {
          tipCache.set(country, { data: parsed.immigration, ts: Date.now() });
          return parsed.immigration;
        }
      }
    } catch (e) {
      console.warn('[immigration] Supabase read failed:', e);
    }
  }

  // 3. Claude web_search
  if (!apiKey) throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY not configured' });
  const today = new Date().toISOString().slice(0, 10);
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 } as any],
    system: `You are a travel entry-requirements expert. Use web search to find the most current (${today}) immigration rules for visitors to the specified country.
Return ONLY a valid JSON object — no markdown fences, no extra text:
{
  "country": "string",
  "officialUrl": "string (official immigration or embassy URL)",
  "generatedAt": "${today}",
  "tips": [
    {
      "id": "short-unique-slug",
      "category": "visa|customs|health|security|general",
      "severity": "info|warning|important",
      "title": "Korean title (concise, ≤40 chars)",
      "detail": "Korean explanation (3–5 sentences, specific and actionable)",
      "source": "Source name in Korean",
      "sourceUrl": "https://..."
    }
  ]
}
Include 4–6 tips covering: visa/ETA requirements, customs declaration limits, prohibited items, health rules, and any country-specific warnings. Prioritize Korean travellers.`,
    messages: [{
      role: 'user',
      content: `Search for the latest 2025–2026 entry requirements for ${country}: visa/ETA rules, customs limits, prohibited items, health requirements, and any special regulations. Provide accurate, current information.`,
    }],
  });

  const textBlock = [...message.content].reverse().find(c => c.type === 'text');
  const rawText = (textBlock as { type: 'text'; text: string } | undefined)?.text ?? '';

  let parsed: ImmigrationResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
    else throw createError({ statusCode: 502, message: 'AI 응답 파싱 실패' });
  }

  tipCache.set(country, { data: parsed, ts: Date.now() });

  // Save to Supabase
  if (supabaseUrl && supabaseKey) {
    await saveToSupabase(supabaseUrl, supabaseKey, country, parsed, existingPayload);
  }

  return parsed;
});
