<template>
  <div class="space-y-3 overflow-y-auto flex-1 min-h-0 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-black/80 dark:text-white/80">{{ airport.country }} 입국 주의사항</p>
        <p class="text-xs text-black/40 dark:text-white/40 mt-0.5">
          <template v-if="loading">🔍 최신 정보 검색 중…</template>
          <template v-else-if="liveData">
            🌐 실시간 검색 · {{ liveData.generatedAt }}
          </template>
          <template v-else>공항·대사관 공식 출처 기반</template>
        </p>
      </div>
      <a
        v-if="officialUrl"
        :href="officialUrl"
        target="_blank"
        rel="noopener"
        class="shrink-0 text-xs font-semibold text-ocean hover:underline"
      >🔗 공식 사이트</a>
    </div>

    <!-- Loading skeleton -->
    <template v-if="loading">
      <div
        v-for="n in 4"
        :key="n"
        class="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 animate-pulse"
      >
        <div class="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
        <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </template>

    <!-- Tips list -->
    <template v-else-if="tips.length">
      <div
        v-for="tip in tips"
        :key="tip.id"
        class="rounded-xl border overflow-hidden transition-all"
        :class="severityBorder(tip.severity)"
      >
        <!-- Summary row -->
        <button
          type="button"
          class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition"
          @click="expanded = expanded === tip.id ? null : tip.id"
        >
          <span
            class="shrink-0 mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            :class="categoryStyle(tip.category)"
          >{{ categoryLabel(tip.category) }}</span>
          <span class="flex-1 text-sm font-semibold text-black/80 dark:text-white/80 leading-snug">{{ tip.title }}</span>
          <span class="shrink-0 mt-0.5 text-black/30 dark:text-white/30 transition-transform" :class="expanded === tip.id ? 'rotate-180' : ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>

        <!-- Detail expand -->
        <Transition name="tip-expand">
          <div v-if="expanded === tip.id" class="px-4 pb-4 space-y-2 border-t border-black/5 dark:border-white/10 pt-3">
            <p class="text-sm text-black/70 dark:text-white/60 leading-relaxed whitespace-pre-line">{{ tip.detail }}</p>
            <a
              :href="tip.sourceUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 text-xs font-semibold text-ocean hover:underline mt-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              출처: {{ tip.source }}
            </a>
          </div>
        </Transition>
      </div>
    </template>

    <!-- No data fallback -->
    <div v-else class="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 p-5 text-center space-y-2">
      <p class="text-sm text-black/60 dark:text-white/50">{{ airport.country }} 입국 정보를 공식 채널에서 확인하세요.</p>
      <div class="flex flex-wrap justify-center gap-2">
        <a
          :href="`https://www.google.com/search?q=${encodeURIComponent(airport.country + ' 입국 요건 대사관')}`"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold text-ocean hover:bg-ocean/20 transition"
        >🔍 대사관 검색</a>
        <a
          :href="`https://www.google.com/search?q=${encodeURIComponent(airport.name + ' entry requirements visa')}`"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 rounded-full bg-slate-200 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-black/60 dark:text-white/60 hover:bg-slate-300 dark:hover:bg-white/20 transition"
        >✈️ 공항 안내 검색</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';

const props = defineProps<{ airport: Airport }>();

const expanded = ref<string | null>(null);

// ── Data types ────────────────────────────────────────────────────────────────
type Severity = 'info' | 'warning' | 'important';
type Category = 'visa' | 'customs' | 'health' | 'security' | 'general';

type Tip = {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  detail: string;
  source: string;
  sourceUrl: string;
};

type LiveData = {
  country: string;
  officialUrl: string;
  generatedAt: string;
  tips: Tip[];
};

// ── Live data state ───────────────────────────────────────────────────────────
const liveData = ref<LiveData | null>(null);
const loading = ref(false);

// Client-side session cache to avoid repeated API calls
const sessionCache = new Map<string, LiveData>();

const fetchTips = async (country: string) => {
  if (!country) return;
  expanded.value = null;

  const cached = sessionCache.get(country);
  if (cached) { liveData.value = cached; return; }

  loading.value = true;
  liveData.value = null;
  try {
    const data = await $fetch<LiveData>(`/api/immigration/${encodeURIComponent(country)}`);
    liveData.value = data;
    sessionCache.set(country, data);
  } catch (e) {
    console.warn('[ImmigrationTips] fetch failed:', e);
    liveData.value = null;
  } finally {
    loading.value = false;
  }
};

watch(() => props.airport.country, (c) => fetchTips(c), { immediate: true });

// ── Derived display data ──────────────────────────────────────────────────────
const tips = computed<Tip[]>(() => liveData.value?.tips ?? []);
const officialUrl = computed(() => liveData.value?.officialUrl ?? null);

// ── Style helpers ─────────────────────────────────────────────────────────────
const severityBorder = (s: Severity) => ({
  'border-red-300 dark:border-red-700/60 bg-red-50/30 dark:bg-red-900/10':   s === 'important',
  'border-amber-300 dark:border-amber-700/60 bg-amber-50/30 dark:bg-amber-900/10': s === 'warning',
  'border-black/10 dark:border-white/10': s === 'info',
});

const categoryStyle = (c: Category) => ({
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300': c === 'visa',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300':         c === 'customs',
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300':     c === 'health',
  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300':             c === 'security',
  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300':        c === 'general',
});

const categoryLabel = (c: Category) => ({
  visa: '비자', customs: '세관', health: '건강', security: '보안', general: '일반',
}[c]);
</script>

<style scoped>
.tip-expand-enter-active, .tip-expand-leave-active { transition: opacity 0.2s, transform 0.2s; }
.tip-expand-enter-from, .tip-expand-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
