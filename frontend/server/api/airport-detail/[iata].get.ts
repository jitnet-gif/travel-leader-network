import Anthropic from '@anthropic-ai/sdk';

type FacilityCategory = 'smoking' | 'taxi' | 'bus' | 'subway' | 'lounge' | 'baggage' | 'info' | 'parking' | 'general';

interface FacilityDetail {
  id: string;
  category: FacilityCategory;
  icon: string;
  title: string;
  location: string; // e.g. "T1 1층 5번 게이트 옆", "제2터미널 B2 지하"
  detail: string;   // Korean, step-by-step practical guide
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
    max_tokens: 3072,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 6 } as any],
    system: `You are an airport facility specialist. Search the official airport website and travel guides to find precise, step-by-step facility location information as of ${today}.

Return ONLY a valid JSON object — no markdown fences:
{
  "iata": "string",
  "name": "Full airport name",
  "officialSiteUrl": "https://official-airport-website.com",
  "generatedAt": "${today}",
  "facilities": [
    {
      "id": "slug",
      "category": "smoking|taxi|bus|subway|lounge|baggage|info|parking|general",
      "icon": "emoji",
      "title": "Korean facility name",
      "location": "정확한 위치 (터미널·층·구역 명시, 예: T1 1층 7번 출구 앞)",
      "detail": "한국어 이용 방법 (4–6문장). 반드시 포함: ① 정확한 위치 (층·게이트·구역), ② 운영시간, ③ 비용/요금, ④ 소요시간, ⑤ 투어 리더 팁 (단체 그룹 이동 시 주의사항)",
      "sourceUrl": "https://source-page-url"
    }
  ]
}

Search for each of these facilities and provide SPECIFIC floor/zone/gate locations from the official airport website:
1. 🚬 **흡연실** — exact floors and zones for each terminal, total count, smoking pod locations
2. 🚕 **택시 승차장** — exact terminal/level/exit number, estimated fare to city center (KRW or local currency), travel time
3. 🚌 **버스 터미널** — exact location, bus line numbers/names to city center, fare, journey time, operator website
4. 🚇 **지하철/공항철도** — line name, station name, exact floor/entrance, fare to major city station, journey time
5. 🛋️ **라운지** — names, terminal locations, access requirements (card types, class)
6. 🧳 **수하물 찾는 곳** — which level, carousel numbering system, storage/delivery services
7. ℹ️ **안내 데스크 / 관광 안내소** — exact locations, languages spoken
8. 🅿️ **주차장** — short-term lot location, hourly/daily rates

Use the official airport website as primary source. Include at least 6 facilities.`,
    messages: [{
      role: 'user',
      content: `Search the official ${iata} airport website and reliable travel sources for exact facility locations: (1) smoking room floors and zones, (2) taxi pickup exact exit/level with fare to city center, (3) bus terminal exact location with routes and fares to city, (4) subway/rail station exact entrance and fare, (5) lounges with access info, (6) baggage claim level. Provide step-by-step Korean instructions with specific terminal, floor, and gate/exit numbers.`,
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
