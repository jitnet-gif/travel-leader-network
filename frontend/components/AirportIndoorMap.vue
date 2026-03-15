<template>
  <div class="space-y-3">

    <!-- Header row -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm font-semibold text-black/70 dark:text-white/70">{{ t('airport.indoorMap') }}</p>
      <div class="flex flex-wrap items-center gap-1.5">
        <a
          :href="googleMapsUrl"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1 rounded-full border border-ocean/40 px-3 py-1 text-xs font-semibold text-ocean hover:bg-ocean/5 transition"
        >
          🗺️ {{ t('airport.indoor.openGoogle') }}
        </a>
        <a
          v-if="officialUrl"
          :href="officialUrl"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1 rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-black/60 hover:bg-black/5 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/5 transition"
        >
          🏢 {{ t('airport.indoor.officialSite') }}
        </a>
      </div>
    </div>

    <!-- Floor selector -->
    <div class="space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-black/40 dark:text-white/40 shrink-0">층 선택</span>
        <div class="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          <button
            v-for="floor in floors"
            :key="floor.label"
            type="button"
            class="shrink-0 rounded-full border px-3 py-1 text-xs font-bold transition"
            :class="selectedFloor?.label === floor.label
              ? 'border-ocean bg-ocean text-white'
              : 'border-black/15 text-black/60 hover:border-ocean/50 hover:text-ocean dark:border-white/20 dark:text-white/50'"
            :title="floor.desc"
            @click="selectedFloor = selectedFloor?.label === floor.label ? null : floor"
          >
            {{ floor.label }}
          </button>
        </div>
      </div>
      <Transition name="fade-slide">
        <p v-if="selectedFloor" class="text-xs text-ocean/80 dark:text-ocean/70 pl-1">
          {{ selectedFloor.label }} — {{ selectedFloor.desc }}
        </p>
      </Transition>
    </div>

    <!-- Official Airport Map (실제 실내도) - 정보가 있을 때만 -->
    <div v-if="officialUrl" class="rounded-xl bg-gradient-to-br from-ocean/10 to-sky/10 border border-ocean/30 p-4 text-center">
      <p class="text-xs font-semibold text-black/50 dark:text-white/50 mb-2">{{ t('airport.indoor.officialSite') }}</p>
      <a
        :href="officialUrl"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 rounded-full bg-ocean px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-ocean/90 transition active:scale-95"
      >
        🏢 공항 실내도 보기 (공식)
      </a>
      <p class="mt-2 text-xs text-black/40 dark:text-white/40">정확한 실내 배치도, 시설, 게이트 정보</p>
    </div>

    <!-- Position Map (Leaflet - 위치 확인용) - 정보 없을 때는 더 크게 표시 -->
    <div :class="officialUrl ? 'space-y-2 mt-4' : 'space-y-3'">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold text-black/40 dark:text-white/40">
          {{ officialUrl ? `${airport.name} 위치` : `${airport.name} 위치지도` }}
        </p>
        <a
          v-if="resolvedCoords"
          :href="googleMapsUrl"
          target="_blank"
          rel="noopener"
          class="text-xs font-semibold text-ocean hover:underline"
        >
          🗺️ {{ t('airport.openInMaps') }}
        </a>
      </div>
      <div :class="officialUrl ? 'relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 h-48 sm:h-64' : 'relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 h-64 sm:h-80'">
        <ClientOnly>
          <LeafletMap
            v-if="resolvedCoords"
            :center="resolvedCoords"
            :zoom="selectedFloor ? 20 : 15"
            :place-name="airport.name"
          />
          <div v-else class="flex h-full items-center justify-center bg-slate-50 text-sm text-black/50 dark:bg-slate-800 dark:text-white/50">
            <span>{{ t('airport.indoor.loading') }}</span>
          </div>
        </ClientOnly>
      </div>
    </div>

    <!-- Facility quick-search links (Google Maps) -->
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-black/40 dark:text-white/40">
        {{ t('airport.indoor.facilitySearch') }}
      </p>
      <!-- mobile: 2-column grid / sm+: horizontal scroll row -->
      <div class="grid grid-cols-2 gap-1.5 sm:hidden">
        <a
          v-for="cat in CATEGORIES"
          :key="cat.key"
          :href="facilitySearchUrl(cat)"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition hover:opacity-80 active:scale-95"
          :style="{ backgroundColor: cat.color }"
        >
          <span class="text-base leading-none">{{ cat.icon }}</span>
          <span>{{ t(`airport.indoor.${cat.key}`) }}</span>
        </a>
      </div>
      <div class="hidden sm:flex flex-wrap gap-1.5">
        <a
          v-for="cat in CATEGORIES"
          :key="cat.key"
          :href="facilitySearchUrl(cat)"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white transition hover:opacity-80"
          :style="{ backgroundColor: cat.color }"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ t(`airport.indoor.${cat.key}`) }}</span>
        </a>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';

const props = defineProps<{ airport: Airport }>();
const { t } = useI18n();

// ─── Floor definitions per airport ────────────────────────────────────────────
type FloorDef = { label: string; desc: string };

const FLOOR_DATA: Record<string, FloorDef[]> = {
  ICN: [
    { label: 'B1', desc: '지하철·철도 (AREX)' },
    { label: '1F', desc: '도착 / 수하물 / 입국' },
    { label: '2F', desc: '환승 / 연결통로' },
    { label: '3F', desc: '출발 체크인 카운터' },
    { label: '4F', desc: '출발 면세구역·게이트' },
  ],
  GMP: [
    { label: 'B1', desc: '지하철 연결' },
    { label: '1F', desc: '도착·수하물·입국' },
    { label: '2F', desc: '출발 체크인' },
    { label: '3F', desc: '출발 게이트·면세' },
  ],
  NRT: [
    { label: 'B1', desc: 'JR 나리타 익스프레스' },
    { label: '1F', desc: '도착·입국심사' },
    { label: '2F', desc: '연결통로·버스터미널' },
    { label: '3F', desc: '출발 체크인' },
    { label: '4F', desc: '출발 게이트·면세' },
  ],
  HND: [
    { label: 'B1', desc: '모노레일·철도' },
    { label: '1F', desc: '도착·수하물' },
    { label: '2F', desc: '국내선 도착' },
    { label: '3F', desc: '출발 체크인' },
    { label: '4F', desc: '게이트·레스토랑' },
  ],
  SIN: [
    { label: 'B2', desc: 'MRT 창이 역' },
    { label: 'B1', desc: '환승 지역·버스' },
    { label: '1F', desc: '도착·수하물·입국' },
    { label: '2F', desc: '환승·환전·라운지' },
    { label: '3F', desc: '출발 체크인·면세' },
  ],
  DXB: [
    { label: '1F', desc: '도착·수하물' },
    { label: '2F', desc: '환승·연결통로' },
    { label: '3F', desc: '출발 체크인' },
    { label: '4F', desc: '게이트·면세구역' },
  ],
  LHR: [
    { label: '0F', desc: '지하철·헤드로우 익스프레스' },
    { label: '1F', desc: '도착·수하물' },
    { label: '2F', desc: '환승 홀' },
    { label: '3F', desc: '출발 체크인' },
    { label: '4F', desc: '보안·게이트' },
    { label: '5F', desc: '레스토랑·라운지' },
  ],
};

const DEFAULT_FLOORS: FloorDef[] = [
  { label: 'B1', desc: '지하 (교통·주차)' },
  { label: '1F', desc: '도착·수하물' },
  { label: '2F', desc: '환승·연결' },
  { label: '3F', desc: '출발 체크인' },
  { label: '4F', desc: '게이트·면세' },
];

const floors = computed(() =>
  FLOOR_DATA[props.airport.iata?.toUpperCase()] ?? DEFAULT_FLOORS
);

const selectedFloor = ref<FloorDef | null>(null);

watch(() => props.airport, () => { selectedFloor.value = null; });

// ─── Facility categories ──────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'restroom',   icon: '🚻', color: '#3b82f6', query: 'restroom toilet' },
  { key: 'gate',       icon: '✈️',  color: '#8b5cf6', query: 'gate departure' },
  { key: 'transit',    icon: '🔄', color: '#06b6d4', query: 'transit transfer' },
  { key: 'lounge',     icon: '🛋️',  color: '#f59e0b', query: 'lounge' },
  { key: 'smoking',    icon: '🚬', color: '#6b7280', query: 'smoking area' },
  { key: 'baggage',    icon: '🧳', color: '#10b981', query: 'baggage claim' },
  { key: 'info',       icon: 'ℹ️',  color: '#0ea5e9', query: 'information desk' },
  { key: 'exchange',   icon: '💱', color: '#f97316', query: 'currency exchange' },
  { key: 'restaurant', icon: '🍽️',  color: '#ef4444', query: 'restaurant food' },
  { key: 'prayer',     icon: '🙏', color: '#a855f7', query: 'prayer room chapel' },
] as const;

// ─── Official map URLs ────────────────────────────────────────────────────────
const OFFICIAL_URLS: Record<string, string> = {
  ICN: 'https://www.airport.kr/ap/ko/svc/airportMap.do',
  GMP: 'https://www.airport.kr/ap/ko/svc/airportMap.do',
  NRT: 'https://www.narita-airport.jp/en/terminal/map/',
  HND: 'https://www.haneda-airport.jp/inter/arrival/map/',
  CDG: 'https://www.parisaeroport.fr/en/passengers/access/paris-charles-de-gaulle/airport-map',
  LHR: 'https://www.heathrow.com/transport-and-directions/heathrow-airport-map',
  JFK: 'https://www.jfkairport.com/to-from/airport-maps',
  LAX: 'https://www.flylax.com/lax-map',
  SIN: 'https://www.changiairport.com/en/maps.html',
  DXB: 'https://www.dubaiairports.ae/airport-experience/terminal-guide',
  BCN: 'https://www.aena.es/en/barcelona-el-prat.html',
  AMS: 'https://www.schiphol.nl/en/departing-from-schiphol/page/airport-map/',
  FRA: 'https://www.frankfurt-airport.com/en/terminals-and-lounges/terminals.html',
  IST: 'https://www.igairport.com/en/flights-and-services/terminal-guide',
  BKK: 'https://www.suvarnabhumiairport.com/en/63-terminal-map',
  HKG: 'https://www.hongkongairport.com/en/transport/at-the-airport/airport-map/',
  DOH: 'https://www.hamadairport.com/en/at-the-airport/maps-and-directions',
  SYD: 'https://www.sydneyairport.com.au/info-sheet/terminal-map',
  NBO: 'https://www.kenyaairports.go.ke/jkia/passenger-services/airport-guide/',
};

const officialUrl = computed(() => OFFICIAL_URLS[props.airport.iata] ?? null);

// ─── Coordinate resolution ────────────────────────────────────────────────────
// Precise terminal-center GPS (Google Maps verified)
const PRECISE_COORDS: Record<string, [number, number]> = {
  ICN: [37.4495, 126.4512], GMP: [37.5583, 126.7906],
  NRT: [35.7719, 140.3929], HND: [35.5494, 139.7798],
  KIX: [34.4347, 135.2440], ITM: [34.7855, 135.4382],
  FUK: [33.5859, 130.4511], NGO: [34.8584, 136.8054],
  CTS: [42.7752, 141.6922], OKA: [26.1958, 127.6461],
  SIN: [1.3531,  103.9899], BKK: [13.6900, 100.7501],
  KUL: [2.7456,  101.7099], MNL: [14.5086, 121.0194],
  HKG: [22.3080, 113.9185], DXB: [25.2532,  55.3657],
  AUH: [24.4330,  54.6511], DOH: [25.2731,  51.6081],
  IST: [41.2611,  28.7416], SAW: [40.8983,  29.3092],
  CDG: [49.0097,   2.5479], ORY: [48.7233,   2.3794],
  LHR: [51.4775,  -0.4614], LGW: [51.1481,  -0.1903],
  STN: [51.8860,   0.2389], MAN: [53.3537,  -2.2750],
  AMS: [52.3105,   4.7683], FRA: [50.0379,   8.5622],
  MUC: [48.3538,  11.7861], BER: [52.3667,  13.5033],
  ZRH: [47.4647,   8.5492], GVA: [46.2370,   6.1089],
  VIE: [48.1102,  16.5697], BRU: [50.9014,   4.4844],
  PRG: [50.1008,  14.2600], BUD: [47.4298,  19.2611],
  FCO: [41.8003,  12.2389], MXP: [45.6306,   8.7281],
  BCN: [41.2971,   2.0785], MAD: [40.4719,  -3.5626],
  LIS: [38.7742,  -9.1342], ATH: [37.9364,  23.9445],
  CPH: [55.6180,  12.6508], ARN: [59.6519,  17.9186],
  HEL: [60.3172,  24.9633], OSL: [60.1939,  11.1004],
  PEK: [40.0799, 116.5875], PKX: [39.5098, 116.4105],
  PVG: [31.1434, 121.8052], SHA: [31.1979, 121.3362],
  CAN: [23.3924, 113.2988], TPE: [25.0777, 121.2328],
  DEL: [28.5562,  77.1000], BOM: [19.0896,  72.8656],
  BLR: [13.1986,  77.7066], SGN: [10.8188, 106.6519],
  HAN: [21.2212, 105.8072], CGK: [-6.1256, 106.6559],
  DPS: [-8.7482, 115.1670],
  JFK: [40.6413, -73.7781], EWR: [40.6895, -74.1745],
  LGA: [40.7772, -73.8726], ORD: [41.9742, -87.9073],
  DFW: [32.8998, -97.0403], LAX: [33.9425,-118.4081],
  SFO: [37.6213,-122.3790], MIA: [25.7959, -80.2870],
  ATL: [33.6407, -84.4277], SEA: [47.4502,-122.3088],
  DEN: [39.8561,-104.6737], BOS: [42.3656, -71.0096],
  YYZ: [43.6777, -79.6248], YVR: [49.1967,-123.1815],
  SYD: [-33.9399, 151.1753], MEL: [-37.6690, 144.8410],
  AKL: [-37.0082, 174.7917], NBO: [-1.3192,  36.9275],
  JNB: [-26.1392,  28.2460], GRU: [-23.4356, -46.4731],
  EZE: [-34.8222, -58.5358],
};

const resolvedCoords = computed<[number, number] | null>(() => {
  const iata = props.airport.iata?.toUpperCase();
  if (PRECISE_COORDS[iata]) return PRECISE_COORDS[iata];
  if (props.airport.lat && props.airport.lng) return [props.airport.lat, props.airport.lng];
  return null;
});

// ─── Google Maps URLs ─────────────────────────────────────────────────────────
// open link: full Google Maps URL at precise coords + zoom 19
const googleMapsUrl = computed(() => {
  const c = resolvedCoords.value;
  if (!c) {
    const q = encodeURIComponent(`${props.airport.name} ${props.airport.city} ${props.airport.country}`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }
  const [lat, lng] = c;
  return `https://www.google.com/maps/@${lat},${lng},19z`;
});

// facility chip: search in Google Maps near the airport
const facilitySearchUrl = (cat: { query: string }) => {
  const c = resolvedCoords.value;
  const name = `${props.airport.name} ${cat.query}`;
  if (c) {
    const [lat, lng] = c;
    return `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${lat},${lng},18z`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
};
</script>
