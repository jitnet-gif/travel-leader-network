<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
    <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-primary">GPS · TTS</p>
          <h1 class="text-2xl font-bold mt-1">Audio Guide for Tour Leaders</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            근처 관광지에 도착하면 자동으로 다국어 음성 안내를 재생합니다.
          </p>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span class="material-symbols-outlined">language</span>
          <span>Multi-language</span>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <label class="text-xs font-semibold text-slate-500 dark:text-slate-400">Language</label>
          <select v-model="language" class="mt-2 w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm py-2 px-3">
            <option value="ko-KR">한국어</option>
            <option value="en-US">English</option>
            <option value="ja-JP">日本語</option>
          </select>
          <div class="mt-3 flex gap-3 text-xs text-slate-600 dark:text-slate-400">
            <label class="flex items-center gap-1">
              <input type="radio" value="short" v-model="scriptMode" class="rounded border-slate-300 dark:border-slate-600" />
              짧게
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" value="long" v-model="scriptMode" class="rounded border-slate-300 dark:border-slate-600" />
              길게(스토리)
            </label>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-2">
          <label class="text-xs font-semibold text-slate-500 dark:text-slate-400">Voice</label>
          <select v-model="voice" class="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm py-2 px-3">
            <option value="default">Auto</option>
            <option v-for="v in filteredVoices" :key="v.name" :value="v.name">{{ v.name }} ({{ v.lang }})</option>
          </select>
          <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 pt-1">
            <input v-model="repeat" type="checkbox" class="rounded border-slate-300 dark:border-slate-600" />
            중복 안내 허용 (재입장 시 재생)
          </label>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <label class="text-xs font-semibold text-slate-500 dark:text-slate-400">Trigger radius (m)</label>
          <input v-model.number="radius" type="number" min="50" max="1000" step="10" class="mt-2 w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm py-2 px-3" />
          <p class="text-[11px] text-slate-500 mt-1">해당 반경 안으로 들어오면 음성이 재생됩니다.</p>
        </div>
      </div>

      <div class="grid md:grid-cols-[2fr_1fr] gap-4">
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between">
          <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span class="material-symbols-outlined" :class="active ? 'text-primary' : ''">podcasts</span>
            <span>{{ active ? (mode === 'simulation' ? '시뮬레이션 중' : 'GPS 안내 중') : '대기' }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs mt-1" :class="gpsColor">
            <span class="material-symbols-outlined text-[18px]">my_location</span>
            <span>GPS 상태: {{ gpsLabel }}</span>
            <button class="ml-auto text-[11px] underline" :disabled="checkingGps" @click="runGpsCheck">
              {{ checkingGps ? '확인 중...' : '다시 확인' }}
            </button>
          </div>
          <div class="flex items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400">
            <label class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">schedule</span>
              <span>시뮬레이션 간격(초)</span>
            </label>
            <input v-model.number="gapSeconds" type="number" min="0.3" max="5" step="0.1" class="w-20 rounded border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs" />
          </div>
          <div class="flex gap-2 mt-3">
            <button
              class="flex-1 bg-primary text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-60"
              :disabled="active || !isSupported"
              @click="startGuide"
            >시작</button>
            <button
              class="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold text-sm disabled:opacity-60"
              :disabled="active || !ttsSupported"
              @click="startSim"
            >시뮬레이션</button>
            <button
              class="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2 rounded-lg font-semibold text-sm disabled:opacity-60"
              :disabled="!active"
              @click="stop"
            >중지</button>
          </div>
          <p v-if="!isSupported" class="text-xs text-red-500 mt-2">브라우저에서 GPS/음성 권한을 허용해야 합니다.</p>
          <p v-if="error" class="text-xs text-red-500 mt-2">{{ error }}</p>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="text-sm font-semibold">개인 설정 저장</div>
            <span class="text-[11px] text-slate-500 dark:text-slate-400">리더 프로필</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">언어 · 반경 · 음성을 저장해 다음 투어에 재사용합니다.</p>
          <button class="w-full bg-slate-900 text-white dark:bg-primary dark:text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-60" :disabled="saving" @click="saveSettings">
            {{ saving ? '저장 중...' : '설정 저장' }}
          </button>
          <p v-if="saveStatus" class="text-[11px] text-emerald-500">{{ saveStatus }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">my_location</span>
            현재 위치 & 근접 대상
          </h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {{ currentPosition ? `${currentPosition.lat.toFixed(5)}, ${currentPosition.lng.toFixed(5)}` : '대기 중' }}
          </span>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="poi in pois"
            :key="poi.id"
            class="border border-slate-100 dark:border-slate-800 rounded-lg p-3 bg-slate-50/70 dark:bg-slate-800/50"
          >
            <div class="flex items-center justify-between">
              <p class="font-semibold text-sm">{{ poi.name }}</p>
              <span class="text-[10px] text-primary font-bold uppercase">POI</span>
            </div>
            <p class="text-xs text-slate-500 mt-1 whitespace-pre-line">{{ getDisplayText(poi) }}</p>
            <p v-if="currentPosition" class="text-[11px] text-slate-400 mt-1">
              {{ distanceTo(poi).toFixed(0) }} m 거리
            </p>
            <div class="flex gap-2 mt-2">
              <button
                class="flex-1 bg-primary text-white text-xs py-1.5 rounded-md font-semibold disabled:opacity-60"
                :disabled="!ttsSupported"
                @click="forcePlayPoi(poi)"
              >강제 재생</button>
              <button
                class="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-100 text-xs py-1.5 rounded-md font-semibold"
                @click="openInMaps(poi)"
              >지도 보기</button>
              <button
                class="flex-1 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 text-xs py-1.5 rounded-md font-semibold disabled:opacity-60"
                :disabled="downloading === poi.id"
                @click="downloadTts(poi)"
              >{{ downloading === poi.id ? '생성 중...' : 'TTS 파일' }}</button>
            </div>
          </div>
        </div>
      </div>

      <ClientOnly>
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">map</span>
              시뮬레이션 루트 미리보기
            </h2>
            <span class="text-xs text-slate-500 dark:text-slate-400">
              무료 OSM 타일 · Leaflet
            </span>
          </div>
          <div ref="mapEl" class="h-80 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800"></div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            시뮬레이션이나 강제 재생을 누르면 현재 멘트가 파란 포인트로 강조됩니다.
          </p>
        </div>
      </ClientOnly>

      <div v-if="lastAnnouncement" class="bg-primary/10 border border-primary/30 text-primary rounded-xl p-3 text-sm flex items-center gap-2">
        <span class="material-symbols-outlined">volume_up</span>
        <div>
          <p class="font-semibold">최근 안내: {{ lastAnnouncement.text }}</p>
          <p class="text-xs text-primary/80">POI: {{ lastAnnouncement.poiId }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watchEffect, watch } from 'vue';
import { useAudioGuide, type Poi } from '~/composables/useAudioGuide';

declare global {
  interface Window {
    L?: any;
  }
}

const userId = 'demo-leader'; // TODO: replace with auth user id when available
const { isSupported, active, currentPosition, lastAnnouncement, error, start, stop, gpsStatus, checkGps, forcePlay, startSimulation, mode } = useAudioGuide();

const language = ref<'ko-KR' | 'en-US' | 'ja-JP'>('ko-KR');
const radius = ref(200);
const voice = ref('default');
const repeat = ref(false);
const voices = ref<{ name: string; lang: string }[]>([]);
const filteredVoices = computed(() => {
  const base = language.value.split(/[-_]/)[0]?.toLowerCase() || '';
  const matches = voices.value.filter((v) => v.lang.toLowerCase().startsWith(base));
  return matches.length ? matches : voices.value;
});
const saving = ref(false);
const saveStatus = ref('');
const checkingGps = ref(false);
const ttsSupported = computed(() => process.client && typeof window !== 'undefined' && 'speechSynthesis' in window);
const gapSeconds = ref(1.2);
const scriptMode = ref<'short' | 'long'>('short');
const mapReady = ref(false);
const mapEl = ref<HTMLElement | null>(null);
const downloading = ref<string | null>(null);
let L: typeof import('leaflet') | null = null;
let map: any = null;
let routeLayer: any = null;
let currentMarkerLayer: any = null;

const samplePois: Poi[] = [
  {
    id: 'mbcc',
    name: 'Marina Bay Cruise Centre',
    lat: 1.2667383,
    lng: 103.8602571,
    messages: {
      'ko-KR': '마리나 베이 크루즈 센터입니다. 수하물은 1층 드롭존에서 내리시고, 2층 체크인 카운터로 이동하세요.',
      'en-US': 'You are approaching Marina Bay Cruise Centre. Drop luggage on level 1, then proceed to level 2 check-in.',
      'ja-JP': 'マリーナベイクルーズセンターです。1階で荷物を降ろし、2階のチェックインへお進みください。'
    },
    longMessages: {
      'ko-KR': `2012년 문을 연 5억 싱달러짜리 크루즈 게이트웨이입니다. 첫 손님은 보이저 오브 더 시즈, 지금은 22만 톤급 배 2척을 동시에 대처합니다. 80개의 체크인 카운터와 고속 수하물 시스템 덕에 ‘크루즈 공항’이라 불리죠. 옥상 전망대에서는 마리나 베이 샌즈와 슈퍼트리가 한 프레임에 들어옵니다. 하선 후에는 택시·GRAB 픽업 구역이 분리돼 있으니 팀을 색깔 스티커로 맞춰 나누면 이동이 빠릅니다. 카야토스트와 코피로 간단히 에너지를 채우고, 다음 정원까지는 차로 5분 남짓입니다.`
    }
  },
  {
    id: 'gardens',
    name: 'Gardens by the Bay',
    lat: 1.2815683,
    lng: 103.8636132,
    messages: {
      'ko-KR': '가든스 바이 더 베이에 도착했습니다. 플라워 돔과 클라우드 포레스트 입구가 앞에 있습니다.',
      'en-US': 'Welcome to Gardens by the Bay. Flower Dome and Cloud Forest entrances are ahead.',
      'ja-JP': 'ガーデンズ・バイ・ザ・ベイに到着しました。フラワードームとクラウドフォレストの入口があります。'
    },
    longMessages: {
      'ko-KR': `2012년 6월 개장한 105헥타르의 도심형 정원입니다. 50m 슈퍼트리는 태양광 패널과 배기 덕트를 품은 ‘숨 쉬는 나무’이고, 두 온실은 지구 기후를 보존하는 거대한 타임캡슐입니다. 22m 높이 OCBC 스카이웨이에서 19:45/20:45 라이트쇼를 보면 음악과 불빛이 숲을 교회처럼 만들죠. 플라워돔→클라우드 포레스트(인공폭포)→슈퍼트리 순서로 돌면 피로가 덜합니다. 식사는 베이프런트 MRT 쪽 ‘Satay by the Bay’가 가성비 최고, 기념품은 공기정화식물 키트나 슈퍼트리 자석을 추천합니다.`
    }
  },
  {
    id: 'merlion',
    name: 'Merlion Park',
    lat: 1.2867449,
    lng: 103.8543872,
    messages: {
      'ko-KR': '멀라이언 파크입니다. 단체 사진 포인트는 분수 정면 좌측 데크입니다.',
      'en-US': 'Merlion Park ahead. Best group photo spot is on the left deck facing the fountain.',
      'ja-JP': 'マーライオンパークです。噴水を正面にして左側デッキが写真スポットです。'
    },
    longMessages: {
      'ko-KR': `1972년 탄생한 8.6m, 70톤의 상징 조각입니다. 1997년 다리 공사로 가려져 2002년 지금 자리로 바지선에 실려 이사했죠. 머리는 ‘사자를 본 산닐라 우타마’ 전설, 꼬리는 어촌 테마섹을 뜻합니다. 낮에는 분수 정면, 밤에는 시티 라이트와 함께 실루엣 샷이 베스트. 근처 글러턴스 베이에서 호키엔미와 타이거맥주를 테이크아웃해 잔디에 앉으면 ‘밤피크닉’ 완료. 기념품으론 미니 머라이언 스노우글로브가 가볍고 안전합니다.`
    }
  },
  {
    id: 'raffles',
    name: 'Raffles Hotel',
    lat: 1.294889,
    lng: 103.854483,
    messages: {
      'ko-KR': '래플스 호텔입니다. 체크인 로비는 메인 아치 안쪽에 있습니다.',
      'en-US': 'Arriving at Raffles Hotel. Check-in lobby is through the main arch.',
      'ja-JP': 'ラッフルズホテル到着。チェックインロビーはメインアーチの奥です。'
    },
    longMessages: {
      'ko-KR': `1887년 10실 방갈로로 출발해 싱가포르를 대표하는 네오 르네상스 호텔이 되었습니다. 1987년 국가기념물로 지정되었고, 2017~2019년 대대적 복원 후 스마트룸과 유서 깊은 베란다가 공존합니다. 롱바는 싱가포르 슬링의 고향—천장 시에닝팬 아래 땅콩껍질을 바닥에 버리는 독특한 문화를 경험하세요. 추천 동선은 코트야드 정원에서 베란다 샷 → 롱바 슬링 한 잔 → 티핀룸 커리(사전예약). 선물로는 슬링 미니병 세트나 땅콩 캔이 가볍습니다.`
    }
  },
  {
    id: 'chinatown',
    name: 'Chinatown Heritage Centre',
    lat: 1.2835298,
    lng: 103.8442036,
    messages: {
      'ko-KR': '차이나타운 헤리티지 센터입니다. 투어 동선은 2층 전시부터 시작하세요.',
      'en-US': 'Chinatown Heritage Centre. Start the group on level 2 exhibits.',
      'ja-JP': 'チャイナタウン・ヘリテージセンターです。2階展示からご案内ください。'
    },
    longMessages: {
      'ko-KR': `파고다 스트리트 46·48·50번지, 쇼프하우스 세 채를 이어 1950년대 이민자 생활을 완벽 복원한 몰입형 박물관입니다. 삼수이(홍색 두건 여성 노동자)의 하루, 트라이쇼 종소리, 공용 우물물 퍼오기까지 오디오·냄새·빛으로 살아납니다. 3층 빨래줄 다락은 사진 포인트, 1층 한 평 미용실 네온은 추억샷 명소. 관람 뒤 스미스 스트리트 푸드스트리트에서 블랙페퍼 크랩과 칭다오 생맥 한 잔이면 ‘시간여행’ 마무리. 기프트숍의 타자기 메모지, 손바느질 파우치는 단체 선물로 딱입니다.`
    }
  }
];

const { data: apiPois } = await useFetch<Poi[]>('/api/audio-pois');
const pois = computed<Poi[]>(() => apiPois.value && apiPois.value.length ? apiPois.value : samplePois);

const { data: settings } = await useFetch('/api/leader-settings', { query: { user_id: userId } });
watchEffect(() => {
  if (!settings.value) return;
  language.value = (settings.value.language as any) || 'ko-KR';
  radius.value = settings.value.radius_m || 200;
  voice.value = settings.value.voice || 'default';
  repeat.value = Boolean(settings.value.repeat);
});

const regionCollator = new Intl.Collator(undefined, { sensitivity: 'base' });
const getRegionCode = (lang: string) => {
  const match = lang.match(/[-_](\w{2,3})/);
  return (match ? match[1] : lang).toUpperCase();
};

const loadVoices = () => {
  if (!process.client || !('speechSynthesis' in window)) return;
  const list = window.speechSynthesis.getVoices();
  const sorted = list.slice().sort((a, b) => {
    const regionCompare = regionCollator.compare(getRegionCode(a.lang), getRegionCode(b.lang));
    if (regionCompare !== 0) return regionCompare;
    return regionCollator.compare(a.name, b.name);
  });
  voices.value = sorted.map((v) => ({ name: v.name, lang: v.lang }));
};

watch(language, () => {
  if (voice.value === 'default') return;
  const exists = filteredVoices.value.some((v) => v.name === voice.value);
  if (!exists) voice.value = 'default';
});

const ensureLeaflet = async () => {
  if (!process.client) return null;
  if (L) return L;
  if (!document.getElementById('leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  await new Promise<void>((resolve, reject) => {
    if (window.L) return resolve();
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Leaflet load failed'));
    document.head.appendChild(script);
  });
  // @ts-ignore
  L = window.L;
  return L;
};

const fitAndDraw = () => {
  if (!map || !L || !routeLayer) return;
  routeLayer.clearLayers();
  if (currentMarkerLayer) {
    currentMarkerLayer.remove();
    currentMarkerLayer = null;
  }
  if (!pois.value.length) return;
  const latlngs = pois.value.map((p) => [p.lat, p.lng]) as [number, number][];
  routeLayer.addLayer(L.polyline(latlngs, { color: '#0ea5e9', weight: 4, opacity: 0.7 }));
  latlngs.forEach((pt, idx) => {
    const poi = pois.value[idx];
    const isActive = lastAnnouncement.value?.poiId === poi.id;
    const marker = L.circleMarker(pt, {
      radius: 9,
      weight: 2,
      color: isActive ? '#0ea5e9' : '#475569',
      fillColor: isActive ? '#0ea5e9' : '#ffffff',
      fillOpacity: 0.95
    }).bindTooltip(`${idx + 1}. ${poi.name}`, {
      permanent: true,
      direction: 'top',
      className: 'map-label'
    });
    routeLayer.addLayer(marker);
    if (isActive) currentMarkerLayer = marker;
  });
  map.fitBounds(L.latLngBounds(latlngs).pad(0.2));
};

const initMap = async () => {
  if (!process.client || mapReady.value) return;
  await ensureLeaflet();
  if (!L || !mapEl.value) return;
  map = L.map(mapEl.value, {
    zoomControl: true,
    worldCopyJump: true
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  routeLayer = L.layerGroup().addTo(map);
  mapReady.value = true;
  fitAndDraw();
};

onMounted(() => {
  loadVoices();
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  checkingGps.value = true;
  checkGps().finally(() => {
    checkingGps.value = false;
  });
  initMap();
});

watch(pois, () => fitAndDraw(), { deep: true });
watch(() => lastAnnouncement.value?.poiId, () => fitAndDraw());

const distanceTo = (poi: Poi) => {
  if (!currentPosition.value) return Infinity;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(poi.lat - currentPosition.value.lat);
  const dLon = toRad(poi.lng - currentPosition.value.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(currentPosition.value.lat)) * Math.cos(toRad(poi.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const startGuide = () => {
  start(pois.value, {
    language: language.value,
    radiusMeters: radius.value,
    voice: voice.value === 'default' ? undefined : voice.value,
    repeat: repeat.value,
    useLongForm: scriptMode.value === 'long'
  });
};

const runGpsCheck = async () => {
  checkingGps.value = true;
  await checkGps();
  checkingGps.value = false;
};

const forcePlayPoi = (poi: Poi) => {
  forcePlay(poi, {
    language: language.value,
    voice: voice.value === 'default' ? undefined : voice.value,
    useLongForm: scriptMode.value === 'long'
  });
};

const startSim = () => {
  startSimulation(pois.value, {
    language: language.value,
    voice: voice.value === 'default' ? undefined : voice.value,
    repeat: true,
    gapMs: Math.max(0, gapSeconds.value) * 1000,
    useLongForm: scriptMode.value === 'long'
  });
};

const openInMaps = (poi: Poi) => {
  const query = poi.name
    ? encodeURIComponent(poi.name)
    : `${poi.lat},${poi.lng}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(url, '_blank', 'noopener');
};

const copySnippet = (poi: Poi) => {
  const text = getDisplayText(poi);
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
  }
};

const downloadTts = async (poi: Poi) => {
  const text = getDisplayText(poi);
  downloading.value = poi.id;
  try {
    const res = await fetch('/api/audio-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: 'alloy', format: 'mp3' })
    });
    if (!res.ok) {
      const message = await res.text();
      throw new Error(message || 'TTS request failed');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${poi.id}-${scriptMode.value}.mp3`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert('TTS 생성에 실패했습니다. 서버 OPENAI_API_KEY, 네트워크 연결을 확인하세요.');
  } finally {
    downloading.value = null;
  }
};

const saveSettings = async () => {
  saving.value = true;
  saveStatus.value = '';
  try {
    await $fetch('/api/leader-settings', {
      method: 'POST',
      body: {
        user_id: userId,
        language: language.value,
        radius_m: radius.value,
        voice: voice.value,
        repeat: repeat.value
      }
    });
    saveStatus.value = '저장 완료';
  } catch (err: any) {
    saveStatus.value = err?.data?.error || '저장 실패';
  } finally {
    saving.value = false;
  }
};

const gpsLabel = computed(() => {
  switch (gpsStatus.value) {
    case 'ok':
      return '연결됨';
    case 'checking':
      return '확인 중';
    case 'denied':
      return '권한 차단됨';
    case 'error':
      return '오류';
    case 'unsupported':
      return '미지원';
    default:
      return '대기';
  }
});

const gpsColor = computed(() => {
  switch (gpsStatus.value) {
    case 'ok':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'denied':
    case 'error':
      return 'text-red-500';
    case 'checking':
      return 'text-amber-500';
    case 'unsupported':
      return 'text-slate-500';
    default:
      return 'text-slate-500';
  }
});

const getDisplayText = (poi: Poi) => {
  if (scriptMode.value === 'long' && poi.longMessages && (poi.longMessages[language.value] || poi.longMessages['en-US'])) {
    return poi.longMessages[language.value] || poi.longMessages['en-US'];
  }
  return poi.messages[language.value] || poi.messages['en-US'] || poi.name;
};

definePageMeta({ layout: false });
</script>

<style scoped>
.leaflet-container {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
.map-label {
  background: rgba(15, 23, 42, 0.85);
  color: #f8fafc;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);
  font-size: 11px;
}
</style>
