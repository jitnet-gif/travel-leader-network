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

<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
          <span class="text-[10px] font-bold tracking-[0.2em] text-sky-600 uppercase">{{ t('dashboard.eyebrow') }}</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-ocean-900 dark:text-white">
          {{ t('dashboard.title') }}
        </h1>
      </div>
    </header>

    <!-- Bento Layout Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      
      <!-- Main Featured Card (2x2) -->
      <div class="md:col-span-2 md:row-span-2 rounded-[2.5rem] bg-ocean-900 p-10 text-white relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-ocean-900/40">
        <div class="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <span class="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10">Operation Focus</span>
              <div class="flex -space-x-3">
                <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-2 border-ocean-900 bg-slate-200 overflow-hidden">
                   <img :src="`https://i.pravatar.cc/150?u=${i}`" class="w-full h-full object-cover">
                </div>
                <div class="w-8 h-8 rounded-full border-2 border-ocean-900 bg-sky-500 flex items-center justify-center text-[10px] font-bold">+24</div>
              </div>
            </div>
            <h2 class="text-5xl font-display font-bold mt-8 leading-none tracking-tight">Active <br>Tour Pulse</h2>
            <p class="text-slate-400 mt-4 max-w-xs text-sm leading-relaxed">
              Managing 8 active tours across 12 different ports this week.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-12">
            <div class="p-6 rounded-3xl bg-white/5 border border-white/10">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ t('dashboard.stats.activeTours') }}</p>
              <p class="text-3xl font-display font-bold mt-2">08</p>
            </div>
            <div class="p-6 rounded-3xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              <p class="text-[10px] font-bold text-sky-100 uppercase tracking-widest">{{ t('dashboard.stats.openJobs') }}</p>
              <p class="text-3xl font-display font-bold mt-2">{{ jobs.length }}</p>
            </div>
          </div>
        </div>
        <!-- Abstract Design Elements -->
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-500/20 blur-[100px] rounded-full"></div>
        <div class="absolute right-10 top-20 opacity-10 rotate-12">
            <span class="material-symbols-outlined text-[12rem]">explore</span>
        </div>
      </div>

      <!-- Risk Alert Card -->
      <div class="rounded-[2.5rem] bg-rose-50 dark:bg-rose-500/10 p-8 border border-rose-100 dark:border-rose-500/20 transition-all hover:-translate-y-1.5 shadow-sm">
        <div class="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/20">
          <span class="material-symbols-outlined">report</span>
        </div>
        <h3 class="text-xl font-display font-bold text-rose-900 dark:text-rose-400">{{ t('dashboard.alertsTitle') }}</h3>
        <p class="text-rose-800/60 dark:text-rose-400/60 text-sm mt-3 leading-relaxed">{{ t('dashboard.stats.travelAlertsHint') }}</p>
        <button class="mt-6 text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 hover:gap-3 transition-all">
            {{ t('common.view') }} <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <!-- Quick Links Card -->
      <div class="rounded-[2.5rem] bg-white dark:bg-ocean-900 p-8 border border-slate-100 dark:border-white/5 transition-all hover:-translate-y-1.5 shadow-premium">
        <div class="w-12 h-12 bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-2xl">quick_reference_all</span>
        </div>
        <h3 class="text-xl font-display font-bold text-ocean-900 dark:text-white">{{ t('dashboard.airportQuickLinksTitle') }}</h3>
        <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink v-for="airport in airportLinks.slice(0, 3)" :key="airport" to="/airports" class="px-3 py-1 bg-slate-50 dark:bg-white/5 text-[10px] font-bold text-slate-500 hover:text-sky-500 rounded-full border border-slate-100 dark:border-white/5 transition-colors">
              {{ airport }}
            </NuxtLink>
        </div>
      </div>

      <!-- Weather/Status (Wide Small) -->
      <div class="md:col-span-2 rounded-[2.5rem] bg-slate-200 dark:bg-white/5 p-8 relative overflow-hidden group transition-all hover:-translate-y-1.5 shadow-sm min-h-[200px]" style="background: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80') center/cover;">
        <div class="absolute inset-0 bg-ocean-900/50 group-hover:bg-ocean-900/60 transition-colors"></div>
        <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="flex justify-between items-start text-white">
                <h4 class="text-2xl font-display font-bold">{{ t('dashboard.upcomingToursTitle') }}</h4>
                <div class="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    <span class="material-symbols-outlined text-white">event_available</span>
                </div>
            </div>
            <div class="flex justify-between items-end">
                <div class="space-y-1">
                  <p v-for="tour in upcomingTours.slice(0, 2)" :key="tour.name" class="text-white/80 text-xs font-bold">
                    {{ tour.name }} <span class="text-sky-400">• {{ tour.dates }}</span>
                  </p>
                </div>
                <BaseButton variant="white" size="sm" to="/dashboard/my-tours">{{ t('common.view') }}</BaseButton>
            </div>
        </div>
      </div>
    </div>

    <!-- Marketplace Section -->
    <section class="space-y-8 mt-16">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-3xl font-display font-bold text-ocean-900 dark:text-white">{{ t('dashboard.jobOpportunitiesTitle') }}</h2>
          <p class="text-slate-500 text-sm mt-2">{{ t('dashboard.jobOpportunitiesSubtitle') }}</p>
        </div>
        <BaseButton variant="outline" to="/jobs">{{ t('dashboard.viewMarketplace') }}</BaseButton>
      </div>
      <div class="grid gap-6">
        <JobCard v-for="job in jobHighlights" :key="job.title || `${job.country}-${job.tour_date}`" :job="job" />
      </div>
    </section>

    <!-- AI Tools Section -->
    <section class="space-y-8 mt-16">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-3xl font-display font-bold text-ocean-900 dark:text-white">{{ t('leaderTools.aiSchedule.title') }}</h2>
          <p class="text-slate-500 text-sm mt-2">{{ t('leaderTools.aiSchedule.subtitle') }}</p>
        </div>
        <BaseButton variant="outline" to="/leader-tools">{{ t('nav.leaderTools') }}</BaseButton>
      </div>
      <div class="rounded-[3rem] p-4 bg-white dark:bg-ocean-900 border border-slate-100 dark:border-white/5 shadow-premium">
         <AiSchedulePanel default-trip-type="land_tour" />
      </div>
    </section>
  </div>
</template>
