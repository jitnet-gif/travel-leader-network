<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false });
const { t } = useI18n();
const { user, init, signOut } = useAuth();

onMounted(() => init());

const navItems = computed(() => [
  { label: t('nav.home'), to: '/', icon: 'home' },
  { label: t('nav.dashboard'), to: '/dashboard', icon: 'dashboard' },
  { label: t('nav.countries'), to: '/countries', icon: 'public' },
  { label: t('nav.airports'), to: '/airports', icon: 'flight_takeoff' },
  { label: t('nav.cruiseLines'), to: '/cruise-lines', icon: 'directions_boat' },
  { label: t('nav.cruisePorts'), to: '/cruise-ports', icon: 'anchor' },
  { label: 'Audio Guide', to: '/guide/audio', icon: 'headphones' },
  { label: t('nav.jobs'), to: '/jobs', icon: 'work' },
  { label: t('nav.community'), to: '/community', icon: 'forum' },
  { label: t('nav.leaderTools'), to: '/leader-tools', icon: 'construction' },
  { label: t('nav.admin'), to: '/admin', icon: 'admin_panel_settings' }
]);

const close = () => {
  open.value = false;
};
</script>

<template>
  <div>
    <div v-if="open" class="fixed inset-0 z-40 bg-ocean-900/60 backdrop-blur-sm lg:hidden" @click="close"></div>
    <aside
      class="fixed z-50 h-full w-72 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-ocean-900 p-8 transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group" @click="close">
        <div class="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-ocean-900 dark:bg-sky-500 text-white font-display font-bold text-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
          LN
        </div>
        <div>
          <p class="font-display text-xl font-bold tracking-tight text-ocean-900 dark:text-white">LeaderNode</p>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600">Operations</p>
        </div>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="mt-12 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 hover:bg-slate-50 dark:hover:bg-white/5"
          active-class="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 shadow-sm"
          @click="close"
        >
          <span class="material-symbols-outlined text-xl transition-colors" :class="[ $route.path === item.to ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 group-hover:text-ocean-900 dark:group-hover:text-white' ]">
            {{ item.icon }}
          </span>
          <span :class="[ $route.path === item.to ? 'text-sky-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-ocean-900 dark:group-hover:text-white' ]">
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <!-- User & Pulse -->
      <div class="absolute bottom-8 left-8 right-8 space-y-6">
        <div class="rounded-3xl bg-slate-50 dark:bg-white/5 p-5 border border-slate-100 dark:border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ t('sidebar.operationalPulse') }}</p>
          </div>
          <div class="space-y-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
            <div class="flex justify-between">
              <span>{{ t('sidebar.systemsOnline') }}</span>
              <span class="text-emerald-500">100%</span>
            </div>
            <div class="flex justify-between">
              <span>{{ t('sidebar.toursActive') }}</span>
              <span class="text-ocean-900 dark:text-white">08</span>
            </div>
          </div>
        </div>

        <template v-if="user">
          <div class="flex items-center gap-3 p-2 rounded-2xl border border-slate-100 dark:border-white/5">
            <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 overflow-hidden">
               <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover">
               <div v-else class="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 font-bold">
                 {{ user.email?.[0].toUpperCase() }}
               </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-ocean-900 dark:text-white truncate">{{ user.email }}</p>
              <button @click="signOut" class="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider">
                {{ t('sidebar.logout') }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </aside>
  </div>
</template>
