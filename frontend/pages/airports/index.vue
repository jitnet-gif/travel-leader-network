<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('airports.eyebrow')" :title="t('airports.title')" :subtitle="t('airports.subtitle')" />

    <div class="flex flex-wrap items-center justify-between gap-3">
      <SearchBar v-model="query" :placeholder="t('airports.searchPlaceholder')" />
      <div class="flex items-center gap-2">
        <!-- GPS 내 위치 버튼 -->
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
          :class="sortByLocation
            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400'"
          :disabled="gpsStatus === 'unsupported' || gpsStatus === 'denied'"
          :title="gpsStatus === 'denied' ? 'GPS 권한이 거부되었습니다' : gpsStatus === 'unsupported' ? 'GPS를 지원하지 않는 기기입니다' : '내 위치 기준 정렬'"
          @click="toggleGps"
        >
          <span>📍</span>
          <span v-if="gpsStatus === 'checking'" class="animate-pulse">위치 확인 중…</span>
          <span v-else-if="sortByLocation">내 위치 기준</span>
          <span v-else>내 위치 기준</span>
        </button>
        <BaseButton variant="outline" to="/cruise-ports">{{ t('airports.button') }}</BaseButton>
      </div>
    </div>

    <div ref="gridRef" class="section-grid max-h-[70vh] md:max-h-[78vh] overflow-y-auto overscroll-contain pr-2 md:pr-3">
      <AirportCard
        v-for="(airport, idx) in filtered"
        :key="airport.id ?? idx"
        :airport="airport"
        :highlight="nearestIata === airport.iata && sortByLocation"
        :distance-km="sortByLocation && position ? getDistKm(airport) : null"
        @select="openDetails"
      />
    </div>

    <AirportDetailModal
      v-if="selectedAirport"
      :open="detailOpen"
      :airport="selectedAirport"
      :current-index="selectedIndex"
      :total="filtered.length"
      @close="closeDetails"
      @prev="navigateTo(selectedIndex - 1)"
      @next="navigateTo(selectedIndex + 1)"
    />
  </div>
</template>

<script setup lang="ts">
import AirportDetailModal from '~/components/AirportDetailModal.vue';
import type { Airport } from '~/types/airport';
import { matchesQuery } from '~/composables/useSearch';
import { useGeolocation, haversineMeters } from '~/composables/useGeolocation';

const { t } = useI18n();
const query = useGlobalSearch();
const selectedAirport = ref<Airport | null>(null);
const selectedIndex   = ref(0);
const detailOpen      = ref(false);
const gridRef         = ref<HTMLDivElement | null>(null);
const sortByLocation  = ref(false);

const { data: airports } = await useFetch<Airport[]>('/api/airports');

const { position, status: gpsStatus, start: startGps, stop: stopGps, nearestAirport } = useGeolocation();

const nearestRef  = nearestAirport(airports.value ?? []);
const nearestIata = computed(() => nearestRef.value?.iata ?? null);

const getDistKm = (a: Airport) => {
  if (!position.value || a.lat == null || a.lng == null) return null;
  return Math.round(haversineMeters(position.value.lat, position.value.lng, a.lat, a.lng) / 100) / 10;
};

const toggleGps = () => {
  sortByLocation.value = !sortByLocation.value;
  if (sortByLocation.value) startGps();
  else stopGps();
};

const filtered = computed(() => {
  const base = (airports.value || []).filter((a) =>
    matchesQuery(query.value, [a.name, a.city, a.country, a.iata])
  );
  if (!sortByLocation.value || !position.value) return base;
  return [...base].sort((a, b) => {
    const dA = (a.lat != null && a.lng != null) ? haversineMeters(position.value!.lat, position.value!.lng, a.lat, a.lng) : Infinity;
    const dB = (b.lat != null && b.lng != null) ? haversineMeters(position.value!.lat, position.value!.lng, b.lat, b.lng) : Infinity;
    return dA - dB;
  });
});

const scrollToCard = (idx: number) => {
  nextTick(() => {
    const container = gridRef.value;
    const card = container?.children[idx] as HTMLElement | undefined;
    if (!container || !card) return;
    const offset = card.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 8;
    container.scrollTo({ top: offset, behavior: 'smooth' });
  });
};

const openDetails = (airport: Airport) => {
  const idx = filtered.value.indexOf(airport);
  selectedIndex.value = idx >= 0 ? idx : 0;
  selectedAirport.value = airport;
  detailOpen.value = true;
  scrollToCard(selectedIndex.value);
};

const navigateTo = (idx: number) => {
  const list = filtered.value;
  if (idx < 0 || idx >= list.length) return;
  selectedIndex.value = idx;
  selectedAirport.value = list[idx];
  scrollToCard(idx);
};

const closeDetails = () => { detailOpen.value = false; };

onBeforeUnmount(() => { if (sortByLocation.value) stopGps(); });
</script>
