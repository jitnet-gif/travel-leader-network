<template>
  <Card
    role="button"
    tabindex="0"
    class="group cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
    @click="emit('select', airport)"
    @keyup.enter.prevent="emit('select', airport)"
    @keyup.space.prevent="emit('select', airport)"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-black/50 dark:text-white/50">{{ airport.iata }}</p>
        <h3 class="text-lg font-display">{{ airport.name }}</h3>
        <p class="mt-1 text-sm text-black/60 dark:text-white/60">{{ airport.city }}, {{ airport.country }}</p>
      </div>
      <span class="rounded-full bg-sky/70 px-3 py-1 text-xs font-semibold text-black/70 dark:bg-slate-800 dark:text-white/70">
        {{ t('airport.terminals', { count: airport.terminals }) }}
      </span>
    </div>
    <div class="mt-4 grid gap-2 text-sm text-black/70 dark:text-white/70">
      <div class="flex items-center justify-between">
        <span>{{ t('airport.smokingAreas') }}</span>
        <span class="font-semibold">{{ airport.smoking_area ? t('common.yes') : t('common.no') }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>{{ t('airport.lounges') }}</span>
        <span class="font-semibold">{{ airport.lounge ? t('common.available') : t('common.limited') }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>{{ t('airport.subway') }}</span>
        <span class="font-semibold">{{ airport.subway ? t('common.connected') : t('common.no') }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>{{ t('airport.taxi') }}</span>
        <span class="font-semibold">{{ airport.taxi ? t('common.yes') : t('common.no') }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>{{ t('airport.bus') }}</span>
        <span class="font-semibold">{{ airport.bus ? t('common.yes') : t('common.no') }}</span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';

defineProps<{ airport: Airport }>();
const emit = defineEmits<{
  (e: 'select', airport: Airport): void;
}>();

const { t } = useI18n();
</script>
