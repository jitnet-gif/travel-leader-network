import Anthropic from '@anthropic-ai/sdk';

type Severity = 'info' | 'warning' | 'important';
type Section = 'dress' | 'alcohol' | 'customs' | 'etiquette';

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

// Module-level cache — reused within warm Cloudflare worker instances
const cultureCache = new Map<string, { data: CultureResult; ts: number }>();
const TTL = 60 * 60 * 1000; // 1 hour

export default defineEventHandler(async (event): Promise<CultureResult> => {
  const config = useRuntimeConfig(event);
  const apiKey = config.anthropicApiKey;
  if (!apiKey) throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY not configured' });

  const country = decodeURIComponent(getRouterParam(event, 'country') ?? '').trim();
  if (!country) throw createError({ statusCode: 400, message: 'country is required' });

  const cached = cultureCache.get(country);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  const today = new Date().toISOString().slice(0, 10);

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 4 } as any],
    system: `You are a travel culture expert. Use web search to find current (${today}) dress code rules, alcohol import allowances, and cultural etiquette for visitors to the specified country.
Return ONLY a valid JSON object — no markdown fences, no extra text:
{
  "country": "string",
  "generatedAt": "${today}",
  "summary": "One-sentence Korean overview of the country's dress/alcohol culture",
  "rules": [
    {
      "id": "short-unique-slug",
      "section": "dress|alcohol|customs|etiquette",
      "severity": "info|warning|important",
      "title": "Korean title (concise, ≤40 chars)",
      "detail": "Korean explanation (3–5 sentences, specific amounts/rules)",
      "source": "Source name in Korean",
      "sourceUrl": "https://..."
    }
  ]
}
Include 5–7 rules covering:
- Dress code for religious sites, public places, beaches (section: dress)
- Alcohol import duty-free allowance in litres/bottles (section: alcohol)
- Public drinking rules (section: alcohol)
- Cultural taboos or local etiquette tips (section: etiquette)
Prioritize practical information for Korean group tour leaders.`,
    messages: [{
      role: 'user',
      content: `Search for ${country}'s 2025–2026 rules on: dress code requirements (religious sites, beaches, public), alcohol import allowances (duty-free limits), public drinking laws, and key cultural etiquette. Provide specific amounts and legal requirements.`,
    }],
  });

  const textBlock = [...message.content].reverse().find(c => c.type === 'text');
  const rawText = (textBlock as { type: 'text'; text: string } | undefined)?.text ?? '';

  let parsed: CultureResult;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw createError({ statusCode: 502, message: 'AI 응답 파싱 실패' });
    }
  }

  cultureCache.set(country, { data: parsed, ts: Date.now() });
  return parsed;
});
