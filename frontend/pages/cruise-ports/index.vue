<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('cruisePorts.eyebrow')" :title="t('cruisePorts.title')" :subtitle="t('cruisePorts.subtitle')" />

    <div class="flex flex-wrap items-center justify-between gap-4">
      <SearchBar v-model="query" :placeholder="t('cruisePorts.searchPlaceholder')" />
      <p class="text-sm text-black/50 dark:text-white/40">
        {{ filtered.length }} / {{ ports.length }} {{ t('cruisePorts.portsCount') }}
      </p>
    </div>

    <div v-if="filtered.length" class="section-grid max-h-[70vh] overflow-y-auto overscroll-contain pr-2">
      <Card
        v-for="port in filtered"
        :key="port.name"
        class="group cursor-pointer transition hover:-translate-y-0.5"
        @click="openInMaps(port)"
      >
        <div class="flex items-start justify-between">
          <h3 class="text-lg font-display">{{ port.name }}</h3>
          <span class="text-xs font-semibold text-ocean opacity-0 transition group-hover:opacity-100">
            {{ t('airport.openInMaps') }}
          </span>
        </div>
        <p class="mt-1 text-sm text-black/60 dark:text-white/60">{{ port.city ? `${port.city}, ` : '' }}{{ port.country }}</p>
        <div class="mt-4 space-y-2 text-sm text-black/70 dark:text-white/70">
          <div class="flex items-center justify-between">
            <span>{{ t('cruisePorts.shuttleBus') }}</span>
            <span class="font-semibold">{{ port.shuttle_bus }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('cruisePorts.taxiStands') }}</span>
            <span class="font-semibold">{{ port.taxi }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('cruisePorts.meetingPoint') }}</span>
            <span class="font-semibold">{{ port.meeting_point }}</span>
          </div>
          <div v-if="port.safety_alert" class="flex items-center justify-between">
            <span>{{ t('cruisePorts.safetyAlerts') }}</span>
            <span class="font-semibold text-amber-600 dark:text-amber-400">{{ port.safety_alert }}</span>
          </div>
        </div>
      </Card>
    </div>
    <p v-else class="text-sm text-black/50 dark:text-white/40">{{ t('common.noResults') }}</p>
  </div>
</template>

<script setup lang="ts">
import { matchesQuery } from '~/composables/useSearch';

type Port = {
  name: string;
  city?: string;
  country: string;
  shuttle_bus: string;
  taxi: string;
  meeting_point: string;
  safety_alert?: string;
};

const { t, lang } = useI18n();
const query = useGlobalSearch();

const openInMaps = (port: Port) => {
  const q = [port.name, port.city, port.country].filter(Boolean).join(' ');
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank', 'noopener');
};

const fallbackPorts = computed<Port[]>(() =>
  lang.value === 'ko'
    ? [
        { name: '요코하마 항', city: '요코하마', country: '일본', shuttle_bus: '20분 간격 시내 셔틀 운행.', taxi: '오산바시 부두 출구 택시 승차장.', meeting_point: '오산바시 홀 입구', safety_alert: '주말 교통 혼잡 주의.' },
        { name: '바르셀로나 크루즈 항', city: '바르셀로나', country: '스페인', shuttle_bus: '라람블라스로 향하는 셔틀 운행.', taxi: '터미널 B 출구 택시 승차장.', meeting_point: '터미널 B 도착 게이트', safety_alert: '항구 게이트 인근 소매치기 주의.' }
      ]
    : [
        { name: 'Yokohama Port', city: 'Yokohama', country: 'Japan', shuttle_bus: 'Shuttle every 20 minutes to city center.', taxi: 'Taxi stands outside Osanbashi Pier.', meeting_point: 'Osanbashi Hall entrance', safety_alert: 'Heavy traffic during weekends.' },
        { name: 'Barcelona Cruise Port', city: 'Barcelona', country: 'Spain', shuttle_bus: 'Port shuttle to Las Ramblas.', taxi: 'Taxi rank at Terminal B exit.', meeting_point: 'Terminal B arrivals gate', safety_alert: 'Pickpocketing reported near port gates.' }
      ]
);

const ports = ref<Port[]>(fallbackPorts.value);

const filtered = computed(() =>
  ports.value.filter((p) => matchesQuery(query.value, [p.name, p.city, p.country]))
);

const api = useApiClient();
onMounted(async () => {
  try {
    const result = await api.get<Port[]>('/api/cruise-ports');
    if (result && result.length) ports.value = result;
  } catch {
    // fallback already set
  }
});
</script>
