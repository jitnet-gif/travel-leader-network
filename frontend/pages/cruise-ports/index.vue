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
        @click="selectedPort = selectedPort?.name === port.name ? null : port"
      >
        <div class="flex items-start justify-between">
          <h3 class="text-lg font-display">{{ port.name }}</h3>
          <span class="text-xs font-semibold text-ocean opacity-0 transition group-hover:opacity-100" @click.stop="openInMaps(port)">
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

        <!-- Landmarks panel -->
        <div v-if="getLandmarks(port.name)" class="mt-3 border-t border-slate-100 dark:border-white/5 pt-3">
          <p class="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2">주요 관광지 Attractions</p>
          <p class="text-xs text-black/50 dark:text-white/40 mb-3">{{ getLandmarks(port.name)!.highlights }}</p>
          <div class="space-y-3">
            <div
              v-for="attr in getLandmarks(port.name)!.attractions"
              :key="attr.name"
              class="rounded-xl bg-slate-50 dark:bg-white/5 p-3"
            >
              <div class="flex items-start gap-2">
                <span class="mt-0.5 text-base" :title="attr.category">{{ categoryIcon(attr.category) }}</span>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-sm text-ocean-900 dark:text-white">
                    {{ lang === 'ko' ? attr.name_ko : attr.name }}
                  </p>
                  <p class="text-xs text-black/50 dark:text-white/40 mt-0.5">
                    {{ lang === 'ko' ? attr.description_ko : attr.description }}
                  </p>
                  <div class="mt-1.5 flex flex-wrap gap-2 text-[11px] font-semibold">
                    <span class="text-sky-600 dark:text-sky-400">📍 {{ attr.distance }}</span>
                    <span class="text-emerald-600 dark:text-emerald-400">🕐 {{ attr.duration }}</span>
                  </div>
                  <p class="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                    💡 {{ lang === 'ko' ? attr.tip_ko : attr.tip }}
                  </p>
                </div>
              </div>
            </div>
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

type Landmark = {
  portName: string;
  country: string;
  highlights: string;
  attractions: {
    name: string;
    name_ko: string;
    distance: string;
    duration: string;
    description: string;
    description_ko: string;
    tip: string;
    tip_ko: string;
    category: string;
  }[];
};

const { t, lang } = useI18n();
const query = useGlobalSearch();
const selectedPort = ref<Port | null>(null);
const landmarkMap = ref<Record<string, Landmark>>({});

const openInMaps = (port: Port) => {
  const q = [port.name, port.city, port.country].filter(Boolean).join(' ');
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank', 'noopener');
};

const getLandmarks = (portName: string): Landmark | null =>
  landmarkMap.value[portName] ?? null;

const categoryIcon = (cat: string) => {
  const map: Record<string, string> = {
    heritage: '🏛️', nature: '🌿', culture: '🎭', food: '🍜', adventure: '🧗',
  };
  return map[cat] ?? '📌';
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

  try {
    const lmData = await $fetch<Landmark[]>('/api/cruise-port-landmarks');
    const map: Record<string, Landmark> = {};
    for (const lm of lmData) map[lm.portName] = lm;
    landmarkMap.value = map;
  } catch {
    // no landmarks loaded
  }
});
</script>
