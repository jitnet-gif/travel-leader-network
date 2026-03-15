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
          <span class="flex-1 text-sm font-semibold text-black/80 dark:text-white/80 leading-snug">{{ f.title }}</span>
          <span class="shrink-0 mt-1 text-black/30 dark:text-white/30 transition-transform" :class="expanded === f.id ? 'rotate-180' : ''">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
        <Transition name="expand">
          <div v-if="expanded === f.id" class="px-4 pb-3 pt-1 bg-slate-50/60 dark:bg-slate-800/30 border-t border-black/5 dark:border-white/5">
            <p class="text-sm text-black/65 dark:text-white/60 leading-relaxed whitespace-pre-line">{{ f.detail }}</p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Fallback: static booleans -->
    <div v-else class="divide-y divide-black/5 dark:divide-white/5 text-sm text-black/70 dark:text-white/70">
      <div class="flex items-center justify-between px-4 py-2.5">
        <span>🚬 흡연 구역</span>
        <span class="font-semibold">{{ airport.smoking_area ? '있음' : '없음' }}</span>
      </div>
      <div class="flex items-center justify-between px-4 py-2.5">
        <span>🛋️ 라운지</span>
        <span class="font-semibold">{{ airport.lounge ? '이용 가능' : '제한적' }}</span>
      </div>
      <div class="flex items-center justify-between px-4 py-2.5">
        <span>🚇 지하철</span>
        <span class="font-semibold">{{ airport.subway ? '연결됨' : '없음' }}</span>
      </div>
      <div class="flex items-center justify-between px-4 py-2.5">
        <span>🚕 택시</span>
        <span class="font-semibold">{{ airport.taxi ? '있음' : '없음' }}</span>
      </div>
      <div class="flex items-center justify-between px-4 py-2.5">
        <span>🚌 버스</span>
        <span class="font-semibold">{{ airport.bus ? '있음' : '없음' }}</span>
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
  detail: string;
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

const facilities = computed<FacilityDetail[]>(() => liveData.value?.facilities ?? []);
</script>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: opacity 0.2s, transform 0.15s; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
