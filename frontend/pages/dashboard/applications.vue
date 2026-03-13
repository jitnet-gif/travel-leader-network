<template>
  <div class="space-y-8">
    <SectionHeader
      :eyebrow="t('dashboardApplications.eyebrow')"
      :title="t('dashboardApplications.title')"
      :subtitle="t('dashboardApplications.subtitle')"
    />
    <div class="section-grid">
      <Card v-for="item in applications" :key="item.title">
        <h3 class="text-lg font-display">{{ item.title }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('dashboardApplications.status') }}: {{ item.status }}</p>
        <p class="mt-2 text-xs text-black/50 dark:text-white/50">{{ item.submitted }}</p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();

const applications = computed(() => ta<{ title: string; status: string; submitted: string }>('dashboardApplications.items'));

definePageMeta({
  middleware: ['auth']
});
</script>
