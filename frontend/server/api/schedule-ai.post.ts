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
  const days = duration || 1;
  const pax = passengerCount || 20;

  const tripLabels: Record<string, [string, string]> = {
    land_tour:       ['육상 투어',  'Land Tour'],
    cruise:          ['크루즈',     'Cruise'],
    city_tour:       ['시티 투어',  'City Tour'],
    airport_transfer:['공항 이동',  'Airport Transfer'],
  };
  const shoreLabels: Record<string, [string, string]> = {
    guided: ['가이드 투어', 'Guided Tour'],
    free:   ['자유여행',    'Free Time'],
    mixed:  ['혼합형',      'Mixed'],
  };

  const tripLabel  = tripLabels[tripType]?.[isKo ? 0 : 1]  || tripType || (isKo ? '투어' : 'Tour');
  const shoreLabel = shoreLabels[shoreExcursion]?.[isKo ? 0 : 1] || '';

  const budgetLine = isKo
    ? (budgetPerPax ? `1인 예산 ${budgetPerPax} ${currency}` : '예산 미지정')
    : (budgetPerPax ? `Budget ${budgetPerPax} ${currency} per person` : 'Budget not specified');

  const shoreLine = isCruise && shoreLabel
    ? (isKo ? `기항지 관광: ${shoreLabel}` : `Shore excursion: ${shoreLabel}`)
    : '';

  const noteLine = notes && notes !== '없음'
    ? (isKo ? `특이사항: ${notes}` : `Notes: ${notes}`)
    : '';

  const parts = [
    isKo ? `목적지: ${destination}` : `Destination: ${destination}`,
    isKo ? `유형: ${tripLabel}` : `Type: ${tripLabel}`,
    isKo ? `기간: ${days}일, 승객 ${pax}명` : `Duration: ${days} days, ${pax} pax`,
    budgetLine,
    shoreLine,
    noteLine,
  ].filter(Boolean).join('\n');

  const systemPrompt = isKo
    ? '전문 투어 리더 어시스턴트입니다. 실제 현지 물가 기반 여행 일정을 JSON으로 생성합니다. 순수 JSON만 반환하고 마크다운 코드블록을 사용하지 마세요.'
    : 'You are a professional tour leader assistant. Generate travel itineraries with real local pricing as JSON. Return pure JSON only, no markdown.';

  const userPrompt = isKo
    ? `다음 조건으로 투어 리더 운영 일정과 예산을 JSON으로 생성해주세요.\n\n${parts}\n\n반환 필드: destination, duration, schedule(day별 title과 items 배열), budget(currency, perPax, groupTotal, breakdown 배열, savingTips 배열), tips 배열, checklist 배열\nschedule items 필드: time, activity, location, activityType(이동/식사/관광/숙박 중 하나), durationMin, cost, description, notes\nbreakdown 필드: item, perPax, groupTotal, note`
    : `Generate a tour leader schedule and budget as JSON for the following:\n\n${parts}\n\nReturn fields: destination, duration, schedule(array of days with title and items), budget(currency, perPax, groupTotal, breakdown array, savingTips array), tips array, checklist array\nItem fields: time, activity, location, activityType(transport/meal/sightseeing/accommodation), durationMin, cost, description, notes\nBreakdown fields: item, perPax, groupTotal, note`;

  let rawText = '';
  try {
    const response = await $fetch<any>('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: {
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      },
    });
    rawText = (response.content[0] as { text: string })?.text || '';
  } catch (err: any) {
    console.error('[schedule-ai] Anthropic API Error:', err);
    throw createError({
      statusCode: err?.status || 502,
      statusMessage: `Anthropic API Error: ${err?.data?.error?.message || err?.message || 'Unknown error'}`,
      data: { originalError: err?.data || err }
    });
  }

  // JSON 파싱: 코드블록 제거 후 시도
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through */ }
    }
    throw createError({ statusCode: 502, message: `AI 응답 파싱 실패: ${cleaned.slice(0, 100)}` });
  }
});
