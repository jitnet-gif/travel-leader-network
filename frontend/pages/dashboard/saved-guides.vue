<template>
  <div class="space-y-8">
    <SectionHeader
      :eyebrow="t('dashboardSavedGuides.eyebrow')"
      :title="t('dashboardSavedGuides.title')"
      :subtitle="t('dashboardSavedGuides.subtitle')"
    />
    <div class="section-grid">
      <Card v-for="guide in guides" :key="guide.title">
        <h3 class="text-lg font-display">{{ guide.title }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ guide.body }}</p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();

const guides = computed(() => ta<{ title: string; body: string }>('dashboardSavedGuides.guides'));

definePageMeta({
  middleware: ['auth']
});
</script>
