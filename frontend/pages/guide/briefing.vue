<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ocean via-sky/80 to-ocean/60 px-6 py-8 text-white shadow-xl">
      <div class="relative z-10">
        <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">Tour Leader Tool</p>
        <h1 class="mt-1 text-2xl font-display font-bold">투어 브리핑 생성기</h1>
        <p class="mt-2 text-sm text-white/80 max-w-lg">공항·입국 정보를 NotebookLM용 구조화 문서로 자동 생성합니다. 다운로드 후 NotebookLM에 업로드하면 AI Q&A 및 오디오 요약이 가능합니다.</p>
      </div>
      <div class="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
    </div>

    <!-- Step 1: Tour Info -->
    <div class="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 p-5 space-y-4">
      <p class="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Step 1 · 투어 기본 정보</p>
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label class="block text-xs font-semibold text-black/60 dark:text-white/50 mb-1">투어명</label>
          <input
            v-model="tourName"
            class="w-full rounded-xl border border-black/15 dark:border-white/15 px-3 py-2 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 dark:bg-slate-800"
            placeholder="예: 싱가포르 5박6일 크루즈 투어"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-black/60 dark:text-white/50 mb-1">출발일</label>
          <input
            v-model="tourDate"
            type="date"
            class="w-full rounded-xl border border-black/15 dark:border-white/15 px-3 py-2 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 dark:bg-slate-800"
          />
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-black/60 dark:text-white/50 mb-1">투어 메모 (선택)</label>
        <textarea
          v-model="tourNotes"
          rows="3"
          class="w-full rounded-xl border border-black/15 dark:border-white/15 px-3 py-2 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 dark:bg-slate-800 resize-none"
          placeholder="특이사항, 단체 구성, 주의사항 등을 입력하세요..."
        />
      </div>
    </div>

    <!-- Step 2: Airport selection -->
    <div class="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 p-5 space-y-4">
      <p class="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Step 2 · 공항 추가</p>

      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          class="w-full rounded-xl border border-black/15 dark:border-white/15 px-3 py-2 pl-9 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 dark:bg-slate-800"
          placeholder="공항명 또는 IATA 코드 검색..."
          @focus="showSuggestions = true"
          @blur="setTimeout(() => { showSuggestions = false }, 150)"
        />
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>

        <!-- Suggestions -->
        <div
          v-if="showSuggestions && suggestions.length"
          class="absolute z-20 mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 shadow-lg overflow-hidden"
        >
          <button
            v-for="a in suggestions"
            :key="a.iata"
            type="button"
            class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            @click="addAirport(a)"
          >
            <span class="shrink-0 rounded-md bg-ocean/10 px-2 py-0.5 text-xs font-bold text-ocean">{{ a.iata }}</span>
            <span class="text-sm text-black/80 dark:text-white/80">{{ a.name }}</span>
            <span class="ml-auto text-xs text-black/40 dark:text-white/40">{{ a.city }}, {{ a.country }}</span>
          </button>
        </div>
      </div>

      <!-- Selected airports -->
      <div v-if="selectedAirports.length" class="space-y-2">
        <div
          v-for="(a, i) in selectedAirports"
          :key="a.iata"
          class="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5"
        >
          <span class="text-xs font-bold text-black/40 dark:text-white/30">{{ i + 1 }}</span>
          <span class="rounded-md bg-ocean/10 px-2 py-0.5 text-xs font-bold text-ocean">{{ a.iata }}</span>
          <span class="flex-1 text-sm font-medium text-black/80 dark:text-white/80">{{ a.name }}</span>
          <span class="text-xs text-black/40 dark:text-white/40">{{ a.country }}</span>
          <button type="button" class="text-black/30 hover:text-red-500 transition" @click="removeAirport(i)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-black/40 dark:text-white/40">공항을 검색해서 추가하세요.</p>
    </div>

    <!-- Step 3: Generate -->
    <div class="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 p-5 space-y-4">
      <p class="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Step 3 · 브리핑 생성 및 내보내기</p>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          :disabled="!canGenerate"
          class="flex items-center gap-2 rounded-xl bg-ocean px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-ocean/90 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="generatePreview"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          브리핑 생성
        </button>
        <button
          v-if="briefingText"
          type="button"
          class="flex items-center gap-2 rounded-xl border border-black/15 dark:border-white/15 px-5 py-2.5 text-sm font-bold transition hover:bg-black/5 dark:hover:bg-white/5"
          @click="downloadBriefing"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          .txt 다운로드
        </button>
        <button
          v-if="briefingText"
          type="button"
          class="flex items-center gap-2 rounded-xl border border-ocean/40 bg-ocean/5 px-5 py-2.5 text-sm font-bold text-ocean transition hover:bg-ocean/10"
          @click="copyBriefing"
        >
          {{ copied ? '✅ 복사됨' : '📋 클립보드 복사' }}
        </button>
        <a
          v-if="briefingText"
          href="https://notebooklm.google.com"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-50 dark:bg-sky-900/20 px-5 py-2.5 text-sm font-bold text-sky-600 dark:text-sky-400 transition hover:bg-sky-100 dark:hover:bg-sky-900/40"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          NotebookLM 열기
        </a>
      </div>

      <!-- NotebookLM 안내 -->
      <div v-if="briefingText" class="rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/40 p-4 text-xs text-sky-700 dark:text-sky-300 space-y-1">
        <p class="font-bold">NotebookLM 업로드 방법:</p>
        <p>1. "클립보드 복사" 또는 ".txt 다운로드"</p>
        <p>2. NotebookLM 열기 → 새 노트북 생성</p>
        <p>3. "소스 추가" → 텍스트 붙여넣기 또는 파일 업로드</p>
        <p>4. AI 오디오 요약 또는 Q&A 활용</p>
      </div>

      <!-- Preview -->
      <div v-if="briefingText" class="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 p-4">
        <p class="text-xs font-semibold text-black/50 dark:text-white/40 mb-2">미리보기</p>
        <pre class="text-xs text-black/70 dark:text-white/60 leading-relaxed whitespace-pre-wrap font-mono max-h-72 overflow-y-auto">{{ briefingText }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Airport } from '~/types/airport';
import { generateTourBriefing } from '~/composables/useBriefingExport';

definePageMeta({ middleware: ['auth'] });

const tourName  = ref('');
const tourDate  = ref(new Date().toISOString().slice(0, 10));
const tourNotes = ref('');
const searchQuery = ref('');
const showSuggestions = ref(false);
const selectedAirports = ref<Airport[]>([]);
const briefingText = ref('');
const copied = ref(false);

// Load airports from API
const { data: airportsData } = await useFetch<Airport[]>('/api/airports');
const allAirports = computed<Airport[]>(() => airportsData.value ?? []);

const suggestions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q || q.length < 2) return [];
  return allAirports.value
    .filter(a =>
      a.iata.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    )
    .filter(a => !selectedAirports.value.some(s => s.iata === a.iata))
    .slice(0, 8);
});

const addAirport = (a: Airport) => {
  selectedAirports.value.push(a);
  searchQuery.value = '';
  showSuggestions.value = false;
};

const removeAirport = (i: number) => {
  selectedAirports.value.splice(i, 1);
};

const canGenerate = computed(() => selectedAirports.value.length > 0);

const generatePreview = () => {
  briefingText.value = generateTourBriefing(
    tourName.value,
    tourDate.value,
    selectedAirports.value,
    tourNotes.value,
  );
};

const downloadBriefing = () => {
  const blob = new Blob([briefingText.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `briefing_${tourName.value || 'tour'}_${tourDate.value}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const copyBriefing = async () => {
  try {
    await navigator.clipboard.writeText(briefingText.value);
  } catch {
    const el = document.createElement('textarea');
    el.value = briefingText.value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2500);
};
</script>
