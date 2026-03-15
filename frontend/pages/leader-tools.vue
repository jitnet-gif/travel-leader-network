<template>
  <div class="space-y-8">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ocean via-sky/80 to-ocean/60 px-8 py-10 text-white shadow-xl">
      <div class="relative z-10">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">{{ t('leaderTools.eyebrow') }}</p>
        <h1 class="mt-2 text-3xl font-display font-bold leading-tight lg:text-4xl">{{ t('leaderTools.title') }}</h1>
        <p class="mt-3 max-w-xl text-sm text-white/80">{{ t('leaderTools.subtitle') }}</p>
      </div>
      <div class="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
    </div>

    <!-- AI Schedule Recommendation -->
    <AiSchedulePanel />

    <!-- Today's schedule & checklist -->
    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.scheduleTitle') }}</h3>
        <div class="mt-4 space-y-3 text-sm text-black/70 dark:text-white/70">
          <div v-for="item in schedule" :key="item.time" class="flex items-center justify-between">
            <span>{{ item.time }} · {{ item.task }}</span>
            <span class="text-xs text-black/50 dark:text-white/50">{{ item.location }}</span>
          </div>
        </div>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.checklistTitle') }}</h3>
        <ul class="mt-4 space-y-2 text-sm text-black/70 dark:text-white/70">
          <li v-for="item in checklist" :key="item">{{ item }}</li>
        </ul>
      </Card>
    </div>

    <div class="section-grid">
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.passengerListTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.passengerListSubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.openManifest') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.flightInfoTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.flightInfoSubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.viewArrivals') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.hotelInfoTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.hotelInfoSubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.roomingList') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.cruiseItineraryTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.cruiseItinerarySubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.openItinerary') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.operationalNotesTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.operationalNotesSubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.openNotes') }}</BaseButton>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();

const schedule = computed(() => ta<{ time: string; task: string; location: string }>('leaderTools.scheduleItems'));
const checklist = computed(() => ta<string>('leaderTools.checklistItems'));

definePageMeta({ middleware: ['auth'] });
</script>
