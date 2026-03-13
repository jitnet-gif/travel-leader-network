<template>
  <div class="space-y-8">
    <SectionHeader
      :eyebrow="t('dashboardMessages.eyebrow')"
      :title="t('dashboardMessages.title')"
      :subtitle="t('dashboardMessages.subtitle')"
    />
    <div class="section-grid">
      <Card v-for="message in messages" :key="message.sender">
        <h3 class="text-lg font-display">{{ message.sender }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ message.body }}</p>
        <p class="mt-2 text-xs text-black/50 dark:text-white/50">{{ message.time }}</p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();

const messages = computed(() => ta<{ sender: string; body: string; time: string }>('dashboardMessages.items'));

definePageMeta({
  middleware: ['auth']
});
</script>
