<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('dashboardMyTours.eyebrow')" :title="t('dashboardMyTours.title')" :subtitle="t('dashboardMyTours.subtitle')" />
    <div class="section-grid">
      <Card v-for="tour in tours" :key="tour.title">
        <h3 class="text-lg font-display">{{ tour.title }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ tour.dates }}</p>
        <ul class="mt-3 space-y-2 text-sm text-black/70 dark:text-white/70">
          <li v-for="item in tour.items" :key="item">{{ item }}</li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();

const tours = computed(() => ta<{ title: string; dates: string; items: string[] }>('dashboardMyTours.tours'));

definePageMeta({
  middleware: ['auth']
});
</script>
