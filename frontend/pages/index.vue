<script setup lang="ts">
const { t, ta } = useI18n();
const showDebug = ref(false);

const modules = computed(() => [
  {
    to: '/countries',
    icon: 'public',
    title: t('home.modules.cards.countries.title'),
    body: t('home.modules.cards.countries.body')
  },
  {
    to: '/airports',
    icon: 'flight_takeoff',
    title: t('home.modules.cards.airports.title'),
    body: t('home.modules.cards.airports.body')
  },
  {
    to: '/cruise-lines',
    icon: 'directions_boat',
    title: t('home.modules.cards.cruiseLines.title'),
    body: t('home.modules.cards.cruiseLines.body')
  },
  {
    to: '/cruise-ports',
    icon: 'anchor',
    title: t('home.modules.cards.cruisePorts.title'),
    body: t('home.modules.cards.cruisePorts.body')
  },
  {
    to: '/jobs',
    icon: 'work',
    title: t('home.modules.cards.jobs.title'),
    body: t('home.modules.cards.jobs.body')
  },
  {
    to: '/community',
    icon: 'forum',
    title: t('home.modules.cards.community.title'),
    body: t('home.modules.cards.community.body')
  }
]);
</script>

<template>
  <div>
    <!-- Mobile Dashboard (Matches UI screenshots) -->
    <div class="md:hidden pt-2 pb-20 space-y-8">
      <!-- Quick Access -->
      <section>
        <div class="flex items-center gap-2 mb-4 px-1">
          <span class="material-symbols-outlined text-sky-500 rounded text-xl" style="font-variation-settings: 'FILL' 1">grid_view</span>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Quick Access</h2>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <!-- Travel -->
          <NuxtLink to="/countries" class="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
            <div class="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-500/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-sky-500" style="font-variation-settings: 'FILL' 1">public</span>
            </div>
            <span class="text-[13px] font-bold text-slate-900 dark:text-white">Travel</span>
          </NuxtLink>
          
          <!-- Cruise -->
          <NuxtLink to="/cruise-lines" class="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
            <div class="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-500/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-teal-400" style="font-variation-settings: 'FILL' 1">directions_boat</span>
            </div>
            <span class="text-[13px] font-bold text-slate-900 dark:text-white">Cruise</span>
          </NuxtLink>
          
          <!-- Airport -->
          <NuxtLink to="/airports" class="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
            <div class="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-indigo-400" style="font-variation-settings: 'FILL' 1">flight_takeoff</span>
            </div>
            <span class="text-[13px] font-bold text-slate-900 dark:text-white">Airport</span>
          </NuxtLink>
          
          <!-- Emergency -->
          <NuxtLink to="/emergency" class="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
            <div class="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-red-400" style="font-variation-settings: 'FILL' 1">medical_services</span>
            </div>
            <span class="text-[13px] font-bold text-slate-900 dark:text-white">Emergency</span>
          </NuxtLink>

          <!-- Community -->
          <NuxtLink to="/community" class="col-span-2 bg-white dark:bg-white/5 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/10 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform">
            <div class="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-emerald-400" style="font-variation-settings: 'FILL' 1">groups</span>
            </div>
            <span class="text-[13px] font-bold text-slate-900 dark:text-white">Community</span>
          </NuxtLink>
        </div>
      </section>

      <!-- Travel Alerts -->
      <section>
        <div class="flex items-center justify-between mb-4 px-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sky-500 text-xl" style="font-variation-settings: 'FILL' 1">warning</span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Travel Alerts</h2>
          </div>
          <NuxtLink to="/alerts" class="text-sky-500 text-xs font-bold hover:underline">See all</NuxtLink>
        </div>
        
        <div class="space-y-3">
          <!-- Alert 1 -->
          <div class="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/10 flex gap-4 overflow-hidden relative">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-sky-500"></div>
            
            <div class="flex-shrink-0 mt-0.5">
              <div class="w-[22px] h-[22px] rounded-full bg-sky-500 text-white flex items-center justify-center">
                <span class="material-symbols-outlined text-[14px] font-bold">info</span>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 class="text-[14px] font-bold text-slate-900 dark:text-white leading-tight pr-2">New York (JFK) - Weather Delay</h3>
                <span class="text-[9px] text-slate-400 font-bold whitespace-nowrap uppercase tracking-widest mt-0.5">2M AGO</span>
              </div>
              <p class="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                High winds may affect afternoon departures. Monitor terminal statuses.
              </p>
            </div>
          </div>
          
          <!-- Alert 2 -->
          <div class="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/10 flex gap-4 overflow-hidden relative">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            
            <div class="flex-shrink-0 mt-0.5">
              <div class="w-[22px] h-[22px] text-amber-500 flex items-center justify-center">
                <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1">security_update_warning</span>
              </div>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 class="text-[14px] font-bold text-slate-900 dark:text-white leading-tight pr-2">Europe - Border Policy Update</h3>
                <span class="text-[9px] text-slate-400 font-bold whitespace-nowrap uppercase tracking-widest mt-0.5">1H AGO</span>
              </div>
              <p class="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                Updated entry requirements for non-EU travelers effective immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Desktop content wrapped in hidden md:block -->
    <div class="hidden md:block space-y-10 pb-10">
      <!-- Hero Section -->
    <section class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center pt-2">
      <div class="space-y-5">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
          <span class="text-[10px] font-bold tracking-[0.3em] text-sky-600 uppercase">{{ t('home.eyebrow') }}</span>
        </div>
        <h1 class="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-ocean-900 dark:text-white leading-[1.1]">
           Precision <span class="text-sky-500">Logistics</span> for Global Leaders.
        </h1>
        <p class="text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
          {{ t('home.subtitle') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <BaseButton to="/dashboard" size="lg">{{ t('home.buttons.dashboard') }}</BaseButton>
          <BaseButton variant="outline" to="/jobs" size="lg">{{ t('home.buttons.jobs') }}</BaseButton>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
           <div>
             <p class="text-xl font-display font-bold text-ocean-900 dark:text-white">{{ t('home.stats.coverageValue') }}</p>
             <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{{ t('home.stats.coverage') }}</p>
           </div>
           <div>
             <p class="text-xl font-display font-bold text-ocean-900 dark:text-white">{{ t('home.stats.networkValue') }}</p>
             <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{{ t('home.stats.network') }}</p>
           </div>
           <div>
             <p class="text-xl font-display font-bold text-ocean-900 dark:text-white">{{ t('home.stats.liveOpsValue') }}</p>
             <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{{ t('home.stats.liveOps') }}</p>
           </div>
        </div>
      </div>

      <!-- Feature Visual Card -->
      <div class="relative">
        <div class="absolute -inset-4 bg-sky-500/10 blur-[100px] rounded-full"></div>
        <div class="relative rounded-[2rem] bg-ocean-900 p-7 text-white shadow-2xl overflow-hidden">
           <div class="flex justify-between items-start mb-6">
              <span class="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10">{{ t('home.focus.eyebrow') }}</span>
              <span class="material-symbols-outlined text-sky-500 text-3xl">travel_explore</span>
           </div>
           <h3 class="text-2xl font-display font-bold tracking-tight">{{ t('home.focus.title') }}</h3>
           <p class="mt-2 text-slate-400 text-sm leading-relaxed">{{ t('home.focus.body') }}</p>

           <div class="mt-5 space-y-2.5">
              <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ t('home.focus.metrics.alerts') }}</span>
                <span class="text-base font-display font-bold text-sky-400">{{ t('home.focus.metrics.alertsValue') }}</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ t('home.focus.metrics.tours') }}</span>
                <span class="text-base font-display font-bold">{{ t('home.focus.metrics.toursValue') }}</span>
              </div>
           </div>
        </div>
      </div>
    </section>

    <!-- Modules Grid -->
    <section class="space-y-6">
      <div class="text-center max-w-3xl mx-auto space-y-2">
        <p class="text-[10px] font-bold tracking-[0.3em] text-sky-600 uppercase">{{ t('home.modules.eyebrow') }}</p>
        <h2 class="text-3xl font-display font-bold text-ocean-900 dark:text-white">{{ t('home.modules.title') }}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('home.modules.subtitle') }}</p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="module in modules"
          :key="module.to"
          :to="module.to"
          class="group p-6 rounded-[1.75rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-ocean-900/5"
        >
          <div class="w-11 h-11 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-white transition-colors">
            <span class="material-symbols-outlined text-xl">{{ module.icon }}</span>
          </div>
          <h3 class="text-lg font-display font-bold text-ocean-900 dark:text-white group-hover:text-sky-600 transition-colors">{{ module.title }}</h3>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ module.body }}</p>
          <div class="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
             {{ t('common.open') }} <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Debug Panel -->
    <section>
      <button
        class="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-white/60 transition mb-3"
        @click="showDebug = !showDebug"
      >
        <span class="h-2 w-2 rounded-full" :class="showDebug ? 'bg-emerald-400' : 'bg-slate-400'" />
        {{ showDebug ? '▼' : '▶' }} Debug Panel
      </button>
      <DebugPanel v-if="showDebug" />
    </section>

    <!-- Bottom Info -->
    <section class="grid gap-5 lg:grid-cols-2">
      <div class="p-7 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
        <h3 class="text-xl font-display font-bold text-ocean-900 dark:text-white">{{ t('home.stack.title') }}</h3>
        <ul class="mt-4 space-y-3">
          <li v-for="item in ta('home.stack.bullets')" :key="item" class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
             <span class="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
             {{ item }}
          </li>
        </ul>
      </div>
      <div class="p-7 rounded-[2rem] bg-white dark:bg-ocean-900 border border-slate-100 dark:border-white/5 shadow-premium">
        <h3 class="text-xl font-display font-bold text-ocean-900 dark:text-white">{{ t('home.stack.agencyTitle') }}</h3>
        <p class="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {{ t('home.stack.agencyBody') }}
        </p>
        <div class="mt-5 flex flex-wrap gap-2">
          <Tag v-for="tag in ta('home.stack.tags')" :key="tag">{{ tag }}</Tag>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>
