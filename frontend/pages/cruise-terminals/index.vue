<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('cruiseTerminals.eyebrow')" :title="t('cruiseTerminals.title')" :subtitle="t('cruiseTerminals.subtitle')" />
    <div class="section-grid">
      <Card v-for="terminal in terminals" :key="terminal.id">
        <h3 class="text-lg font-display">{{ terminal.name }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('cruiseTerminals.luggageDrop') }}: {{ terminal.luggage_drop_location }}
        </p>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('cruiseTerminals.checkIn') }}: {{ terminal.check_in_counters }}
        </p>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('cruiseTerminals.security') }}: {{ terminal.security_checkpoint }}
        </p>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('cruiseTerminals.boarding') }}: {{ terminal.boarding_gate }}
        </p>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('cruiseTerminals.luggageClaim') }}: {{ terminal.luggage_claim }}
        </p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useApiClient();
const { t, lang } = useI18n();
const terminals = ref<Array<Record<string, string>>>([]);
const usingFallback = ref(true);

const fallbackTerminals = computed(() =>
  lang.value === 'ko'
    ? [
        {
          id: '1',
          name: '오산바시 터미널',
          luggage_drop_location: '1층 서쪽 구역',
          check_in_counters: '2층 A-D 카운터',
          security_checkpoint: '2층 보안 게이트',
          boarding_gate: '게이트 3-5',
          luggage_claim: '1층 수하물 벨트'
        },
        {
          id: '2',
          name: '사우스 하버 터미널 2',
          luggage_drop_location: '지상층 4번 베이',
          check_in_counters: '2층 1-6번 카운터',
          security_checkpoint: '2층 B 레인',
          boarding_gate: '게이트 2',
          luggage_claim: '지상층 수하물 구역'
        }
      ]
    : [
        {
          id: '1',
          name: 'Osanbashi Terminal',
          luggage_drop_location: 'Level 1 west side',
          check_in_counters: 'Level 2 counters A-D',
          security_checkpoint: 'Level 2 security lanes',
          boarding_gate: 'Gate 3-5',
          luggage_claim: 'Level 1 carousel'
        },
        {
          id: '2',
          name: 'South Harbor Terminal 2',
          luggage_drop_location: 'Ground floor bay 4',
          check_in_counters: 'Second floor counters 1-6',
          security_checkpoint: 'Second floor lane B',
          boarding_gate: 'Gate 2',
          luggage_claim: 'Ground floor claim area'
        }
      ]
);

const applyFallback = () => {
  terminals.value = fallbackTerminals.value;
};

onMounted(async () => {
  try {
    terminals.value = await api.get('/api/cruise-terminals');
    usingFallback.value = false;
  } catch (error) {
    console.warn('Using fallback cruise terminal data', error);
    applyFallback();
  }
});

watch(
  () => lang.value,
  () => {
    if (usingFallback.value) applyFallback();
  }
);
</script>
