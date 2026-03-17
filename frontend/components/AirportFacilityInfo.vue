<template>
  <div class="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-black/5 dark:border-white/10">
      <p class="text-xs font-bold uppercase tracking-widest text-black/50 dark:text-white/40">시설 상세 안내</p>
      <span v-if="loading" class="text-[10px] text-ocean animate-pulse">🔍 검색 중…</span>
      <span v-else-if="liveData" class="text-[10px] text-black/30 dark:text-white/30">🌐 {{ liveData.generatedAt }}</span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="divide-y divide-black/5 dark:divide-white/5">
      <div v-for="n in 5" :key="n" class="flex items-start gap-3 px-4 py-3 animate-pulse">
        <div class="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
        <div class="flex-1 space-y-1.5 pt-0.5">
          <div class="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div class="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>

    <!-- Facility list -->
    <div v-else-if="facilities.length" class="divide-y divide-black/5 dark:divide-white/5">
      <div
        v-for="f in facilities"
        :key="f.id"
        class="overflow-hidden"
      >
        <button
          type="button"
          class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-black/3 dark:hover:bg-white/3 transition"
          @click="expanded = expanded === f.id ? null : f.id"
        >
          <span class="shrink-0 text-xl leading-none mt-0.5">{{ f.icon }}</span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-black/80 dark:text-white/80 leading-snug">{{ f.title }}</span>
            <a
              v-if="f.location && isTransport(f.category)"
              :href="mapsUrl(props.airport.name + ' ' + f.location)"
              target="_blank"
              rel="noopener"
              class="block text-[11px] text-ocean/80 dark:text-ocean/70 mt-0.5 leading-tight truncate hover:underline"
              @click.stop
            >📍 {{ f.location }} ↗</a>
            <span v-else-if="f.location" class="block text-[11px] text-ocean/80 dark:text-ocean/70 mt-0.5 leading-tight truncate">📍 {{ f.location }}</span>
          </span>
          <span class="shrink-0 mt-1 text-black/30 dark:text-white/30 transition-transform" :class="expanded === f.id ? 'rotate-180' : ''">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
        <Transition name="expand">
          <div v-if="expanded === f.id" class="px-4 pb-4 pt-2 bg-slate-50/60 dark:bg-slate-800/30 border-t border-black/5 dark:border-white/5 space-y-2">
            <a
              v-if="f.location && isTransport(f.category)"
              :href="mapsUrl(props.airport.name + ' ' + f.location)"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-2.5 py-0.5 text-xs font-semibold text-ocean hover:bg-ocean/20 transition"
            >📍 {{ f.location }} ↗</a>
            <p v-else-if="f.location" class="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-2.5 py-0.5 text-xs font-semibold text-ocean">
              📍 {{ f.location }}
            </p>
            <p class="text-sm text-black/65 dark:text-white/60 leading-relaxed whitespace-pre-line">{{ f.detail }}</p>
            <a
              v-if="f.sourceUrl"
              :href="f.sourceUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 text-xs font-semibold text-ocean hover:underline"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              공식 사이트
            </a>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Fallback: static with expandable detail -->
    <div v-else class="divide-y divide-black/5 dark:divide-white/5">
      <div v-for="f in staticFacilities" :key="f.id" class="overflow-hidden">
        <button
          type="button"
          class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black/3 dark:hover:bg-white/3 transition"
          @click="expanded = expanded === f.id ? null : f.id"
        >
          <span class="shrink-0 text-xl leading-none">{{ f.icon }}</span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-black/80 dark:text-white/80">{{ f.title }}</span>
            <span class="block text-[11px] mt-0.5" :class="f.available ? 'text-emerald-600 dark:text-emerald-400' : 'text-black/40 dark:text-white/30'">
              {{ f.available ? f.availableLabel : f.unavailableLabel }}
            </span>
          </span>
          <span v-if="f.available" class="shrink-0 text-black/30 dark:text-white/30 transition-transform" :class="expanded === f.id ? 'rotate-180' : ''">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
        <Transition name="expand">
          <div v-if="expanded === f.id && f.available" class="px-4 pb-4 pt-2 bg-slate-50/60 dark:bg-slate-800/30 border-t border-black/5 dark:border-white/5 space-y-2">
            <a
              v-if="f.id === 'taxi' || f.id === 'bus'"
              :href="mapsUrl(staticMapsQuery(f.id))"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold text-ocean hover:bg-ocean/20 transition"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Google Maps에서 위치 보기
            </a>
            <p class="text-sm text-black/65 dark:text-white/60 leading-relaxed whitespace-pre-line">{{ f.detail }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';

const props = defineProps<{ airport: Airport }>();

const expanded = ref<string | null>(null);

interface FacilityDetail {
  id: string;
  category: string;
  icon: string;
  title: string;
  location?: string;
  detail: string;
  sourceUrl?: string;
}

interface AirportDetailResult {
  iata: string;
  name: string;
  generatedAt: string;
  facilities: FacilityDetail[];
}

const liveData = ref<AirportDetailResult | null>(null);
const loading = ref(false);
const sessionCache = new Map<string, AirportDetailResult>();

const fetchDetail = async (iata: string) => {
  if (!iata) return;
  expanded.value = null;

  const cached = sessionCache.get(iata);
  if (cached) { liveData.value = cached; return; }

  loading.value = true;
  liveData.value = null;
  try {
    const data = await $fetch<AirportDetailResult>(`/api/airport-detail/${encodeURIComponent(iata)}`);
    liveData.value = data;
    sessionCache.set(iata, data);
  } catch (e) {
    console.warn('[AirportFacilityInfo] fetch failed:', e);
    liveData.value = null;
  } finally {
    loading.value = false;
  }
};

watch(() => props.airport.iata, (iata) => { if (iata) fetchDetail(iata); }, { immediate: true });

const TRANSPORT_CATEGORIES = ['taxi', 'bus', 'shuttle', 'transport', 'ground_transport', 'rail', 'train', 'subway', 'metro'];
function isTransport(category: string | undefined): boolean {
  if (!category) return false;
  const c = category.toLowerCase();
  return TRANSPORT_CATEGORIES.some(t => c.includes(t));
}

function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function staticMapsQuery(id: string): string {
  const name = props.airport.name;
  if (id === 'taxi') return `${name} taxi stand`;
  if (id === 'bus') return `${name} bus terminal`;
  return name;
}

const facilities = computed<FacilityDetail[]>(() => liveData.value?.facilities ?? []);

interface StaticFacility {
  id: string;
  icon: string;
  title: string;
  available: boolean;
  availableLabel: string;
  unavailableLabel: string;
  detail: string;
}

const staticFacilities = computed<StaticFacility[]>(() => {
  const a = props.airport;
  const iata = a.iata ?? '';
  return [
    {
      id: 'smoking',
      icon: '🚬',
      title: '흡연 구역',
      available: a.smoking_area,
      availableLabel: '흡연실 있음 · 클릭하여 이용 안내 확인',
      unavailableLabel: '흡연실 없음',
      detail: `${a.name} 흡연실은 터미널 내 지정 구역에 위치합니다.\n입국·출국장 내 표지판의 🚬 안내를 따라 이동하세요.\n비흡연 구역 내 흡연 시 공항 규정에 따라 과태료가 부과될 수 있으니 주의하세요.\n단체 이동 시 흡연 희망자는 탑승 수속 후 보안구역 진입 전에 흡연하도록 안내하세요.`,
    },
    {
      id: 'lounge',
      icon: '🛋️',
      title: '라운지',
      available: a.lounge,
      availableLabel: '라운지 이용 가능 · 클릭하여 안내 확인',
      unavailableLabel: '라운지 제한적',
      detail: `${a.name}에는 항공사 전용 및 카드사 제휴 라운지가 운영됩니다.\n비즈니스·퍼스트클래스 탑승권 또는 프리미엄 카드(AMEX Platinum, Priority Pass 등) 소지 시 이용 가능합니다.\n출발 터미널 내 보안검색 통과 후 라운지 안내 표지판을 따라 이동하세요.\n투어 리더는 개인 자격 여부를 탑승객에게 미리 안내하세요.`,
    },
    {
      id: 'subway',
      icon: '🚇',
      title: '지하철 / 공항철도',
      available: a.subway,
      availableLabel: '지하철·공항철도 연결 · 클릭하여 이용 방법 확인',
      unavailableLabel: '지하철 연결 없음',
      detail: `${a.name}은 도심을 연결하는 공항철도 또는 지하철 노선과 연결되어 있습니다.\n공항 지하층 또는 1층 안내 표지판에서 "🚇 Railway / Train" 방향으로 이동하세요.\n티켓은 자동발매기 또는 교통카드로 구매 가능합니다.\n단체 이동 시에는 에스컬레이터 혼잡을 피해 엘리베이터를 이용하거나 충분한 이동 시간을 확보하세요.\n승차 후 도심 주요 역까지 약 30–50분 소요됩니다 (공항별 상이).`,
    },
    {
      id: 'taxi',
      icon: '🚕',
      title: '택시 승차장',
      available: a.taxi,
      availableLabel: '택시 이용 가능 · 클릭하여 승차 방법 확인',
      unavailableLabel: '택시 없음',
      detail: `${a.name} 택시 승차장은 도착층(1층) 출구 바깥 또는 지정 승차 구역에 있습니다.\n"🚕 Taxi" 안내 표지판을 따라 이동하고, 줄을 서서 순서대로 탑승하세요.\n미터기 택시가 표준이며, 출발 전 목적지를 명확히 전달하세요 (지도 또는 서면 주소 권장).\n도심까지 요금은 공항별 상이하며 보통 현지 화폐로 결제합니다.\n대형 단체의 경우 사전에 전세버스 또는 미니밴을 예약하는 것을 권장합니다.`,
    },
    {
      id: 'bus',
      icon: '🚌',
      title: '버스 터미널',
      available: a.bus,
      availableLabel: '공항버스 운행 · 클릭하여 이용 방법 확인',
      unavailableLabel: '버스 없음',
      detail: `${a.name}에서 공항버스 또는 리무진버스를 이용해 도심으로 이동할 수 있습니다.\n버스 정류장은 도착 출구 바깥 또는 별도 버스 터미널(지하 또는 별관)에 있습니다.\n"🚌 Bus" 안내 표지판을 따라 이동 후 목적지 노선 번호를 확인하세요.\n단체 탑승 시 짐 적재 공간 확인 및 전체 탑승 인원 파악 후 출발하세요.\n운행 시간은 일반적으로 새벽 5시–자정이며 배차 간격은 10–30분입니다.`,
    },
  ];
});
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: opacity 0.2s, transform 0.15s; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
