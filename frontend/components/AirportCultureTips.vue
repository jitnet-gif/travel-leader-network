<template>
  <div class="space-y-3 overflow-y-auto flex-1 min-h-0 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="text-sm font-semibold text-black/80 dark:text-white/80">{{ airport.country }} — 복장 · 주류 규정</p>
        <p class="text-xs text-black/40 dark:text-white/40 mt-0.5">
          <template v-if="loading">🔍 최신 정보 검색 중…</template>
          <template v-else-if="liveData">🌐 실시간 검색 · {{ liveData.generatedAt }}</template>
          <template v-else>복장·주류·문화 규정 안내</template>
        </p>
      </div>
    </div>

    <!-- Summary badge -->
    <p v-if="liveData?.summary && !loading" class="rounded-xl bg-ocean/8 dark:bg-ocean/15 px-4 py-2.5 text-sm text-ocean dark:text-ocean/90 leading-relaxed">
      {{ liveData.summary }}
    </p>

    <!-- Loading skeleton -->
    <template v-if="loading">
      <div
        v-for="n in 5"
        :key="n"
        class="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 animate-pulse"
      >
        <div class="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
        <div class="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </template>

    <!-- Section: Dress -->
    <template v-else-if="rules.length">
      <template v-for="section in SECTIONS" :key="section.key">
        <template v-if="bySection(section.key).length">
          <p class="mt-3 first:mt-0 text-[11px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 flex items-center gap-1.5">
            <span>{{ section.icon }}</span> {{ section.label }}
          </p>
          <div
            v-for="rule in bySection(section.key)"
            :key="rule.id"
            class="rounded-xl border overflow-hidden transition-all"
            :class="severityBorder(rule.severity)"
          >
            <button
              type="button"
              class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition"
              @click="expanded = expanded === rule.id ? null : rule.id"
            >
              <span
                class="shrink-0 mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                :class="severityBadge(rule.severity)"
              >{{ severityLabel(rule.severity) }}</span>
              <span class="flex-1 text-sm font-semibold text-black/80 dark:text-white/80 leading-snug">{{ rule.title }}</span>
              <span class="shrink-0 mt-0.5 text-black/30 dark:text-white/30 transition-transform" :class="expanded === rule.id ? 'rotate-180' : ''">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
            <Transition name="tip-expand">
              <div v-if="expanded === rule.id" class="px-4 pb-4 space-y-2 border-t border-black/5 dark:border-white/10 pt-3">
                <p class="text-sm text-black/70 dark:text-white/60 leading-relaxed whitespace-pre-line">{{ rule.detail }}</p>
                <a
                  :href="rule.sourceUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-ocean hover:underline mt-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  출처: {{ rule.source }}
                </a>
              </div>
            </Transition>
          </div>
        </template>
      </template>
    </template>

    <!-- No data fallback -->
    <div v-else class="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 p-5 text-center space-y-2">
      <p class="text-sm text-black/60 dark:text-white/50">{{ airport.country }} 복장·주류 규정 정보를 검색해보세요.</p>
      <a
        :href="`https://www.google.com/search?q=${encodeURIComponent(airport.country + ' 복장 규정 주류 반입 허용량')}`"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-1 rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold text-ocean hover:bg-ocean/20 transition"
      >🔍 검색</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';

const props = defineProps<{ airport: Airport }>();

const expanded = ref<string | null>(null);

type Severity = 'info' | 'warning' | 'important';
type Section = 'weather' | 'dress' | 'alcohol' | 'etiquette' | 'customs';

interface CultureRule {
  id: string;
  section: Section;
  severity: Severity;
  title: string;
  detail: string;
  source: string;
  sourceUrl: string;
}

interface CultureResult {
  country: string;
  generatedAt: string;
  summary: string;
  rules: CultureRule[];
}

const SECTIONS: { key: Section; icon: string; label: string }[] = [
  { key: 'weather',   icon: '🌤️', label: '날씨 · 기후' },
  { key: 'dress',     icon: '👗', label: '추천 복장' },
  { key: 'alcohol',   icon: '🍷', label: '주류 반입·음주 규정' },
  { key: 'etiquette', icon: '🙏', label: '문화 에티켓' },
  { key: 'customs',   icon: '🛃', label: '기타 관습' },
];

const liveData = ref<CultureResult | null>(null);
const loading = ref(false);
const sessionCache = new Map<string, CultureResult>();

const fetchRules = async (country: string) => {
  if (!country) return;
  expanded.value = null;

  const cached = sessionCache.get(country);
  if (cached) { liveData.value = cached; return; }

  loading.value = true;
  liveData.value = null;
  try {
    const data = await $fetch<CultureResult>(`/api/culture/${encodeURIComponent(country)}`);
    liveData.value = data;
    sessionCache.set(country, data);
  } catch (e) {
    console.warn('[CultureTips] fetch failed:', e);
    liveData.value = null;
  } finally {
    loading.value = false;
  }
};

watch(() => props.airport.country, (c) => fetchRules(c), { immediate: true });

const rules = computed<CultureRule[]>(() => liveData.value?.rules ?? []);
const bySection = (s: Section) => rules.value.filter(r => r.section === s);

const severityBorder = (s: Severity) => ({
  'border-red-300 dark:border-red-700/60 bg-red-50/30 dark:bg-red-900/10':   s === 'important',
  'border-amber-300 dark:border-amber-700/60 bg-amber-50/30 dark:bg-amber-900/10': s === 'warning',
  'border-black/10 dark:border-white/10': s === 'info',
});

const severityBadge = (s: Severity) => ({
  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300':     s === 'important',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300': s === 'warning',
  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300': s === 'info',
});

const severityLabel = (s: Severity) => ({ important: '주의', warning: '경고', info: '안내' }[s]);
</script>

<style scoped>
.tip-expand-enter-active, .tip-expand-leave-active { transition: opacity 0.2s, transform 0.2s; }
.tip-expand-enter-from, .tip-expand-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
