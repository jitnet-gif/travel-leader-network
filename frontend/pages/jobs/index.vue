<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('jobs.eyebrow')" :title="t('jobs.title')" :subtitle="t('jobs.subtitle')" />

    <div class="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('jobs.forAgenciesTitle') }}</h3>
        <ul class="mt-3 space-y-2 text-sm text-black/70 dark:text-white/70">
          <li v-for="item in ta('jobs.forAgenciesBullets')" :key="item">{{ item }}</li>
        </ul>
        <BaseButton class="mt-4" variant="outline">{{ t('jobs.postTour') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('jobs.forLeadersTitle') }}</h3>
        <ul class="mt-3 space-y-2 text-sm text-black/70 dark:text-white/70">
          <li v-for="item in ta('jobs.forLeadersBullets')" :key="item">{{ item }}</li>
        </ul>
        <BaseButton class="mt-4" variant="outline">{{ t('jobs.updateProfile') }}</BaseButton>
      </Card>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <SearchBar v-model="query" :placeholder="t('common.searchPlaceholder')" />
      <BaseButton variant="outline" to="/dashboard">{{ t('jobs.trackApplications') }}</BaseButton>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <JobCard v-for="job in filtered" :key="job.title || `${job.country}-${job.tour_date}`" :job="job" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { matchesQuery } from '~/composables/useSearch';

type Job = {
  agency: string;
  title?: string;
  country: string;
  tour_date: string;
  salary: string;
  description: string;
};

const { t, ta, lang } = useI18n();
const query = useGlobalSearch();

const fallbackJobs = computed<Job[]>(() =>
  lang.value === 'ko'
    ? [
        {
          agency: '오로라 트래블 그룹',
          title: '일본 봄 시즌 투어 리더',
          country: '일본',
          tour_date: '2026-04-10',
          salary: '$220/일',
          description: '28명 규모의 교토/도쿄 7일 일정 리딩.'
        },
        {
          agency: '블루 하버 크루즈',
          title: '지중해 크루즈 에스코트',
          country: '스페인',
          tour_date: '2026-05-03',
          salary: '$240/일',
          description: '9일 항해 승선 및 기항지 운영 지원.'
        },
        {
          agency: '서밋 익스페디션',
          title: '아이슬란드 오로라 투어',
          country: '아이슬란드',
          tour_date: '2026-02-12',
          salary: '$260/일',
          description: '소규모 겨울 오로라 프로그램 운영.'
        }
      ]
    : [
        {
          agency: 'Aurora Travel Group',
          title: 'Japan Spring Tour Leader',
          country: 'Japan',
          tour_date: '2026-04-10',
          salary: '$220/day',
          description: 'Lead a 7-day Kyoto/Tokyo itinerary with 28 guests.'
        },
        {
          agency: 'Blue Harbor Cruises',
          title: 'Mediterranean Cruise Escort',
          country: 'Spain',
          tour_date: '2026-05-03',
          salary: '$240/day',
          description: 'Coordinate embarkation and shore excursions for 9-day sailing.'
        },
        {
          agency: 'Summit Expeditions',
          title: 'Iceland Northern Lights',
          country: 'Iceland',
          tour_date: '2026-02-12',
          salary: '$260/day',
          description: 'Guide winter aurora program with small groups.'
        }
      ]
);

const { data: jobs } = useSupabaseI18nTable<Job>({
  table: 'tour_jobs',
  i18nTable: 'tour_jobs_i18n',
  fields: ['title', 'description', 'country'],
  fallback: fallbackJobs
});

const filtered = computed(() =>
  jobs.value.filter((job) =>
    matchesQuery(query.value, [job.title, job.country, job.agency, job.description])
  )
);
</script>
