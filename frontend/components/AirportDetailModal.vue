<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 flex items-start justify-center bg-black/30 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="mt-2 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-soft dark:bg-slate-900 sm:mt-6 flex flex-col max-h-[92vh] sm:max-h-[88vh] min-h-0">
          <div class="flex items-start justify-between border-b border-black/5 px-4 py-3 sm:px-6 sm:py-4 dark:border-white/10 shrink-0">
            <div class="flex items-start gap-3 min-w-0">
              <!-- Prev / Next arrows -->
              <div v-if="total > 1" class="flex flex-col gap-1 shrink-0 mt-0.5">
                <button
                  type="button"
                  :disabled="currentIndex <= 0"
                  class="flex h-6 w-6 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 text-black/50 dark:text-white/40 transition hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed"
                  title="이전 공항"
                  @click="emit('prev')"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>
                </button>
                <button
                  type="button"
                  :disabled="currentIndex >= total - 1"
                  class="flex h-6 w-6 items-center justify-center rounded-lg border border-black/10 dark:border-white/15 text-black/50 dark:text-white/40 transition hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed"
                  title="다음 공항"
                  @click="emit('next')"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>
              <div class="min-w-0">
                <p class="text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50">
                  {{ airport.iata }}<span v-if="total > 1" class="ml-2 font-normal normal-case tracking-normal">{{ currentIndex + 1 }} / {{ total }}</span>
                </p>
                <h3 class="text-xl font-display leading-tight">{{ airport.name }}</h3>
                <p class="text-sm text-black/60 dark:text-white/60">{{ airport.city }}, {{ airport.country }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                class="relative rounded-full border border-ocean/40 bg-ocean/5 px-3 py-1.5 text-xs font-semibold text-ocean transition hover:bg-ocean/10 focus:outline-none dark:border-ocean/30 dark:bg-ocean/10"
                :title="copied ? '복사됨!' : 'NotebookLM용 브리핑 복사'"
                @click="copyBriefing"
              >
                <span v-if="copied">✅ 복사됨</span>
                <span v-else>📋 브리핑 복사</span>
              </button>
              <a
                href="https://notebooklm.google.com"
                target="_blank"
                rel="noopener"
                class="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/60 transition hover:bg-black/5 dark:border-white/20 dark:text-white/50 dark:hover:bg-white/5"
                title="NotebookLM 열기"
              >🔗 NLM</a>
              <button
                type="button"
                class="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/70 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/5"
                @click="emit('close')"
              >
                {{ t('common.close') }}
              </button>
            </div>
          </div>

          <!-- Tab bar -->
          <div class="flex border-b border-black/10 px-4 sm:px-6 dark:border-white/10 shrink-0">
            <button
              v-for="tab in TABS"
              :key="tab"
              class="mr-4 border-b-2 pb-2 pt-1 text-xs font-semibold transition"
              :class="activeTab === tab
                ? 'border-ocean text-ocean'
                : 'border-transparent text-black/50 hover:text-black/70 dark:text-white/40 dark:hover:text-white/60'"
              @click="activeTab = tab"
            >{{ t(`airport.tab.${tab}`) }}</button>
          </div>

          <!-- ── Location map tab ── -->
          <div v-if="activeTab === 'location'" class="flex flex-col lg:flex-row lg:flex-1 lg:min-h-0 gap-4 overflow-y-auto lg:overflow-hidden p-4 sm:gap-6 sm:p-6">
            <!-- Left: Map (fixed, no independent scroll) -->
            <div class="space-y-3 lg:w-[55%] lg:shrink-0">
              <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-black/70 dark:text-white/70">{{ t('airport.locationMap') }}</p>
                <a
                  class="text-xs font-semibold text-ocean hover:underline"
                  :href="mapsLink"
                  target="_blank"
                  rel="noopener"
                >
                  {{ t('airport.openInMaps') }}
                </a>
              </div>
              <div class="rounded-xl border border-black/10 dark:border-white/10" style="overflow:visible">
                <ClientOnly>
                  <LeafletMap
                    v-if="coords"
                    :center="coords as [number, number]"
                    :zoom="14"
                    :place-name="`${airport.name}, ${airport.city}`"
                    :open-time="airport.open_time"
                    :close-time="airport.close_time"
                    :show-marker="false"
                  />
                  <div v-else class="flex h-72 items-center justify-center bg-slate-50 text-sm text-black/50 dark:bg-slate-800 dark:text-white/50">
                    <span v-if="coordsLoading">{{ t('airport.loadingMap') }}</span>
                    <span v-else>{{ t('airport.mapUnavailable') }}</span>
                  </div>
                </ClientOnly>
              </div>
            </div>

            <!-- Right: Info cards — independently scrollable -->
            <div class="space-y-3 lg:flex-1 lg:overflow-y-auto lg:pr-1">
              <!-- Live flight lookup -->
              <div class="rounded-xl border border-black/10 bg-white p-4 text-sm text-black/70 shadow-sm dark:border-white/10 dark:bg-slate-800/80 dark:text-white/70">
                <div class="flex items-center justify-between">
                  <p class="font-semibold text-black/80 dark:text-white/80">{{ t('airport.liveLookup') }}</p>
                  <span v-if="realtimeLoading" class="text-xs text-ocean">{{ t('airport.loadingMap') }}</span>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <input
                    v-model="flightNumber"
                    class="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/30 dark:border-white/20 dark:bg-slate-900"
                    :placeholder="t('airport.flightPlaceholder')"
                  />
                  <input
                    v-model="flightDate"
                    type="date"
                    class="w-40 rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/30 dark:border-white/20 dark:bg-slate-900"
                  />
                  <BaseButton size="sm" variant="primary" type="button" @click="lookupRealtime">
                    {{ t('airport.lookup') }}
                  </BaseButton>
                </div>
                <p v-if="realtimeError" class="mt-2 text-xs text-red-500 dark:text-red-300">{{ realtimeError }}</p>
                <div v-if="realtimeResult" class="mt-3 space-y-1 text-sm">
                  <p><span class="font-semibold">{{ t('airport.belt') }}:</span> {{ realtimeResult.baggageBelt || t('airport.notAvailable') }}</p>
                  <p><span class="font-semibold">{{ t('airport.terminal') }}:</span> {{ realtimeResult.terminal || t('airport.notAvailable') }}</p>
                  <p><span class="font-semibold">{{ t('airport.gate') }}:</span> {{ realtimeResult.gate || t('airport.notAvailable') }}</p>
                  <p v-if="realtimeResult.status"><span class="font-semibold">{{ t('airport.status') }}:</span> {{ realtimeResult.status }}</p>
                </div>
              </div>

              <!-- Terminal count badge -->
              <div class="flex items-center justify-between rounded-xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm dark:border-white/10 dark:bg-slate-800/60">
                <span class="text-black/60 dark:text-white/60">{{ t('airport.terminals', { count: airport.terminals }) }}</span>
                <span class="font-bold text-black/80 dark:text-white/80">{{ airport.terminals }}</span>
              </div>

              <!-- Detailed facility info fetched via Claude web search -->
              <AirportFacilityInfo :airport="airport" />
            </div>
          </div>

          <!-- ── Indoor map tab ── -->
          <div v-if="activeTab === 'indoor'" class="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ClientOnly>
              <AirportIndoorMap :airport="airport" />
            </ClientOnly>
          </div>

          <!-- ── Immigration tips tab ── -->
          <AirportImmigrationTips v-if="activeTab === 'immigration'" :airport="airport" />

          <!-- ── Culture / dress & drinks tab ── -->
          <AirportCultureTips v-if="activeTab === 'culture'" :airport="airport" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';
import { generateAirportBriefing } from '~/composables/useBriefingExport';

type RealtimeInfo = {
  baggageBelt: string | null;
  terminal: string | null;
  gate: string | null;
  status: string | null;
};

type FacilityMarker = {
  name: string;
  lat: number;
  lng: number;
  icon: string;
  color: string;
  category?: string;
};

const props = defineProps<{
  airport: Airport;
  open: boolean;
  currentIndex?: number;
  total?: number;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'prev'): void;
  (e: 'next'): void;
}>();

const { t } = useI18n();

// ── Facility categories ────────────────────────────────────────────────────────
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

// ── Briefing export ──────────────────────────────────────────────────────────
const copied = ref(false);
const copyBriefing = async () => {
  const text = generateAirportBriefing(props.airport);
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2500);
  } catch {
    // fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2500);
  }
};

const TABS = ['location', 'indoor', 'immigration', 'culture'] as const;
type TabKey = typeof TABS[number];
const activeTab = ref<TabKey>('location');

const coords = ref<[number, number] | null>(null);
const coordsLoading = ref(false);
const flightNumber = ref('');
const flightDate = ref(new Date().toISOString().slice(0, 10));
const realtimeResult = ref<RealtimeInfo | null>(null);
const realtimeError = ref<string | null>(null);
const realtimeLoading = ref(false);

const mapsLink = computed(() => {
  const query = [props.airport.name, props.airport.city, props.airport.country].filter(Boolean).join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
});

// ── Facility markers ───────────────────────────────────────────────────────────
const facilityMarkers = computed<FacilityMarker[]>(() => {
  if (!coords.value) return [];

  const [baseLng, baseLat] = coords.value;

  // Generate facility markers with slight offsets from airport center
  return CATEGORIES.map((cat, idx) => {
    // Create a radius from airport center with slight offset per category
    const angle = (idx / CATEGORIES.length) * Math.PI * 2;
    const radius = 0.004; // ~400m from center
    const lat = baseLat + Math.sin(angle) * radius;
    const lng = baseLng + Math.cos(angle) * radius;

    return {
      name: cat.key.charAt(0).toUpperCase() + cat.key.slice(1),
      lat,
      lng,
      icon: cat.icon,
      color: cat.color,
      category: cat.key
    };
  });
});

const fetchCoords = async () => {
  if (!process.client || !props.open) return;
  if (coords.value) return;

  const { lat, lng } = props.airport;
  if (lat && lng) {
    coords.value = [lng, lat];
    return;
  }

  coordsLoading.value = true;
  try {
    const place = [props.airport.name, props.airport.city, props.airport.country].filter(Boolean).join(', ');
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(place)}`
    );
    const data = await response.json();
    const first = data?.[0];
    if (first?.lon && first?.lat) {
      coords.value = [Number(first.lon), Number(first.lat)];
    }
  } catch (error) {
    console.warn('Geocoding failed', error);
  } finally {
    coordsLoading.value = false;
  }
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      coords.value = null;
      fetchCoords();
    } else {
      coordsLoading.value = false;
      coords.value = null;
    }
  }
);

watch(
  () => props.airport,
  () => {
    coords.value = null;
    if (props.open) fetchCoords();
  }
);

onMounted(() => {
  if (props.open) fetchCoords();
});

// Keyboard arrow navigation
const onKeyDown = (e: KeyboardEvent) => {
  if (!props.open) return;
  if (e.key === 'ArrowUp')   { e.preventDefault(); emit('prev'); }
  if (e.key === 'ArrowDown') { e.preventDefault(); emit('next'); }
  if (e.key === 'Escape')    emit('close');
};
onMounted(()        => window.addEventListener('keydown', onKeyDown));
onBeforeUnmount(()  => window.removeEventListener('keydown', onKeyDown));

const lookupRealtime = async () => {
  realtimeError.value = null;
  realtimeResult.value = null;
  if (!flightNumber.value.trim()) {
    realtimeError.value = t('airport.flightRequired');
    return;
  }
  realtimeLoading.value = true;
  try {
    const result = await $fetch<RealtimeInfo>(`/api/flights/${encodeURIComponent(flightNumber.value.trim())}`, {
      query: { date: flightDate.value }
    });
    realtimeResult.value = result;
  } catch (error: any) {
    realtimeError.value = error?.statusMessage || error?.message || t('airport.lookupFailed');
  } finally {
    realtimeLoading.value = false;
  }
};
</script>
