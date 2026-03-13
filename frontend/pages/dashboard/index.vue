<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('dashboard.eyebrow')" :title="t('dashboard.title')" :subtitle="t('dashboard.subtitle')" />

    <div class="grid gap-6 md:grid-cols-4">
      <StatCard :label="t('dashboard.stats.activeTours')" value="8" :hint="t('dashboard.stats.activeToursHint')" />
      <StatCard :label="t('dashboard.stats.travelAlerts')" value="3" :hint="t('dashboard.stats.travelAlertsHint')" />
      <StatCard :label="t('dashboard.stats.openJobs')" :value="String(jobs.length)" :hint="t('dashboard.stats.openJobsHint')" />
      <StatCard :label="t('dashboard.stats.communityPosts')" value="24" :hint="t('dashboard.stats.communityPostsHint')" />
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('dashboard.alertsTitle') }}</h3>
        <div class="mt-4 space-y-3 text-sm text-black/70 dark:text-white/70">
          <div v-for="alert in travelAlerts" :key="alert.title" class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold">{{ alert.title }}</p>
              <p class="text-xs text-black/50 dark:text-white/50">{{ alert.detail }}</p>
            </div>
            <Tag>{{ alert.level }}</Tag>
          </div>
        </div>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('dashboard.cruiseUpdatesTitle') }}</h3>
        <ul class="mt-4 space-y-2 text-sm text-black/70 dark:text-white/70">
          <li v-for="update in cruiseUpdates" :key="update">
            {{ update }}
          </li>
        </ul>
      </Card>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('dashboard.upcomingToursTitle') }}</h3>
        <div class="mt-4 space-y-3 text-sm text-black/70 dark:text-white/70">
          <div v-for="tour in upcomingTours" :key="tour.name" class="flex items-center justify-between">
            <span>{{ tour.name }}</span>
            <span class="text-xs text-black/50 dark:text-white/50">{{ tour.dates }}</span>
          </div>
        </div>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('dashboard.airportQuickLinksTitle') }}</h3>
        <div class="mt-4 grid gap-3 text-sm text-black/70 dark:text-white/70">
          <div v-for="airport in airportLinks" :key="airport" class="flex items-center justify-between">
            <span>{{ airport }}</span>
            <NuxtLink class="text-ocean" to="/airports">{{ t('common.view') }}</NuxtLink>
          </div>
        </div>
      </Card>
    </div>

    <section>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-lg font-display">{{ t('dashboard.jobOpportunitiesTitle') }}</h3>
          <p class="text-sm text-black/60 dark:text-white/60">{{ t('dashboard.jobOpportunitiesSubtitle') }}</p>
        </div>
        <BaseButton variant="outline" to="/jobs">{{ t('dashboard.viewMarketplace') }}</BaseButton>
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <JobCard v-for="job in jobHighlights" :key="job.title || `${job.country}-${job.tour_date}`" :job="job" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, ta, lang } = useI18n();

const travelAlerts = computed(() => ta<{ title: string; detail: string; level: string }>('dashboard.alerts'));
const cruiseUpdates = computed(() => ta<string>('dashboard.cruiseUpdates'));
const upcomingTours = computed(() => ta<{ name: string; dates: string }>('dashboard.upcomingTours'));
const airportLinks = computed(() => ta<string>('dashboard.airportLinks'));

const fallbackJobs = computed(() =>
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
        }
      ]
);

const { data: jobs } = useSupabaseI18nTable({
  table: 'tour_jobs',
  i18nTable: 'tour_jobs_i18n',
  fields: ['title', 'description', 'country'],
  fallback: fallbackJobs
});

const jobHighlights = computed(() => jobs.value.slice(0, 2));

definePageMeta({
  middleware: ['auth']
});
</script>
