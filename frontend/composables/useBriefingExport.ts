import type { Airport } from '~/types/airport';

// ── Immigration tips (same data as AirportImmigrationTips, extracted for reuse)
type TipEntry = { category: string; title: string; detail: string; source: string; sourceUrl: string };

const IMMIGRATION_TIPS: Record<string, TipEntry[]> = {
  'South Korea': [
    { category: '비자', title: 'K-ETA 사전 등록 필수', detail: '비자 면제 국가 국민은 한국 입국 전 K-ETA를 온라인으로 신청해야 합니다. 수수료 10,000원, 유효기간 2년.', source: '법무부 출입국', sourceUrl: 'https://www.k-eta.go.kr' },
    { category: '세관', title: '$10,000 초과 현금 신고', detail: '미화 $10,000 초과 현금·귀금속 반입 시 세관 신고 의무.', source: '관세청', sourceUrl: 'https://www.customs.go.kr' },
    { category: '보안', title: '총기·마약 반입 금지', detail: '총기·탄약·마약류는 엄격히 금지. 의약품은 처방전 지참 권장.', source: '관세청', sourceUrl: 'https://www.customs.go.kr' },
  ],
  'Japan': [
    { category: '비자', title: 'Visit Japan Web 등록 권장', detail: '출발 6시간 전까지 등록 완료 권장. 종이 서류 대신 QR코드 처리.', source: '일본 디지털청', sourceUrl: 'https://vjw-lp.digital.go.jp' },
    { category: '세관', title: '100만엔 초과 현금 신고', detail: '면세 한도: 주류 3병, 담배 400개비, 기타 물품 20만엔.', source: '일본 세관', sourceUrl: 'https://www.customs.go.jp' },
    { category: '건강', title: '의약품 반입 수량 제한', detail: '처방의약품은 1개월분 이내. 코데인·슈도에페드린 성분 주의.', source: '후생노동성', sourceUrl: 'https://www.mhlw.go.jp' },
  ],
  'Singapore': [
    { category: '비자', title: 'SG Arrival Card 사전 제출 필수', detail: '입국 3일 이내 온라인 제출 필요. 무료.', source: 'ICA', sourceUrl: 'https://www.ica.gov.sg' },
    { category: '세관', title: '껌 반입 금지', detail: '치료용 껌만 처방전 지참 시 소량 허용.', source: 'Singapore Customs', sourceUrl: 'https://www.customs.gov.sg' },
    { category: '보안', title: '마약 반입 시 사형 가능', detail: '일정량 이상 마약 소지 시 사형. 처방약도 의사 소견서 필수.', source: 'ICA', sourceUrl: 'https://www.ica.gov.sg' },
  ],
  'Thailand': [
    { category: '비자', title: '한국 여권 60일 무비자', detail: '2024년 기준 한국 여권 소지자 60일 무비자 입국 가능.', source: '태국 외무부', sourceUrl: 'https://www.mfa.go.th' },
    { category: '보안', title: '왕실 모독죄 엄중', detail: '왕실 관련 비판적 언행으로 최대 15년 징역 가능.', source: '주태국 한국대사관', sourceUrl: 'https://overseas.mofa.go.kr/th-ko/index.do' },
    { category: '세관', title: '전자담배 완전 금지', detail: '전자담배·가열담배 반입 금지. 최대 10년 징역.', source: '태국 관세청', sourceUrl: 'https://www.customs.go.th' },
  ],
  'United States': [
    { category: '비자', title: 'ESTA 사전 승인 필수', detail: '수수료 $21, 유효 2년. 출발 최소 72시간 전 신청 권장.', source: 'CBP', sourceUrl: 'https://esta.cbp.dhs.gov' },
    { category: '세관', title: 'CBP 신고서 작성', detail: '$10,000 초과 현금 신고 필수. 농산물·육류 반입 엄격 규제.', source: 'U.S. CBP', sourceUrl: 'https://www.cbp.gov' },
  ],
  'United Arab Emirates': [
    { category: '건강', title: '의약품 소지 주의', detail: '일부 진통제·항불안제가 규제 약물. 사전 MOH 승인 권장.', source: 'MOHAP', sourceUrl: 'https://mohap.gov.ae' },
    { category: '세관', title: '주류 4리터 면세', detail: '비무슬림 한해 개인 소비 목적 4리터. 공개 음주 엄금.', source: '두바이 관세청', sourceUrl: 'https://www.dubaicustoms.gov.ae' },
  ],
  'United Kingdom': [
    { category: '비자', title: 'ETA 도입 (2025~)', detail: '비자 면제 국가도 ETA(£10) 신청 필요. 사전 온라인 신청.', source: '영국 내무부', sourceUrl: 'https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta' },
    { category: '세관', title: '£390 초과 물품 신고', detail: '£10,000 이상 현금도 신고 필수.', source: 'HMRC', sourceUrl: 'https://www.gov.uk/duty-free-goods' },
  ],
  'Australia': [
    { category: '비자', title: 'ETA 사전 신청 (AUD$20)', detail: '한국 여권 ETA 신청 가능. 보통 수분 내 승인.', source: 'DIBP', sourceUrl: 'https://immi.homeaffairs.gov.au' },
    { category: '세관', title: '생물보안 신고 엄격', detail: '음식물·식물·흙 미신고 적발 시 최대 AUD$4,200 현장 벌금.', source: 'DAFF', sourceUrl: 'https://www.agriculture.gov.au' },
  ],
  'France': [
    { category: '비자', title: '쉥겐 180일 중 90일', detail: '쉥겐 지역 내 180일 중 최대 90일 체류. 초과 시 입국 거부.', source: '프랑스 비자 포털', sourceUrl: 'https://www.france-visas.gouv.fr' },
    { category: '비자', title: 'ETIAS 도입 예정', detail: '€7, 유효 3년. 비자 면제 국가 방문자 대상. 시행 시 필수.', source: 'EU ETIAS', sourceUrl: 'https://travel-europe.europa.eu/etias_en' },
  ],
};

// ── Generate airport briefing markdown ───────────────────────────────────────
export const generateAirportBriefing = (airport: Airport): string => {
  const lines: string[] = [];

  lines.push(`# ${airport.name} (${airport.iata}) 브리핑`);
  lines.push(`> 생성일: ${new Date().toLocaleDateString('ko-KR')} | 출처: Travel Leader Network`);
  lines.push('');

  lines.push('## 기본 정보');
  lines.push(`- **위치**: ${airport.city}, ${airport.country}`);
  lines.push(`- **터미널 수**: ${airport.terminals}개`);
  if (airport.open_time && airport.close_time) {
    const is24h = airport.open_time === '00:00' && airport.close_time === '24:00';
    lines.push(`- **운영 시간**: ${is24h ? '24시간' : `${airport.open_time} ~ ${airport.close_time}`}`);
  }
  lines.push('');

  lines.push('## 시설 및 교통');
  lines.push(`- 라운지: ${airport.lounge ? '✅ 이용 가능' : '❌ 없음'}`);
  lines.push(`- 흡연 구역: ${airport.smoking_area ? '✅ 있음' : '❌ 없음'}`);
  lines.push(`- 지하철: ${airport.subway ? '✅ 연결됨' : '❌ 없음'}`);
  lines.push(`- 택시: ${airport.taxi ? '✅ 있음' : '❌ 없음'}`);
  lines.push(`- 버스: ${airport.bus ? '✅ 있음' : '❌ 없음'}`);
  lines.push('');

  const tips = IMMIGRATION_TIPS[airport.country];
  if (tips?.length) {
    lines.push(`## ${airport.country} 입국 주의사항`);
    tips.forEach(tip => {
      lines.push(`### [${tip.category}] ${tip.title}`);
      lines.push(tip.detail);
      lines.push(`> 출처: ${tip.source} — ${tip.sourceUrl}`);
      lines.push('');
    });
  }

  lines.push('---');
  lines.push('*이 브리핑은 NotebookLM에 붙여넣어 AI 기반 Q&A 및 오디오 요약을 생성할 수 있습니다.*');
  lines.push('*https://notebooklm.google.com*');

  return lines.join('\n');
};

// ── Generate multi-airport tour briefing ────────────────────────────────────
export const generateTourBriefing = (
  tourName: string,
  date: string,
  airports: Airport[],
  notes: string
): string => {
  const lines: string[] = [];

  lines.push(`# 투어 브리핑: ${tourName || '미입력'}`);
  lines.push(`> 출발일: ${date || '미입력'} | 생성: ${new Date().toLocaleDateString('ko-KR')}`);
  lines.push('> *Travel Leader Network 자동 생성 — NotebookLM AI 분석용*');
  lines.push('');

  if (notes.trim()) {
    lines.push('## 투어 메모');
    lines.push(notes.trim());
    lines.push('');
  }

  airports.forEach((airport, i) => {
    lines.push(`---`);
    lines.push(`## ${i + 1}. ${airport.name} (${airport.iata})`);
    lines.push(`**위치**: ${airport.city}, ${airport.country}`);
    lines.push('');

    lines.push('### 공항 정보');
    lines.push(`- 터미널: ${airport.terminals}개`);
    if (airport.open_time && airport.close_time) {
      const is24h = airport.open_time === '00:00' && airport.close_time === '24:00';
      lines.push(`- 운영시간: ${is24h ? '24시간' : `${airport.open_time} – ${airport.close_time}`}`);
    }
    lines.push(`- 라운지: ${airport.lounge ? '있음' : '없음'} | 지하철: ${airport.subway ? '연결' : '없음'} | 택시: ${airport.taxi ? '있음' : '없음'}`);
    lines.push('');

    const tips = IMMIGRATION_TIPS[airport.country];
    if (tips?.length) {
      lines.push(`### ${airport.country} 입국 주의사항`);
      tips.forEach(tip => {
        lines.push(`**[${tip.category}] ${tip.title}**`);
        lines.push(`${tip.detail}`);
        lines.push(`출처: ${tip.source} (${tip.sourceUrl})`);
        lines.push('');
      });
    }
  });

  lines.push('---');
  lines.push('## NotebookLM 활용 제안 질문');
  lines.push('- 각 공항에서 투어 참가자에게 안내해야 할 핵심 사항은?');
  lines.push('- 이 투어에서 가장 주의해야 할 입국 절차는?');
  lines.push('- 각 국가의 세관 규정에서 공통점과 차이점은?');
  lines.push('- 투어 리더로서 출발 전 확인해야 할 체크리스트를 만들어줘.');
  lines.push('');
  lines.push('*https://notebooklm.google.com 에서 이 문서를 업로드하세요.*');

  return lines.join('\n');
};
