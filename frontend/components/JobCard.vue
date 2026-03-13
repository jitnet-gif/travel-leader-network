<template>
  <Card>
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-black/50 dark:text-white/50">{{ job.agency }}</p>
        <h3 class="text-lg font-display">{{ job.title || t('jobs.assignment', { country: job.country }) }}</h3>
        <p class="mt-1 text-sm text-black/60 dark:text-white/60">{{ job.country }} · {{ job.tour_date }}</p>
      </div>
      <span class="rounded-full bg-sky/70 px-3 py-1 text-xs font-semibold text-black/70 dark:bg-slate-800 dark:text-white/70">
        {{ job.salary }}
      </span>
    </div>
    <p class="mt-3 text-sm text-black/70 dark:text-white/70">{{ job.description }}</p>
    <div class="mt-4 flex items-center justify-between">
      <div class="flex gap-2">
        <Tag>{{ t('common.statusOpen') }}</Tag>
        <Tag>{{ t('common.fullTime') }}</Tag>
      </div>
      <BaseButton variant="outline">{{ t('common.apply') }}</BaseButton>
    </div>
  </Card>
</template>

<script setup lang="ts">
type Job = {
  agency: string;
  title?: string;
  country: string;
  tour_date: string;
  salary: string;
  description: string;
};

defineProps<{ job: Job }>();

const { t } = useI18n();
</script>
