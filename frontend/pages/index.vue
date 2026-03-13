<template>
  <div class="space-y-12">
    <section class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-5">
        <p class="text-xs uppercase tracking-[0.3em] text-ocean">{{ t('home.eyebrow') }}</p>
        <h1 class="text-4xl md:text-5xl font-display">{{ t('home.title') }}</h1>
        <p class="text-base text-black/70 dark:text-white/70">
          {{ t('home.subtitle') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <BaseButton to="/dashboard">{{ t('home.buttons.dashboard') }}</BaseButton>
          <BaseButton variant="outline" to="/jobs">{{ t('home.buttons.jobs') }}</BaseButton>
          <BaseButton variant="outline" to="/community">{{ t('home.buttons.community') }}</BaseButton>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl border border-black/5 bg-white/70 p-4 text-sm dark:border-white/10 dark:bg-slate-900">
            <p class="text-xs uppercase tracking-[0.2em] text-black/40 dark:text-white/40">{{ t('home.stats.coverage') }}</p>
            <p class="mt-2 text-xl font-display">{{ t('home.stats.coverageValue') }}</p>
          </div>
          <div class="rounded-2xl border border-black/5 bg-white/70 p-4 text-sm dark:border-white/10 dark:bg-slate-900">
            <p class="text-xs uppercase tracking-[0.2em] text-black/40 dark:text-white/40">{{ t('home.stats.network') }}</p>
            <p class="mt-2 text-xl font-display">{{ t('home.stats.networkValue') }}</p>
          </div>
          <div class="rounded-2xl border border-black/5 bg-white/70 p-4 text-sm dark:border-white/10 dark:bg-slate-900">
            <p class="text-xs uppercase tracking-[0.2em] text-black/40 dark:text-white/40">{{ t('home.stats.liveOps') }}</p>
            <p class="mt-2 text-xl font-display">{{ t('home.stats.liveOpsValue') }}</p>
          </div>
        </div>
      </div>
      <Card>
        <p class="text-xs uppercase tracking-[0.2em] text-black/50 dark:text-white/50">{{ t('home.focus.eyebrow') }}</p>
        <h3 class="mt-3 text-xl font-display">{{ t('home.focus.title') }}</h3>
        <p class="mt-3 text-sm text-black/60 dark:text-white/60">
          {{ t('home.focus.body') }}
        </p>
        <div class="mt-5 grid gap-3 text-sm text-black/70 dark:text-white/70">
          <div class="flex items-center justify-between">
            <span>{{ t('home.focus.metrics.alerts') }}</span>
            <span class="font-semibold text-ocean">{{ t('home.focus.metrics.alertsValue') }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('home.focus.metrics.tours') }}</span>
            <span class="font-semibold">{{ t('home.focus.metrics.toursValue') }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('home.focus.metrics.matches') }}</span>
            <span class="font-semibold">{{ t('home.focus.metrics.matchesValue') }}</span>
          </div>
        </div>
      </Card>
    </section>

    <section>
      <SectionHeader
        :eyebrow="t('home.modules.eyebrow')"
        :title="t('home.modules.title')"
        :subtitle="t('home.modules.subtitle')"
      />
      <div class="section-grid">
        <NuxtLink
          v-for="module in modules"
          :key="module.to"
          :to="module.to"
          class="group no-underline outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Card class="h-full transition hover:-translate-y-0.5 hover:shadow-soft">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-sand/60 text-lg">
                {{ module.icon }}
              </div>
              <div>
                <h3 class="text-lg font-display group-hover:text-ocean">{{ module.title }}</h3>
                <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ module.body }}</p>
              </div>
            </div>
            <BaseButton class="mt-4" variant="outline">{{ t('common.open') }}</BaseButton>
          </Card>
        </NuxtLink>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('home.stack.title') }}</h3>
        <ul class="mt-4 space-y-2 text-sm text-black/70 dark:text-white/70">
          <li v-for="item in ta('home.stack.bullets')" :key="item">{{ item }}</li>
        </ul>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('home.stack.agencyTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('home.stack.agencyBody') }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <Tag v-for="tag in ta('home.stack.tags')" :key="tag">{{ tag }}</Tag>
        </div>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();

const modules = computed(() => [
  {
    to: '/countries',
    icon: '🗺️',
    title: t('home.modules.cards.countries.title'),
    body: t('home.modules.cards.countries.body')
  },
  {
    to: '/airports',
    icon: '✈️',
    title: t('home.modules.cards.airports.title'),
    body: t('home.modules.cards.airports.body')
  },
  {
    to: '/cruise-lines',
    icon: '🛳️',
    title: t('home.modules.cards.cruiseLines.title'),
    body: t('home.modules.cards.cruiseLines.body')
  },
  {
    to: '/cruise-ports',
    icon: '⚓',
    title: t('home.modules.cards.cruisePorts.title'),
    body: t('home.modules.cards.cruisePorts.body')
  },
  {
    to: '/jobs',
    icon: '💼',
    title: t('home.modules.cards.jobs.title'),
    body: t('home.modules.cards.jobs.body')
  },
  {
    to: '/community',
    icon: '💬',
    title: t('home.modules.cards.community.title'),
    body: t('home.modules.cards.community.body')
  }
]);
</script>
