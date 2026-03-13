<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('education.eyebrow')" :title="t('education.title')" :subtitle="t('education.subtitle')" />
    <div class="section-grid">
      <Card v-for="card in cards" :key="card.title">
        <h3 class="text-lg font-display">{{ card.title }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ card.body }}</p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();

const cards = computed(() => ta<{ title: string; body: string }>('education.cards'));
</script>
