<template>
  <div class="space-y-10">
    <SectionHeader :eyebrow="t('emergency.eyebrow')" :title="t('emergency.title')" :subtitle="t('emergency.subtitle')" />

    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('emergency.procedureTitle') }}</h3>
        <ol class="mt-3 list-decimal space-y-2 pl-5 text-sm text-black/70 dark:text-white/70">
          <li v-for="step in procedureSteps" :key="step">{{ step }}</li>
        </ol>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('emergency.contactsTitle') }}</h3>
        <p v-for="line in contactLines" :key="line" class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ line }}
        </p>
      </Card>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('emergency.embassyTitle') }}</h3>
        <div class="mt-4 space-y-3 text-sm text-black/70 dark:text-white/70">
          <div v-for="embassy in embassies" :key="embassy.name">
            <p class="font-semibold">{{ embassy.name }}</p>
            <p>{{ embassy.phone }}</p>
            <p>{{ embassy.address }}</p>
          </div>
        </div>
      </Card>
      <LeafletMap :center="[120.983, 14.579]" :zoom="11" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();

const procedureSteps = computed(() => ta<string>('emergency.procedureSteps'));
const contactLines = computed(() => ta<string>('emergency.contactsLines'));
const embassies = computed(() => ta<{ name: string; phone: string; address: string }>('emergency.embassies'));
</script>
