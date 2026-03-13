<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('countries.eyebrow')" :title="t('countries.title')" :subtitle="t('countries.subtitle')" />

    <div class="flex flex-wrap items-center justify-between gap-4">
      <SearchBar v-model="query" :placeholder="t('common.searchPlaceholder')" />
      <BaseButton variant="outline" to="/emergency">{{ t('countries.emergencyButton') }}</BaseButton>
    </div>

    <div class="section-grid">
      <Card v-for="country in filtered" :key="country.id || country.name">
        <h3 class="text-lg font-display">{{ country.name }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('countries.visaLabel') }}: {{ country.visa_requirements || country.visa_info || t('countries.immigrationFallback') }}
        </p>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('countries.embassyLabel') }}: {{ country.embassy || t('countries.immigrationFallback') }}
        </p>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('countries.emergencyLabel') }}: {{ country.emergency_numbers || country.emergency_number || 'N/A' }}
        </p>
        <p class="mt-2 text-xs text-black/40 dark:text-white/40">
          {{ t('countries.immigrationTipsLabel') }}:
          {{ country.immigration_tips || t('countries.immigrationFallback') }}
        </p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { matchesQuery } from '~/composables/useSearch';

type Country = {
  id?: string;
  name: string;
  visa_requirements?: string;
  visa_info?: string;
  embassy?: string;
  emergency_numbers?: string;
  emergency_number?: string;
  immigration_tips?: string;
};

const { t } = useI18n();
const query = ref('');

const { data: countries } = await useFetch<Country[]>('/api/countries');

const filtered = computed(() =>
  (countries.value || []).filter((c) =>
    matchesQuery(query.value, [
      c.name,
      c.visa_requirements,
      c.visa_info,
      c.embassy,
      c.immigration_tips,
      c.emergency_numbers,
      c.emergency_number,
    ])
  )
);
</script>
