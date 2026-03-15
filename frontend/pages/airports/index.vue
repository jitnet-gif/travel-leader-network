<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('airports.eyebrow')" :title="t('airports.title')" :subtitle="t('airports.subtitle')" />

    <div class="flex flex-wrap items-center justify-between gap-4">
      <SearchBar v-model="query" :placeholder="t('airports.searchPlaceholder')" />
      <BaseButton variant="outline" to="/cruise-ports">{{ t('airports.button') }}</BaseButton>
    </div>

    <div ref="gridRef" class="section-grid max-h-[70vh] md:max-h-[78vh] overflow-y-auto overscroll-contain pr-2 md:pr-3">
      <AirportCard v-for="(airport, idx) in filtered" :key="airport.id ?? idx" :airport="airport" @select="openDetails" />
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

const { t } = useI18n();
const query = useGlobalSearch();
const selectedAirport = ref<Airport | null>(null);
const selectedIndex  = ref(0);
const detailOpen = ref(false);
const gridRef = ref<HTMLDivElement | null>(null);

const { data: airports } = await useFetch<Airport[]>('/api/airports');

const filtered = computed(() =>
  (airports.value || []).filter((airport) =>
    matchesQuery(query.value, [airport.name, airport.city, airport.country, airport.iata])
  )
);

const openDetails = (airport: Airport) => {
  const idx = filtered.value.indexOf(airport);
  selectedIndex.value = idx >= 0 ? idx : 0;
  selectedAirport.value = airport;
  detailOpen.value = true;
};

const navigateTo = (idx: number) => {
  const list = filtered.value;
  if (idx < 0 || idx >= list.length) return;
  selectedIndex.value = idx;
  selectedAirport.value = list[idx];
  nextTick(() => {
    const card = gridRef.value?.children[idx] as HTMLElement | undefined;
    card?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
};

const closeDetails = () => {
  detailOpen.value = false;
};
</script>
