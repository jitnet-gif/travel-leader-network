import Anthropic from '@anthropic-ai/sdk';

type FacilityCategory = 'smoking' | 'taxi' | 'bus' | 'subway' | 'lounge' | 'baggage' | 'info' | 'parking' | 'general';

interface FacilityDetail {
  id: string;
  category: FacilityCategory;
  icon: string;
  title: string;
  detail: string; // Korean, 3-5 sentences with specific locations/instructions
}

export interface AirportDetailResult {
  iata: string;
  name: string;
  generatedAt: string;
  facilities: FacilityDetail[];
}

const detailCache = new Map<string, { data: AirportDetailResult; ts: number }>();
const TTL = 6 * 60 * 60 * 1000; // 6 hours (facility info changes rarely)

export default defineEventHandler(async (event): Promise<AirportDetailResult> => {
  const config = useRuntimeConfig(event);
  const apiKey = config.anthropicApiKey;
  if (!apiKey) throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY not configured' });

  const iata = decodeURIComponent(getRouterParam(event, 'iata') ?? '').trim().toUpperCase();
  if (!iata) throw createError({ statusCode: 400, message: 'iata is required' });

  const cached = detailCache.get(iata);
  if (cached && Date.now() - cached.ts < TTL) return cached.data;

  const today = new Date().toISOString().slice(0, 10);
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2560,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 } as any],
    system: `You are an airport facility expert. Search for detailed, practical facility information for the specified airport as of ${today}.
Return ONLY a valid JSON object — no markdown fences:
{
  "iata": "string",
  "name": "Full airport name in English",
  "generatedAt": "${today}",
  "facilities": [
    {
      "id": "slug",
      "category": "smoking|taxi|bus|subway|lounge|baggage|info|parking|general",
      "icon": "single emoji",
      "title": "Korean facility name",
      "detail": "Korean detailed instructions (3–5 sentences). Include: exact floor/zone locations, operating hours if relevant, costs if applicable, number of facilities, and practical tips for tour leaders managing a group."
    }
  ]
}
Include ALL of these categories (if available at this airport):
- smoking: 흡연실 — number of rooms, exact locations by terminal/floor/zone
- taxi: 택시 승차장 — exact terminal/level location, approximate fare to city center, estimated time
- bus: 버스 터미널 — exact location, which bus lines, fare, journey time to city center
- subway: 지하철/철도 연결 — line name, station, fare, journey time to city center
- lounge: 라운지 — names, locations, access requirements (card/class)
- baggage: 수하물 — carousel locations, storage services
- info: 안내 데스크 — location, languages spoken
- parking: 주차장 — short-term/long-term rates, location`,
    messages: [{
      role: 'user',
      content: `Search for ${iata} airport's detailed facility guide: smoking room locations and count, taxi pickup points and fares, bus terminal location and routes to city, subway/rail connections, lounges, baggage claim, information desks. I need specific floor numbers, zone letters, and practical group tour instructions in Korean.`,
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
  return parsed;
});
