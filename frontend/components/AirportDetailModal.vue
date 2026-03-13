<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 flex items-start justify-center bg-black/30 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="mt-6 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-soft dark:bg-slate-900">
          <div class="flex items-start justify-between border-b border-black/5 px-6 py-4 dark:border-white/10">
            <div>
              <p class="text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50">{{ airport.iata }}</p>
              <h3 class="text-xl font-display leading-tight">{{ airport.name }}</h3>
              <p class="text-sm text-black/60 dark:text-white/60">{{ airport.city }}, {{ airport.country }}</p>
            </div>
            <button
              type="button"
              class="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/70 transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/5"
              @click="emit('close')"
            >
              {{ t('common.close') }}
            </button>
          </div>

          <!-- Tab bar -->
          <div class="flex border-b border-black/10 px-6 dark:border-white/10">
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

          <div class="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <!-- ── Location map tab ── -->
            <template v-if="activeTab === 'location'">
            <div class="space-y-3">
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
              <div class="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                <ClientOnly>
                  <LeafletMap v-if="coords" :center="coords as [number, number]" :zoom="9" />
                  <div v-else class="flex h-72 items-center justify-center bg-slate-50 text-sm text-black/50 dark:bg-slate-800 dark:text-white/50">
                    <span v-if="coordsLoading">{{ t('airport.loadingMap') }}</span>
                    <span v-else>{{ t('airport.mapUnavailable') }}</span>
                  </div>
                </ClientOnly>
              </div>
            </div>

            <div class="space-y-3">
              <p class="text-sm font-semibold text-black/70 dark:text-white/70">{{ t('airport.quickFacts') }}</p>
              <div class="rounded-xl border border-black/10 bg-slate-50 p-4 text-sm text-black/70 dark:border-white/10 dark:bg-slate-800/60 dark:text-white/70">
                <div class="flex items-center justify-between py-1">
                  <span>{{ t('airport.terminals', { count: airport.terminals }) }}</span>
                  <span class="font-semibold">{{ airport.terminals }}</span>
                </div>
                <div class="flex items-center justify-between py-1">
                  <span>{{ t('airport.smokingAreas') }}</span>
                  <span class="font-semibold">{{ airport.smoking_area ? t('common.yes') : t('common.no') }}</span>
                </div>
                <div class="flex items-center justify-between py-1">
                  <span>{{ t('airport.lounges') }}</span>
                  <span class="font-semibold">{{ airport.lounge ? t('common.available') : t('common.limited') }}</span>
                </div>
                <div class="flex items-center justify-between py-1">
                  <span>{{ t('airport.subway') }}</span>
                  <span class="font-semibold">{{ airport.subway ? t('common.connected') : t('common.no') }}</span>
                </div>
                <div class="flex items-center justify-between py-1">
                  <span>{{ t('airport.taxi') }}</span>
                  <span class="font-semibold">{{ airport.taxi ? t('common.yes') : t('common.no') }}</span>
                </div>
                <div class="flex items-center justify-between py-1">
                  <span>{{ t('airport.bus') }}</span>
                  <span class="font-semibold">{{ airport.bus ? t('common.yes') : t('common.no') }}</span>
                </div>
              </div>
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
            </div>
            </template>

            <!-- ── Indoor map tab ── -->
            <template v-if="activeTab === 'indoor'">
              <div class="lg:col-span-2">
                <ClientOnly>
                  <AirportIndoorMap :airport="airport" />
                </ClientOnly>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';

type RealtimeInfo = {
  baggageBelt: string | null;
  terminal: string | null;
  gate: string | null;
  status: string | null;
};

const props = defineProps<{ airport: Airport; open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const { t } = useI18n();

const TABS = ['location', 'indoor'] as const;
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
