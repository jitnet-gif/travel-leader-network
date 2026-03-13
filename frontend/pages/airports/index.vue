<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('airports.eyebrow')" :title="t('airports.title')" :subtitle="t('airports.subtitle')" />

    <div class="flex flex-wrap items-center justify-between gap-4">
      <SearchBar v-model="query" :placeholder="t('airports.searchPlaceholder')" />
      <BaseButton variant="outline" to="/cruise-ports">{{ t('airports.button') }}</BaseButton>
    </div>

    <div class="section-grid max-h-[70vh] md:max-h-[78vh] overflow-y-auto overscroll-contain pr-2 md:pr-3">
      <AirportCard v-for="(airport, idx) in filtered" :key="airport.id ?? idx" :airport="airport" @select="openDetails" />
    </div>

    <AirportDetailModal v-if="selectedAirport" :open="detailOpen" :airport="selectedAirport" @close="closeDetails" />
  </div>
</template>

<script setup lang="ts">
import AirportDetailModal from '~/components/AirportDetailModal.vue';
import type { Airport } from '~/types/airport';
import { matchesQuery } from '~/composables/useSearch';

const { t } = useI18n();
const query = ref('');
const selectedAirport = ref<Airport | null>(null);

onMounted(() => { query.value = ''; });
const detailOpen = ref(false);

const { data: airports } = await useFetch<Airport[]>('/api/airports');

const filtered = computed(() =>
  (airports.value || []).filter((airport) =>
    matchesQuery(query.value, [airport.name, airport.city, airport.country, airport.iata])
  )
);

const openDetails = (airport: Airport) => {
  selectedAirport.value = airport;
  detailOpen.value = true;
};

const closeDetails = () => {
  detailOpen.value = false;
  // keep selectedAirport cached to avoid extra geocode calls; cleared on next open set
};
</script>
