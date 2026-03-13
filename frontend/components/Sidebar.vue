<template>
  <div>
    <div v-if="open" class="fixed inset-0 z-40 bg-black/40 lg:hidden" @click="close"></div>
    <aside
      class="fixed z-50 h-full w-64 border-r border-black/5 bg-white/90 p-6 shadow lg:relative lg:z-auto lg:translate-x-0 dark:border-white/10 dark:bg-slate-950/80"
      :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean text-white font-display">TL</div>
        <div>
          <p class="font-display text-lg">Travel Leader</p>
          <p class="text-xs text-black/60 dark:text-white/60">Network</p>
        </div>
      </div>

      <nav class="mt-10 space-y-1 text-sm">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="block rounded-xl px-4 py-2 text-black/70 transition hover:bg-sky/60 hover:text-ocean dark:text-white/70 dark:hover:bg-slate-800"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div
        class="mt-10 space-y-3 rounded-2xl border border-black/5 bg-sky/60 p-4 text-xs text-black/70 dark:border-white/10 dark:bg-slate-800 dark:text-white/70"
      >
        <p class="text-xs uppercase tracking-[0.2em] text-black/50 dark:text-white/50">{{ t('sidebar.operationalPulse') }}</p>
        <div class="space-y-1">
          <p class="font-semibold">{{ t('sidebar.systemsOnline') }}</p>
          <p>{{ t('sidebar.toursActive') }}</p>
          <p>{{ t('sidebar.alertsPending') }}</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false });
const { t } = useI18n();

const navItems = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.dashboard'), to: '/dashboard' },
  { label: t('nav.countries'), to: '/countries' },
  { label: t('nav.airports'), to: '/airports' },
  { label: t('nav.cruiseLines'), to: '/cruise-lines' },
  { label: t('nav.cruisePorts'), to: '/cruise-ports' },
  { label: 'Audio Guide', to: '/guide/audio' },
  { label: t('nav.jobs'), to: '/jobs' },
  { label: t('nav.community'), to: '/community' },
  { label: t('nav.leaderTools'), to: '/leader-tools' },
  { label: t('nav.admin'), to: '/admin' }
]);

const close = () => {
  open.value = false;
};
</script>
