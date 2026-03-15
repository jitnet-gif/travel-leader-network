<template>
  <div class="space-y-3 overflow-y-auto flex-1 min-h-0 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-black/80 dark:text-white/80">{{ airport.country }} 입국 주의사항</p>
        <p class="text-xs text-black/40 dark:text-white/40 mt-0.5">공항·대사관 공식 출처 기반</p>
      </div>
      <a
        v-if="countryData?.officialUrl"
        :href="countryData.officialUrl"
        target="_blank"
        rel="noopener"
        class="shrink-0 text-xs font-semibold text-ocean hover:underline"
      >🔗 공식 사이트</a>
    </div>

    <!-- Tips list -->
    <template v-if="tips.length">
      <div
        v-for="tip in tips"
        :key="tip.id"
        class="rounded-xl border overflow-hidden transition-all"
        :class="severityBorder(tip.severity)"
      >
        <!-- Summary row -->
        <button
          type="button"
          class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition"
          @click="expanded = expanded === tip.id ? null : tip.id"
        >
          <span
            class="shrink-0 mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            :class="categoryStyle(tip.category)"
          >{{ categoryLabel(tip.category) }}</span>
          <span class="flex-1 text-sm font-semibold text-black/80 dark:text-white/80 leading-snug">{{ tip.title }}</span>
          <span class="shrink-0 mt-0.5 text-black/30 dark:text-white/30 transition-transform" :class="expanded === tip.id ? 'rotate-180' : ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>

        <!-- Detail expand -->
        <Transition name="tip-expand">
          <div v-if="expanded === tip.id" class="px-4 pb-4 space-y-2 border-t border-black/5 dark:border-white/10 pt-3">
            <p class="text-sm text-black/70 dark:text-white/60 leading-relaxed whitespace-pre-line">{{ tip.detail }}</p>
            <a
              :href="tip.sourceUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 text-xs font-semibold text-ocean hover:underline mt-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              출처: {{ tip.source }}
            </a>
          </div>
        </Transition>
      </div>
    </template>

    <!-- No data fallback -->
    <div v-else class="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 p-5 text-center space-y-2">
      <p class="text-sm text-black/60 dark:text-white/50">{{ airport.country }} 입국 정보를 공식 채널에서 확인하세요.</p>
      <div class="flex flex-wrap justify-center gap-2">
        <a
          :href="`https://www.google.com/search?q=${encodeURIComponent(airport.country + ' 입국 요건 대사관')}`"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold text-ocean hover:bg-ocean/20 transition"
        >🔍 대사관 검색</a>
        <a
          :href="`https://www.google.com/search?q=${encodeURIComponent(airport.name + ' entry requirements visa')}`"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 rounded-full bg-slate-200 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-black/60 dark:text-white/60 hover:bg-slate-300 dark:hover:bg-white/20 transition"
        >✈️ 공항 안내 검색</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';

const props = defineProps<{ airport: Airport }>();

const expanded = ref<string | null>(null);
watch(() => props.airport, () => { expanded.value = null; });

// ── Data types ────────────────────────────────────────────────────────────────
type Severity = 'info' | 'warning' | 'important';
type Category = 'visa' | 'customs' | 'health' | 'security' | 'general';

type Tip = {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  detail: string;
  source: string;
  sourceUrl: string;
};

type CountryData = {
  officialUrl: string;
  tips: Tip[];
};

// ── Immigration data (country name → tips) ───────────────────────────────────
const TIPS: Record<string, CountryData> = {
  'South Korea': {
    officialUrl: 'https://www.immigration.go.kr',
    tips: [
      {
        id: 'kr-keta', category: 'visa', severity: 'important',
        title: 'K-ETA 사전 등록 필수 (무비자 입국 시)',
        detail: '비자 면제 국가 국민은 한국 입국 전 K-ETA(전자여행허가)를 온라인으로 신청해야 합니다.\n신청 후 승인까지 최대 72시간 소요될 수 있으니 출발 전 미리 준비하세요.\n수수료: 10,000원 / 유효기간 2년 (복수 입국 가능)',
        source: '법무부 출입국·외국인정책본부',
        sourceUrl: 'https://www.k-eta.go.kr',
      },
      {
        id: 'kr-customs', category: 'customs', severity: 'warning',
        title: '미화 $10,000 초과 현금 반드시 신고',
        detail: '미화 $10,000(또는 동등 외화) 초과 현금·수표·귀금속 반입 시 세관에 신고해야 합니다.\n미신고 적발 시 해당 금액 몰수 및 과태료 부과 대상입니다.\n농산물·육류 등 검역 대상 품목도 별도 신고 필요.',
        source: '관세청',
        sourceUrl: 'https://www.customs.go.kr',
      },
      {
        id: 'kr-prohibited', category: 'security', severity: 'important',
        title: '반입 금지 품목 (총기·마약 등)',
        detail: '총기·탄약·도검류, 마약류, 도박용품, 위조 화폐 등 반입이 엄격히 금지됩니다.\n의약품은 처방전 지참 권장. 대마 관련 제품은 합법 국가 출발이라도 반입 불가입니다.',
        source: '관세청 금지·제한 품목',
        sourceUrl: 'https://www.customs.go.kr/kcs/ad/cvpl/conveyanceProhibitedList.do',
      },
      {
        id: 'kr-health', category: 'health', severity: 'info',
        title: '건강 상태 확인서 및 검역',
        detail: '현재(2025년 기준) 별도 백신 접종 증명은 불필요합니다.\n콜레라·황열병 위험 지역 방문 후 입국 시 검역 신고가 필요할 수 있습니다.',
        source: '질병관리청',
        sourceUrl: 'https://www.kdca.go.kr',
      },
    ],
  },
  'Japan': {
    officialUrl: 'https://www.moj.go.jp/isa/',
    tips: [
      {
        id: 'jp-vjw', category: 'visa', severity: 'important',
        title: 'Visit Japan Web 사전 등록 권장',
        detail: '입국심사·세관 신고를 디지털화한 Visit Japan Web에 미리 등록하면 입국 절차가 빠릅니다.\n등록은 출발 6시간 전까지 완료 권장. 종이 서류 대신 QR코드로 처리됩니다.',
        source: '일본 디지털청 Visit Japan Web',
        sourceUrl: 'https://vjw-lp.digital.go.jp',
      },
      {
        id: 'jp-customs', category: 'customs', severity: 'warning',
        title: '100만엔 초과 현금·면세 한도 주의',
        detail: '100만엔 이상 현금 반입 시 세관 신고 필수.\n면세 한도: 주류 3병(760ml), 담배 400개비, 향수 2온스, 기타 물품 20만엔.\n초과 시 관세 부과.',
        source: '일본 세관',
        sourceUrl: 'https://www.customs.go.jp',
      },
      {
        id: 'jp-med', category: 'health', severity: 'warning',
        title: '의약품·화장품 반입 수량 제한',
        detail: '처방의약품은 1개월분 이내 반입 가능 (처방전 지참 권장).\n일부 성분(슈도에페드린 등)은 일본에서 처방전 없이 판매 금지.\n코데인 성분 감기약도 수량 제한 있음.',
        source: '후생노동성',
        sourceUrl: 'https://www.mhlw.go.jp/english/policy/health-medical/pharmaceuticals/01.html',
      },
      {
        id: 'jp-prohibited', category: 'security', severity: 'important',
        title: '총기·마약 엄중 단속',
        detail: '총기·탄약 반입 원칙적으로 불가.\n마약(대마 포함) 소지·반입은 엄중한 형사 처벌 대상.\n특정 칼·도검류도 신고 필요.',
        source: '일본 출입국재류관리청',
        sourceUrl: 'https://www.moj.go.jp/isa/',
      },
    ],
  },
  'Singapore': {
    officialUrl: 'https://www.ica.gov.sg',
    tips: [
      {
        id: 'sg-sgac', category: 'visa', severity: 'important',
        title: 'SG Arrival Card 사전 제출 필수',
        detail: '입국 3일 이내에 SG Arrival Card를 온라인으로 제출해야 합니다.\n무료이며 모바일에서 제출 가능. 미제출 시 입국 심사에서 지연될 수 있습니다.',
        source: '싱가포르 이민청 (ICA)',
        sourceUrl: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore/sg-arrival-card',
      },
      {
        id: 'sg-chewing-gum', category: 'customs', severity: 'warning',
        title: '껌 반입 금지',
        detail: '싱가포르는 껌 수입 및 판매가 법으로 금지되어 있습니다.\n치료용 껌(니코틴·덴탈 껌)만 처방전 지참 시 소량 허용.',
        source: '싱가포르 관세청 (Singapore Customs)',
        sourceUrl: 'https://www.customs.gov.sg',
      },
      {
        id: 'sg-drugs', category: 'security', severity: 'important',
        title: '마약 반입 시 사형 가능',
        detail: '싱가포르는 마약 밀반입에 매우 엄격합니다.\n일정량 이상 마약 소지 시 사형에 처해질 수 있습니다.\n처방약도 의사 소견서 및 처방전을 반드시 지참하세요.',
        source: '싱가포르 이민청',
        sourceUrl: 'https://www.ica.gov.sg/enter-transit-depart/entering-singapore',
      },
      {
        id: 'sg-tobacco', category: 'customs', severity: 'warning',
        title: '담배 반입 관련 세금 주의',
        detail: '싱가포르 입국 시 담배 면세 혜택이 없습니다.\n모든 담배 제품에 관세가 부과되므로 1갑이라도 신고 필요.\n전자담배·가열담배(IQOS 등)는 완전 금지.',
        source: '싱가포르 관세청',
        sourceUrl: 'https://www.customs.gov.sg/individuals/bringing-goods-into-singapore/guide-for-travellers/duty-free-concession-and-gst-relief',
      },
    ],
  },
  'Thailand': {
    officialUrl: 'https://www.mfa.go.th',
    tips: [
      {
        id: 'th-visa', category: 'visa', severity: 'info',
        title: '무비자 입국 기간 확인 (국적별 상이)',
        detail: '한국 여권 소지자는 60일 무비자 입국 가능 (2024년 기준).\n다른 국적은 30일 또는 비자 필요. 출발 전 최신 정보 확인 필수.\n비자런을 통한 연장은 점차 제한되고 있습니다.',
        source: '태국 외무부',
        sourceUrl: 'https://www.mfa.go.th/en/page/visa-exemption',
      },
      {
        id: 'th-currency', category: 'customs', severity: 'warning',
        title: '현금 $20,000 초과 신고 필요',
        detail: '미화 $20,000 또는 동등 외화 초과 현금 반입 시 신고 의무.\n태국 바트 50만 밧 이상 반출도 신고 대상.',
        source: '태국 관세청',
        sourceUrl: 'https://www.customs.go.th',
      },
      {
        id: 'th-prohibited', category: 'security', severity: 'important',
        title: '왕실 모독 금지 (불경죄)',
        detail: '태국은 왕실 모독죄(레세-마제스테)가 엄중하게 적용됩니다.\n왕실 관련 비판적 언행·소셜 미디어 게시 등으로 최대 15년 징역 가능.',
        source: '주태국 한국 대사관',
        sourceUrl: 'https://overseas.mofa.go.kr/th-ko/index.do',
      },
      {
        id: 'th-e-cigarette', category: 'customs', severity: 'important',
        title: '전자담배 반입 완전 금지',
        detail: '전자담배, 가열담배(IQOS 등), 관련 액상 모두 태국 반입 금지.\n적발 시 최대 10년 징역 또는 500만 바트 벌금.',
        source: '태국 관세청',
        sourceUrl: 'https://www.customs.go.th',
      },
    ],
  },
  'United Arab Emirates': {
    officialUrl: 'https://u.ae/en/information-and-services/visa-and-emirates-id',
    tips: [
      {
        id: 'ae-visa', category: 'visa', severity: 'info',
        title: '도착 비자 또는 사전 e비자',
        detail: '많은 국적의 여행자가 두바이 도착 시 무료 비자 스탬프(30일)를 받습니다.\n일부 국적은 사전 e비자 신청 필요. ICP 공식 사이트에서 확인하세요.',
        source: 'UAE 연방 신원관리청 (ICP)',
        sourceUrl: 'https://icp.gov.ae/en/residency/visa/',
      },
      {
        id: 'ae-drugs', category: 'security', severity: 'important',
        title: '의약품 소지 주의 (처방전 필수)',
        detail: 'UAE에서는 일부 진통제·수면제·항불안제가 규제 약물로 분류됩니다.\n처방전이 있더라도 사전에 보건부(MOH)에 승인 신청 권장.\n코데인·트라마돌 등 포함 제품 소지 시 체포 사례 있음.',
        source: 'UAE 보건예방부 (MOHAP)',
        sourceUrl: 'https://mohap.gov.ae/en/services/issue-of-permit-to-bring-medicines-into-the-uae',
      },
      {
        id: 'ae-customs', category: 'customs', severity: 'warning',
        title: '주류·돼지고기 반입 제한',
        detail: '주류는 비무슬림에 한해 개인 소비 목적으로 4리터 반입 가능.\n공개 음주는 엄금. 돼지고기 제품도 소량 개인 소비 목적만 허용.',
        source: '두바이 관세청',
        sourceUrl: 'https://www.dubaicustoms.gov.ae',
      },
      {
        id: 'ae-vaping', category: 'customs', severity: 'warning',
        title: '전자담배 허용 (단, 규정 준수)',
        detail: '전자담배와 관련 액상은 2019년부터 허용되었지만, 판매 제품은 규격 준수 필요.\n개인 소비 목적 소량 반입은 가능하나 대량 반입 시 문제될 수 있음.',
        source: 'UAE 보건예방부',
        sourceUrl: 'https://mohap.gov.ae',
      },
    ],
  },
  'United Kingdom': {
    officialUrl: 'https://www.gov.uk/check-uk-visa',
    tips: [
      {
        id: 'gb-eta', category: 'visa', severity: 'important',
        title: 'ETA(전자여행허가) 도입 (2025~)',
        detail: '비자 면제 국가 방문자도 영국 입국 전 ETA(Electronic Travel Authorisation) 신청 필요.\n2025년부터 단계적으로 시행. 비용 £10.\n단, EU/EEA 여권 소지자 중 일부는 별도 규정 확인 요망.',
        source: '영국 내무부 (Home Office)',
        sourceUrl: 'https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta',
      },
      {
        id: 'gb-customs', category: 'customs', severity: 'warning',
        title: '면세 한도 및 신고 의무',
        detail: '£390 이상 물품, £10,000 이상 현금 반입 시 신고 필요.\n상업용으로 의심되는 물품(담배·주류 대량)은 몰수될 수 있습니다.\nEU 출발과 비EU 출발의 면세 한도가 다름.',
        source: 'UK 국경세관청 (HMRC)',
        sourceUrl: 'https://www.gov.uk/duty-free-goods',
      },
      {
        id: 'gb-food', category: 'customs', severity: 'warning',
        title: '동식물성 식품 반입 제한 (브렉시트 이후)',
        detail: '브렉시트 이후 EU에서 UK로 육류·유제품 반입이 엄격히 제한됩니다.\n상업용 수량의 음식물은 공식 검역 통과 필요.',
        source: '영국 환경식품농무부 (DEFRA)',
        sourceUrl: 'https://www.gov.uk/bring-food-into-great-britain',
      },
    ],
  },
  'France': {
    officialUrl: 'https://www.france-visas.gouv.fr',
    tips: [
      {
        id: 'fr-schengen', category: 'visa', severity: 'info',
        title: '쉥겐 비자 (90일/180일 규칙)',
        detail: '무비자 입국 시 쉥겐 지역 내 180일 중 최대 90일 체류 가능.\n쉥겐 국가간 이동도 동일 카운팅. 일수를 초과하면 입국 거부 및 추방 가능.',
        source: '프랑스 비자 포털',
        sourceUrl: 'https://www.france-visas.gouv.fr',
      },
      {
        id: 'fr-etias', category: 'visa', severity: 'important',
        title: 'ETIAS 도입 예정 (2025년 이후)',
        detail: 'EU는 비자 면제 국가 방문자 대상 ETIAS(여행정보허가시스템) 도입 예정.\n비용 €7 / 유효 3년. 시행 시 출발 전 신청 필수.\n최신 시행 여부는 EU 공식 사이트에서 확인하세요.',
        source: 'European Union ETIAS',
        sourceUrl: 'https://travel-europe.europa.eu/etias_en',
      },
      {
        id: 'fr-customs', category: 'customs', severity: 'warning',
        title: '€10,000 초과 현금 신고',
        detail: '€10,000 이상 현금·귀중품 반입 시 세관 신고 필수.\n주류·담배 면세 한도: 와인 4L, 맥주 16L, 담배 200개비 (비EU 출발 기준).',
        source: '프랑스 관세청 (Douanes)',
        sourceUrl: 'https://www.douane.gouv.fr',
      },
    ],
  },
  'United States': {
    officialUrl: 'https://esta.cbp.dhs.gov',
    tips: [
      {
        id: 'us-esta', category: 'visa', severity: 'important',
        title: 'ESTA 사전 승인 필수 (VWP 국가)',
        detail: '미국 비자 면제 프로그램(VWP) 참가국 여행자는 출발 전 ESTA 승인이 필수입니다.\n수수료 $21. 유효기간 2년(또는 여권 만료 시). 승인까지 최대 72시간 소요.\n한국 여권은 VWP 적용 가능.',
        source: 'U.S. Customs and Border Protection (CBP)',
        sourceUrl: 'https://esta.cbp.dhs.gov',
      },
      {
        id: 'us-cbp', category: 'customs', severity: 'warning',
        title: 'CBP 입국 신고서 작성',
        detail: '입국 시 CBP Form 6059B 또는 APC 키오스크에서 세관 신고.\n현금·금전적 도구 $10,000 초과 시 신고 필수.\n농산물·육류 등 음식물 반입 엄격 규제 (위반 시 $10,000 이상 벌금 가능).',
        source: 'U.S. Customs and Border Protection',
        sourceUrl: 'https://www.cbp.gov/travel/us-citizens/know-before-you-go/prohibited-and-restricted-items',
      },
      {
        id: 'us-fingerprint', category: 'security', severity: 'info',
        title: '지문·사진 채취 (모든 외국인)',
        detail: '미국 입국 시 모든 외국인은 10지 지문 및 사진 채취를 해야 합니다.\n미국 시민권자와 영구 거주권자(그린카드)는 면제.\nGlobal Entry 등록자는 별도 키오스크 이용 가능.',
        source: 'U.S. Department of Homeland Security',
        sourceUrl: 'https://www.dhs.gov/biometrics',
      },
      {
        id: 'us-prohibited', category: 'customs', severity: 'important',
        title: '쿠바 물품·무기·마약 엄금',
        detail: '쿠바산 담배·럼 등은 개인 소비용 소량만 허용.\n총기류는 반드시 사전 신고 및 허가 필요.\n마약류(대마 포함, 합법 주 출발이라도) 연방법상 반입 금지.',
        source: 'CBP Prohibited & Restricted Items',
        sourceUrl: 'https://www.cbp.gov/travel/us-citizens/know-before-you-go/prohibited-and-restricted-items',
      },
    ],
  },
  'Australia': {
    officialUrl: 'https://immi.homeaffairs.gov.au',
    tips: [
      {
        id: 'au-eta', category: 'visa', severity: 'important',
        title: 'ETA 또는 eVisitor 사전 신청 필수',
        detail: '비자 면제 협정이 없는 국가 여행자는 ETA(AUD$20) 또는 eVisitor(무료)를 신청해야 합니다.\n한국 여권 소지자는 ETA 신청 가능. 승인까지 보통 수분 이내.',
        source: '호주 이민시민권부 (DIBP)',
        sourceUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601',
      },
      {
        id: 'au-biosecurity', category: 'customs', severity: 'important',
        title: '생물보안 신고 엄격 (음식·흙·식물)',
        detail: '호주는 생태계 보호를 위해 음식물·식물·흙·동물 반입을 엄격히 통제합니다.\n신선 과일·채소, 육류, 씨앗, 목제품 모두 신고 또는 포기해야 합니다.\n미신고 적발 시 최대 AUD$4,200 현장 벌금.',
        source: '호주 농업부 (DAFF)',
        sourceUrl: 'https://www.agriculture.gov.au/biosecurity-trade/travelling/bringing-mailing-goods/what-you-can-bring-in',
      },
      {
        id: 'au-incoming-passenger', category: 'customs', severity: 'warning',
        title: '입국자 카드 작성 (Incoming Passenger Card)',
        detail: '모든 입국자는 비행기 내 또는 도착 후 IPC 작성 필요 (디지털화 진행 중).\nAUD$10,000 초과 현금 신고 필수.',
        source: '호주 국경강화부 (ABF)',
        sourceUrl: 'https://www.abf.gov.au/entering-and-leaving-australia/entering-australia',
      },
    ],
  },
  'Canada': {
    officialUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html',
    tips: [
      {
        id: 'ca-eta', category: 'visa', severity: 'important',
        title: 'eTA 사전 신청 필수 (항공 입국)',
        detail: '비자 면제 국가 여행자도 항공으로 캐나다 입국 시 eTA(CAD$7) 신청 필수.\n육로·해로 입국은 불필요. 한국 여권 소지자 해당.',
        source: 'Immigration, Refugees and Citizenship Canada (IRCC)',
        sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html',
      },
      {
        id: 'ca-cbsa', category: 'customs', severity: 'warning',
        title: 'CBSA 신고서 작성',
        detail: 'CAD$10,000 초과 현금 및 귀중품 신고 필요.\n음식·식물·육류 반입 시 CFIA 규정 확인. 허가 없는 반입 시 몰수 및 벌금.',
        source: 'Canada Border Services Agency (CBSA)',
        sourceUrl: 'https://www.cbsa-asfc.gc.ca/travel-voyage/td-dv-eng.html',
      },
    ],
  },
  'Germany': {
    officialUrl: 'https://www.auswaertiges-amt.de',
    tips: [
      {
        id: 'de-schengen', category: 'visa', severity: 'info',
        title: '쉥겐 지역 공통 규정 적용',
        detail: '180일 중 90일 무비자 체류 가능. 쉥겐 국가 이동 시 별도 입국 심사 없음.\nETIAS 도입 예정 (시행 전까지 현행 규정 유지).',
        source: '독일 외무부',
        sourceUrl: 'https://www.auswaertiges-amt.de/en/einreiseundaufenthalt/visabestimmungen-node',
      },
      {
        id: 'de-customs', category: 'customs', severity: 'warning',
        title: '€10,000 초과 현금 및 EU 면세 한도',
        detail: '€10,000 이상 현금 반입 시 신고 필수.\n비EU 출발 면세 한도: 와인 2L, 증류주 1L, 담배 200개비, 기타 물품 €430.',
        source: '독일 관세청 (Zoll)',
        sourceUrl: 'https://www.zoll.de/EN/Private-individuals/Travel/Travellers-from-third-countries-non-EU/Duty-free-allowances/duty-free-allowances_node.html',
      },
    ],
  },
  'Indonesia': {
    officialUrl: 'https://www.imigrasi.go.id',
    tips: [
      {
        id: 'id-voa', category: 'visa', severity: 'info',
        title: '도착 비자(VOA) 또는 e-VOA 이용',
        detail: '한국 여권 소지자는 발리, 자카르타 등 주요 공항에서 도착 비자(VOA, IDR 500,000/약 $35) 취득 가능.\ne-VOA를 사전 신청하면 줄서기 없이 빠르게 입국할 수 있습니다.',
        source: '인도네시아 이민청',
        sourceUrl: 'https://molina.imigrasi.go.id',
      },
      {
        id: 'id-drugs', category: 'security', severity: 'important',
        title: '마약 소지 엄중 처벌 (사형 가능)',
        detail: '인도네시아는 마약 밀수·소지에 사형이 적용될 수 있습니다.\n처방약도 인도네시아 관련 규정을 사전 확인하고 의사 처방전을 반드시 지참하세요.',
        source: '주인도네시아 한국 대사관',
        sourceUrl: 'https://overseas.mofa.go.kr/id-ko/index.do',
      },
    ],
  },
  'Vietnam': {
    officialUrl: 'https://evisa.xuatnhapcanh.gov.vn',
    tips: [
      {
        id: 'vn-evisa', category: 'visa', severity: 'info',
        title: 'e-비자(e-Visa) 사전 신청 권장',
        detail: '한국 여권 소지자는 45일 무비자 입국 가능 (2023년 확대).\n더 긴 체류 또는 복수 입국이 필요하면 e-비자(90일, $25) 신청.\n무비자 연장은 제한적이므로 사전 계획 필요.',
        source: '베트남 이민국 e-비자',
        sourceUrl: 'https://evisa.xuatnhapcanh.gov.vn',
      },
      {
        id: 'vn-currency', category: 'customs', severity: 'warning',
        title: '외화 및 현지 통화 반출입 한도',
        detail: '$5,000 이상 외화 반입 시 세관 신고 필수.\n베트남 동(VND) 1,500만 동 이상 반출 시 신고 대상.',
        source: '베트남 관세청',
        sourceUrl: 'https://www.customs.gov.vn',
      },
    ],
  },
  'Malaysia': {
    officialUrl: 'https://www.imi.gov.my',
    tips: [
      {
        id: 'my-visa', category: 'visa', severity: 'info',
        title: '90일 무비자 입국 (한국 포함)',
        detail: '한국 여권 소지자는 말레이시아 입국 시 90일 무비자 가능.\n입국 스탬프 기재 날짜를 꼭 확인하세요. 연장은 이민청 방문 신청.',
        source: '말레이시아 이민청 (JIM)',
        sourceUrl: 'https://www.imi.gov.my',
      },
      {
        id: 'my-drugs', category: 'security', severity: 'important',
        title: '마약 소지 사형 (엄중 경고)',
        detail: '말레이시아는 마약 밀반입·소지에 사형이 집행됩니다.\n처방약은 처방전 원본 지참 필수. 의심되는 경우 대사관에 사전 문의하세요.',
        source: '말레이시아 왕립경찰 (PDRM)',
        sourceUrl: 'https://www.rmp.gov.my',
      },
    ],
  },
  'Qatar': {
    officialUrl: 'https://portal.moi.gov.qa/wps/portal/MOIInternet/aboutmoiportal/visainformation',
    tips: [
      {
        id: 'qa-visa', category: 'visa', severity: 'info',
        title: '무비자 또는 도착 비자',
        detail: '한국 여권 소지자는 카타르 무비자 입국 가능 (30일).\n도착 비자(QAR 100)도 공항에서 취득 가능.',
        source: '카타르 내무부',
        sourceUrl: 'https://portal.moi.gov.qa/wps/portal/MOIInternet/aboutmoiportal/visainformation',
      },
      {
        id: 'qa-alcohol', category: 'customs', severity: 'warning',
        title: '주류·돼지고기 반입 금지',
        detail: '이슬람 국가인 카타르에는 개인 소비 목적으로도 주류·돼지고기 반입이 불가합니다.\n허가된 호텔·바 등에서만 주류 구매 가능.',
        source: '카타르 관세청',
        sourceUrl: 'https://www.customs.gov.qa',
      },
    ],
  },
  'Philippines': {
    officialUrl: 'https://www.immigration.gov.ph',
    tips: [
      {
        id: 'ph-visa', category: 'visa', severity: 'info',
        title: '30일 무비자 입국',
        detail: '한국 여권은 필리핀 30일 무비자 입국 가능. 현지에서 2개월 단위로 최대 36개월까지 연장 가능.',
        source: '필리핀 이민청 (BI)',
        sourceUrl: 'https://www.immigration.gov.ph',
      },
      {
        id: 'ph-drugs', category: 'security', severity: 'important',
        title: '마약 소지 엄중 단속',
        detail: '필리핀은 마약 관련 범죄에 매우 강경합니다. 소지만으로도 중형 가능.\n처방약은 처방전 지참 필수.',
        source: '주필리핀 한국 대사관',
        sourceUrl: 'https://overseas.mofa.go.kr/ph-ko/index.do',
      },
    ],
  },
  'Turkey': {
    officialUrl: 'https://www.evisa.gov.tr',
    tips: [
      {
        id: 'tr-evisa', category: 'visa', severity: 'important',
        title: 'e-비자 사전 신청 필수',
        detail: '한국 여권 소지자는 터키 입국 전 e-비자($60, 30일)를 사전 신청해야 합니다.\n공항 비자 발급은 e-비자보다 비싸고 줄이 깁니다.',
        source: '터키 전자비자 시스템',
        sourceUrl: 'https://www.evisa.gov.tr',
      },
      {
        id: 'tr-customs', category: 'customs', severity: 'warning',
        title: '골동품·역사 유물 반출 금지',
        detail: '터키의 역사적 유물·골동품은 무단 반출이 엄격히 금지됩니다.\n시장에서 구입한 경우도 공식 허가증이 없으면 공항 세관에서 압수될 수 있습니다.',
        source: '터키 문화관광부',
        sourceUrl: 'https://www.ktb.gov.tr',
      },
    ],
  },
  'Hong Kong': {
    officialUrl: 'https://www.immd.gov.hk',
    tips: [
      {
        id: 'hk-visa', category: 'visa', severity: 'info',
        title: '90일 무비자 입국',
        detail: '한국 여권 소지자는 홍콩 90일 무비자 입국 가능. 중국 본토 비자와는 별개입니다.',
        source: '홍콩 이민국 (IMMD)',
        sourceUrl: 'https://www.immd.gov.hk/eng/services/visas/visit-transit/visit-visa-entry-permit.html',
      },
      {
        id: 'hk-drugs', category: 'security', severity: 'important',
        title: '마약 소지 엄중 (최대 종신형)',
        detail: '홍콩은 마약 소지·밀반입에 매우 엄격한 처벌 (최대 종신형).\n처방약은 처방전 원본 지참 필수.',
        source: '홍콩 세관 (C&ED)',
        sourceUrl: 'https://www.customs.gov.hk',
      },
    ],
  },
  'India': {
    officialUrl: 'https://indianvisaonline.gov.in',
    tips: [
      {
        id: 'in-evisa', category: 'visa', severity: 'important',
        title: 'e-비자 사전 신청 필요',
        detail: '한국 여권 소지자는 인도 e-비자를 출발 최소 4일 전 신청해야 합니다.\n관광 e-비자: 30일/1년/5년 옵션. 비용 $25~$100.\n도착 비자는 없으므로 반드시 사전 발급 필요.',
        source: '인도 e-비자 포털',
        sourceUrl: 'https://indianvisaonline.gov.in/evisa/tvoa.html',
      },
      {
        id: 'in-currency', category: 'customs', severity: 'warning',
        title: '인도 루피 반입 금지',
        detail: '외국인은 인도 루피(INR)를 반입할 수 없습니다. 공항 환전소 이용 필수.\n외화 $5,000 초과 현금 반입 시 세관 신고 필요.',
        source: '인도 관세청',
        sourceUrl: 'https://www.cbic.gov.in',
      },
    ],
  },
};

// ── Country name → tips ───────────────────────────────────────────────────────
const countryData = computed<CountryData | null>(() => {
  const name = props.airport.country;
  return TIPS[name] ?? null;
});

const tips = computed<Tip[]>(() => countryData.value?.tips ?? []);

// ── Style helpers ─────────────────────────────────────────────────────────────
const severityBorder = (s: Severity) => ({
  'border-red-300 dark:border-red-700/60 bg-red-50/30 dark:bg-red-900/10':   s === 'important',
  'border-amber-300 dark:border-amber-700/60 bg-amber-50/30 dark:bg-amber-900/10': s === 'warning',
  'border-black/10 dark:border-white/10': s === 'info',
});

const categoryStyle = (c: Category) => ({
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300': c === 'visa',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300':         c === 'customs',
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300':     c === 'health',
  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300':             c === 'security',
  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300':        c === 'general',
});

const categoryLabel = (c: Category) => ({
  visa: '비자', customs: '세관', health: '건강', security: '보안', general: '일반',
}[c]);
</script>

<style scoped>
.tip-expand-enter-active, .tip-expand-leave-active { transition: opacity 0.2s, transform 0.2s; }
.tip-expand-enter-from, .tip-expand-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
