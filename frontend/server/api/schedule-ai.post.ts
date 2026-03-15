import Anthropic from '@anthropic-ai/sdk';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiKey = config.anthropicApiKey;
  if (!apiKey) throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY not configured' });

  const body = await readBody(event);
  const {
    destination, tripType, duration, passengerCount,
    language = 'ko', notes, budgetPerPax, currency = 'USD', shoreExcursion
  } = body || {};

  if (!destination) throw createError({ statusCode: 400, message: 'destination is required' });

  const isCruise = tripType === 'cruise';
  const isKo = language === 'ko';

  const tripTypeLabel: Record<string, string> = {
    land_tour: isKo ? '육상 투어' : 'Land Tour',
    cruise: isKo ? '크루즈' : 'Cruise',
    city_tour: isKo ? '시티 투어' : 'City Tour',
    airport_transfer: isKo ? '공항 이동' : 'Airport Transfer',
  };
  const shoreLabels: Record<string, string> = {
    guided: isKo ? '가이드 투어 포함' : 'Guided Tour',
    free: isKo ? '자유여행' : 'Free Time',
    mixed: isKo ? '혼합 (오전 투어 + 오후 자유)' : 'Mixed (Morning Tour + Afternoon Free)',
  };

  const tripLabel = tripTypeLabel[tripType] || tripType || (isKo ? '투어' : 'Tour');
  const shoreLabel = shoreLabels[shoreExcursion] || '';

  const systemPrompt = isKo
    ? '당신은 전문 투어 리더 운영 어시스턴트입니다. 실제 현지 물가와 운영 비용에 기반한 정확한 예산을 포함한 여행 일정을 JSON 형식으로 생성합니다. 반드시 유효한 JSON만 응답하고, 마크다운 코드블록 없이 순수 JSON만 반환하세요.'
    : 'You are a professional tour leader operations assistant. You generate travel schedules with accurate budgets based on real local pricing. Always respond with valid JSON only, no markdown code blocks.';

  const budgetSection = isKo
    ? (budgetPerPax
      ? `- 1인 예산: ${budgetPerPax} ${currency}\n- 단체 총 예산: ${(Number(budgetPerPax) * (passengerCount || 20)).toLocaleString()} ${currency}`
      : '- 예산: 미지정 (적정 예산 추천)')
    : (budgetPerPax
      ? `- Budget per person: ${budgetPerPax} ${currency}\n- Group total budget: ${(Number(budgetPerPax) * (passengerCount || 20)).toLocaleString()} ${currency}`
      : '- Budget: Not specified (recommend appropriate budget)');

  const shoreSection = isCruise && shoreLabel
    ? (isKo ? `- 기항지 관광 방식: ${shoreLabel}` : `- Shore excursion type: ${shoreLabel}`)
    : '';

  const shoreExcursionTemplate = isCruise
    ? `[{ "port": "${isKo ? '기항지명' : 'port name'}", "option": "guided|free|mixed", "label": "${isKo ? '옵션 설명' : 'option description'}", "perPax": 0, "included": [] }]`
    : 'null';

  const userPrompt = isKo
    ? `다음 조건으로 투어 리더용 운영 일정과 예산 계획표를 생성해 주세요:
- 목적지: ${destination}
- 투어 유형: ${tripLabel}
- 기간: ${duration || 1}일
- 승객 수: ${passengerCount || 20}명
${budgetSection}
${shoreSection}
${notes ? `- 특이사항: ${notes}` : ''}

실제 현지 물가를 기반으로 정확한 숫자를 제공하세요.

다음 JSON 구조로 정확히 응답하세요:
{
  "destination": "목적지명",
  "duration": 숫자,
  "schedule": [
    {
      "day": 1,
      "title": "1일차 제목",
      "items": [
        {
          "time": "HH:MM",
          "activity": "활동명",
          "location": "장소명 (구체적 주소 또는 랜드마크)",
          "type": "transport|activity|meal|accommodation",
          "duration": "소요시간 (예: 2시간, 45분)",
          "cost": 숫자,
          "description": "활동에 대한 구체적 설명 (2-3문장)",
          "notes": "투어 리더 운영 메모"
        }
      ]
    }
  ],
  "budget": {
    "currency": "${currency}",
    "perPax": 숫자,
    "groupTotal": 숫자,
    "breakdown": [
      { "item": "항목명", "perPax": 숫자, "groupTotal": 숫자, "note": "비고", "category": "transport|activity|meal|accommodation|entrance|guide|misc" }
    ],
    "shoreExcursionOptions": ${shoreExcursionTemplate},
    "savingTips": ["절약 팁1", "절약 팁2"]
  },
  "tips": ["팁1", "팁2"],
  "checklist": ["체크항목1", "체크항목2"]
}`
    : `Generate a tour leader operations schedule and budget breakdown for:
- Destination: ${destination}
- Tour type: ${tripLabel}
- Duration: ${duration || 1} day(s)
- Passenger count: ${passengerCount || 20}
${budgetSection}
${shoreSection}
${notes ? `- Notes: ${notes}` : ''}

Provide accurate numbers based on real local pricing.

Respond with exactly this JSON structure:
{
  "destination": "destination name",
  "duration": number,
  "schedule": [
    {
      "day": 1,
      "title": "Day 1 title",
      "items": [
        {
          "time": "HH:MM",
          "activity": "activity name",
          "location": "specific location",
          "type": "transport|activity|meal|accommodation",
          "duration": "time required",
          "cost": number,
          "description": "2-3 sentence description",
          "notes": "tour leader operational note"
        }
      ]
    }
  ],
  "budget": {
    "currency": "${currency}",
    "perPax": number,
    "groupTotal": number,
    "breakdown": [
      { "item": "item name", "perPax": number, "groupTotal": number, "note": "note", "category": "transport|activity|meal|accommodation|entrance|guide|misc" }
    ],
    "shoreExcursionOptions": ${shoreExcursionTemplate},
    "savingTips": ["tip1", "tip2"]
  },
  "tips": ["tip1", "tip2"],
  "checklist": ["item1", "item2"]
}`;

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const rawText = (message.content[0] as { text: string })?.text || '';
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw createError({ statusCode: 502, message: 'Failed to parse AI response' });
    }
  }
  return parsed;
});
