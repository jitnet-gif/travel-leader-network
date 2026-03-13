<template>
  <div class="space-y-3">
    <!-- Header + floor selector -->
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-black/70 dark:text-white/70">{{ t('airport.indoorMap') }}</p>
      <div class="flex items-center gap-2">
        <button
          v-for="f in availableFloors"
          :key="f"
          class="rounded-full px-3 py-0.5 text-xs font-semibold transition"
          :class="activeFloor === f
            ? 'bg-ocean text-white'
            : 'border border-black/15 text-black/60 hover:bg-black/5 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/5'"
          @click="setFloor(f)"
        >{{ f }}</button>
      </div>
    </div>

    <!-- Facility filter chips -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="cat in CATEGORIES"
        :key="cat.key"
        class="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition"
        :class="activeCategories.has(cat.key)
          ? 'text-white'
          : 'border border-black/15 text-black/50 hover:bg-black/5 dark:border-white/20 dark:text-white/50 dark:hover:bg-white/5'"
        :style="activeCategories.has(cat.key) ? { backgroundColor: cat.color } : {}"
        @click="toggleCategory(cat.key)"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ t(`airport.indoor.${cat.key}`) }}</span>
      </button>
    </div>

    <!-- Map container -->
    <div class="relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div ref="mapContainer" class="h-80 w-full" />

      <!-- Loading overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80"
      >
        <div class="flex flex-col items-center gap-2 text-sm text-black/60 dark:text-white/60">
          <svg class="h-6 w-6 animate-spin text-ocean" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>{{ t('airport.indoor.loading') }}</span>
        </div>
      </div>

      <!-- No data overlay -->
      <div
        v-if="!loading && noData"
        class="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80"
      >
        <div class="flex flex-col items-center gap-2 text-center text-sm text-black/60 dark:text-white/60 px-6">
          <span class="text-2xl">🗺️</span>
          <p>{{ t('airport.indoor.noData') }}</p>
          <a
            v-if="officialUrl"
            :href="officialUrl"
            target="_blank"
            rel="noopener"
            class="text-xs font-semibold text-ocean hover:underline"
          >{{ t('airport.indoor.officialSite') }}</a>
        </div>
      </div>
    </div>

    <!-- Facility count summary -->
    <div v-if="!loading && !noData" class="flex flex-wrap gap-2">
      <span
        v-for="cat in CATEGORIES"
        :key="cat.key"
        class="flex items-center gap-1 rounded-full border border-black/10 px-2 py-0.5 text-xs text-black/60 dark:border-white/10 dark:text-white/60"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ countByCategory[cat.key] ?? 0 }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';

const props = defineProps<{ airport: Airport }>();
const { t } = useI18n();

// ─── Facility categories ──────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'restroom',   icon: '🚻', color: '#3b82f6', osmFilters: ['amenity=toilets'] },
  { key: 'gate',       icon: '✈️',  color: '#8b5cf6', osmFilters: ['aeroway=gate'] },
  { key: 'transit',    icon: '🔄', color: '#06b6d4', osmFilters: ['aeroway=transfer_node', 'aeroway=terminal'] },
  { key: 'lounge',     icon: '🛋️',  color: '#f59e0b', osmFilters: ['aeroway=lounge'] },
  { key: 'smoking',    icon: '🚬', color: '#6b7280', osmFilters: ['amenity=smoking_area', 'smoking=designated'] },
  { key: 'baggage',    icon: '🧳', color: '#10b981', osmFilters: ['aeroway=baggage_claim'] },
  { key: 'info',       icon: 'ℹ️',  color: '#0ea5e9', osmFilters: ['amenity=information'] },
  { key: 'exchange',   icon: '💱', color: '#f97316', osmFilters: ['amenity=bureau_de_change', 'shop=money_changer'] },
  { key: 'restaurant', icon: '🍽️',  color: '#ef4444', osmFilters: ['amenity=restaurant', 'amenity=fast_food', 'amenity=food_court', 'amenity=cafe'] },
  { key: 'prayer',     icon: '🙏', color: '#a855f7', osmFilters: ['amenity=place_of_worship', 'amenity=prayer_room', 'room=prayer'] },
] as const;

type CategoryKey = typeof CATEGORIES[number]['key'];

// ─── State ────────────────────────────────────────────────────────────────────
const mapContainer = ref<HTMLDivElement | null>(null);
const loading = ref(false);
const noData = ref(false);
const activeFloor = ref<string>('All');
const availableFloors = ref<string[]>(['All']);
const activeCategories = ref<Set<CategoryKey>>(new Set(CATEGORIES.map(c => c.key)));
const countByCategory = ref<Partial<Record<CategoryKey, number>>>({});

let map: any = null;
let markerGroup: any = null;
let allFeatures: { cat: CategoryKey; lat: number; lng: number; name: string; level: string | null }[] = [];

// Official airport map URLs for major airports (IATA -> URL)
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
  PEK: 'https://en.bcia.com.cn/passager/guide/tmap.shtml',
  PVG: 'https://www.shanghaiairport.com/en/airport/map/',
  SYD: 'https://www.sydneyairport.com.au/info-sheet/terminal-map',
  MEL: 'https://www.melbourneairport.com.au/Passengers/Getting-around',
};

const officialUrl = computed(() => OFFICIAL_URLS[props.airport.iata] ?? null);

// ─── Map init + data fetch ────────────────────────────────────────────────────
const initMap = async () => {
  if (!process.client || !mapContainer.value) return;
  const L = await import('leaflet');

  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  });

  const center: [number, number] = props.airport.lat && props.airport.lng
    ? [props.airport.lat, props.airport.lng]
    : [35.5, 139.7];

  map = L.map(mapContainer.value, { zoomControl: true }).setView(center, 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 20,
    minZoom: 14,
  }).addTo(map);

  markerGroup = L.layerGroup().addTo(map);

  await loadFacilities(L);
};

/**
 * 1차: IATA 코드로 공항 경계 area를 지정하여 그 내부 POI만 쿼리
 * OSM aerodrome에 iata 태그가 없는 경우를 위해 2차(radius) fallback도 사용
 */
const buildOverpassQueryByIata = (iata: string): string => {
  const filters = CATEGORIES.flatMap(c =>
    c.osmFilters.map(f => {
      const [k, v] = f.split('=');
      return `  node["${k}"="${v}"](area.ap);
  way["${k}"="${v}"](area.ap);`;
    })
  ).join('\n');

  return `[out:json][timeout:30];
area["aeroway"="aerodrome"]["iata"="${iata.toUpperCase()}"]->.ap;
(
${filters}
);
out center tags;`;
};

const buildOverpassQueryByRadius = (lat: number, lng: number, radiusM = 500): string => {
  const filters = CATEGORIES.flatMap(c =>
    c.osmFilters.map(f => {
      const [k, v] = f.split('=');
      return `  node["${k}"="${v}"](around:${radiusM},${lat},${lng});
  way["${k}"="${v}"](around:${radiusM},${lat},${lng});`;
    })
  ).join('\n');

  return `[out:json][timeout:25];
(
${filters}
);
out center tags;`;
};

const getCategoryForElement = (tags: Record<string, string>): CategoryKey | null => {
  for (const cat of CATEGORIES) {
    for (const filter of cat.osmFilters) {
      const [k, v] = filter.split('=');
      if (tags[k] === v) return cat.key;
    }
  }
  return null;
};

const loadFacilities = async (L: any) => {
  loading.value = true;
  noData.value = false;

  try {
    const { lat, lng } = props.airport;
    let centerLat = lat;
    let centerLng = lng;

    // Geocode if coordinates missing
    if (!centerLat || !centerLng) {
      const place = [props.airport.name, props.airport.city, props.airport.country].filter(Boolean).join(', ');
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(place)}`
      );
      const data = await res.json();
      const first = data?.[0];
      if (!first) { noData.value = true; return; }
      centerLat = Number(first.lat);
      centerLng = Number(first.lon);
    }

    map.setView([centerLat!, centerLng!], 17);

    // 1차: IATA area 경계 쿼리 (공항 건물 내부만)
    let data: any = null;
    try {
      const q1 = buildOverpassQueryByIata(props.airport.iata);
      const r1 = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q1)}`);
      data = await r1.json();
    } catch {
      data = { elements: [] };
    }

    // 2차: IATA area 결과가 없으면 반경 800m로 fallback
    if (!data?.elements?.length) {
      try {
        const q2 = buildOverpassQueryByRadius(centerLat!, centerLng!, 800);
        const r2 = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q2)}`);
        data = await r2.json();
      } catch {
        data = { elements: [] };
      }
    }

    allFeatures = [];
    const counts: Partial<Record<CategoryKey, number>> = {};

    for (const el of data.elements ?? []) {
      const elLat: number = el.lat ?? el.center?.lat;
      const elLng: number = el.lon ?? el.center?.lon;
      if (!elLat || !elLng) continue;

      const cat = getCategoryForElement(el.tags ?? {});
      if (!cat) continue;

      const level: string | null = el.tags?.level ?? el.tags?.['indoor:level'] ?? null;
      const name: string = el.tags?.name ?? el.tags?.ref ?? '';

      allFeatures.push({ cat, lat: elLat, lng: elLng, name, level });
      counts[cat] = (counts[cat] ?? 0) + 1;
    }

    countByCategory.value = counts;

    // Build floor list
    const levels = new Set<string>();
    for (const f of allFeatures) {
      if (f.level !== null) levels.add(f.level);
    }
    availableFloors.value = ['All', ...Array.from(levels).sort()];

    if (allFeatures.length === 0) {
      noData.value = true;
    } else {
      renderMarkers(L);
      // 마커 범위에 맞게 지도 자동 조정
      try {
        const lats = allFeatures.map(f => f.lat);
        const lngs = allFeatures.map(f => f.lng);
        const bounds = [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ];
        map.fitBounds(bounds as any, { padding: [40, 40], maxZoom: 18 });
      } catch {
        // bounds 계산 실패 시 현재 뷰 유지
      }
    }
  } catch (err) {
    console.warn('[IndoorMap] Overpass fetch failed', err);
    noData.value = true;
  } finally {
    loading.value = false;
  }
};

const makeDivIcon = (L: any, cat: typeof CATEGORIES[number]) =>
  L.divIcon({
    className: '',
    html: `<div style="
      background:${cat.color};
      width:28px;height:28px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,.35);
      border:2px solid white;
    ">${cat.icon}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });

const renderMarkers = async (L?: any) => {
  if (!markerGroup) return;
  if (!L) L = await import('leaflet');

  markerGroup.clearLayers();

  const visibleFeatures = allFeatures.filter(f => {
    if (!activeCategories.value.has(f.cat)) return false;
    if (activeFloor.value !== 'All' && f.level !== null && f.level !== activeFloor.value) return false;
    return true;
  });

  const catMap = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

  for (const f of visibleFeatures) {
    const cat = catMap[f.cat];
    const icon = makeDivIcon(L, cat);
    const label = f.name || t(`airport.indoor.${f.cat}`);
    const floorLabel = f.level !== null ? ` (${t('airport.indoor.floor')} ${f.level})` : '';

    const gmUrl = `https://www.google.com/maps/search/?api=1&query=${f.lat},${f.lng}`;
    L.marker([f.lat, f.lng], { icon })
      .bindPopup(`<strong>${label}</strong>${floorLabel}<br><a href="${gmUrl}" target="_blank" rel="noopener" style="font-size:11px;color:#1a73e8;">📍 Google Maps</a>`)
      .addTo(markerGroup);
  }
};

const toggleCategory = (key: CategoryKey) => {
  const next = new Set(activeCategories.value);
  next.has(key) ? next.delete(key) : next.add(key);
  activeCategories.value = next;
  renderMarkers();
};

const setFloor = (f: string) => {
  activeFloor.value = f;
  renderMarkers();
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(initMap);

onBeforeUnmount(() => {
  if (map) { map.remove(); map = null; }
});

watch(
  () => props.airport.iata,
  async () => {
    if (!map) return;
    allFeatures = [];
    countByCategory.value = {};
    availableFloors.value = ['All'];
    activeFloor.value = 'All';
    markerGroup?.clearLayers();
    const L = await import('leaflet');
    await loadFacilities(L);
  }
);
</script>
