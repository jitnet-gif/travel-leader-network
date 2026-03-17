<template>
  <div class="space-y-4">

    <!-- Chat window -->
    <div ref="chatEl" class="flex flex-col gap-3 rounded-2xl border border-black/8 bg-slate-50/60 p-4 dark:border-white/8 dark:bg-slate-800/40 max-h-[70vh] overflow-y-auto scroll-smooth">

      <!-- Message bubbles -->
      <template v-for="(msg, i) in messages" :key="i">

        <!-- AI bubble -->
        <div v-if="msg.role === 'ai'" class="flex items-end gap-2">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean text-sm shadow">✨</span>
          <div class="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm dark:bg-slate-700">
            <!-- plain text -->
            <p v-if="msg.type === 'text'" class="text-sm leading-relaxed text-black/80 dark:text-white/80" v-html="msg.content" />

            <!-- quick-reply chips -->
            <div v-if="msg.choices?.length" class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="c in msg.choices"
                :key="c.value"
                :disabled="!!userAnswers[msg.field!] || generating"
                class="rounded-full border border-ocean/40 px-3 py-1 text-xs font-semibold text-ocean transition hover:bg-ocean/10 active:scale-95 disabled:cursor-default disabled:opacity-50"
                @click="pickChoice(msg.field!, c.value, c.label)"
              >{{ c.label }}</button>
            </div>
          </div>
        </div>

        <!-- User bubble -->
        <div v-else class="flex justify-end">
          <div class="max-w-[75%] rounded-2xl rounded-br-sm bg-ocean px-4 py-2.5 shadow-sm">
            <p class="text-sm font-medium text-white">{{ msg.content }}</p>
          </div>
        </div>

      </template>

      <!-- Typing indicator -->
      <div v-if="thinking" class="flex items-end gap-2">
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ocean text-sm shadow">✨</span>
        <div class="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm dark:bg-slate-700">
          <div class="flex gap-1">
            <span v-for="n in 3" :key="n" class="h-2 w-2 rounded-full bg-ocean/60 animate-bounce" :style="`animation-delay:${(n-1)*0.15}s`" />
          </div>
        </div>
      </div>
    </div>

    <!-- Input row -->
    <div v-if="currentStep && !generating" class="flex gap-2">
      <input
        v-if="currentStep.inputType === 'number'"
        :key="currentStep.field + '-num'"
        ref="inputEl"
        v-model.number="userInput"
        type="number"
        :placeholder="currentStep.placeholder"
        :min="currentStep.min"
        class="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm placeholder:text-black/30 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-white/30"
        @keydown.enter="submitInput"
      />
      <input
        v-else
        :key="currentStep.field + '-text'"
        ref="inputEl"
        v-model="userInput"
        type="text"
        :placeholder="currentStep.placeholder"
        class="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm placeholder:text-black/30 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-white/30"
        @keydown.enter="submitInput"
      />
      <button
        v-if="speechSupported"
        type="button"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition"
        :class="isListening ? 'bg-red-500 animate-pulse text-white' : 'border border-black/10 bg-white text-black/40 hover:bg-ocean/10 hover:text-ocean dark:border-white/10 dark:bg-slate-800'"
        @click="toggleListen"
      >
        <svg v-if="isListening" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      </button>
      <button
        :disabled="!String(userInput || '').trim()"
        class="rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow transition disabled:opacity-40 active:scale-95"
        :class="voiceCountdown > 0 ? 'bg-amber-500 animate-pulse' : 'bg-ocean hover:bg-ocean/90'"
        @click="submitInput"
      >{{ voiceCountdown > 0 ? `${voiceCountdown}초` : '전송' }}</button>
    </div>

    <!-- Result: schedule + budget -->
    <template v-if="result">
      <!-- Day-by-day timeline -->
      <div class="space-y-4">
        <Card v-for="day in result.schedule" :key="day.day">
          <div class="flex items-center gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ocean text-xs font-bold text-white">{{ day.day }}</span>
            <div>
              <p class="text-[10px] font-semibold uppercase tracking-widest text-black/40 dark:text-white/40">Day {{ day.day }}</p>
              <h4 class="font-display font-semibold leading-tight">{{ day.title }}</h4>
            </div>
          </div>
          <div class="mt-5 space-y-0">
            <div v-for="(item, idx) in day.items" :key="idx" class="relative flex gap-3 pb-5 last:pb-0">
              <div class="absolute left-[18px] top-8 bottom-0 w-px bg-black/10 dark:bg-white/10" />
              <div class="relative z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base shadow-sm" :class="typeColor(item.type)">
                {{ typeIcon(item.type) }}
              </div>
              <div class="flex-1 min-w-0 rounded-xl border border-black/[0.06] bg-white p-3 shadow-sm dark:border-white/[0.06] dark:bg-slate-800/60">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-black/5 px-2 py-0.5 text-xs font-bold tabular-nums text-black/60 dark:bg-white/10 dark:text-white/60">{{ item.time }}</span>
                  <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" :class="typeBadgeColor(item.type)">{{ typeLabel(item.type) }}</span>
                  <span v-if="item.duration" class="text-[11px] text-black/40 dark:text-white/40">⏱ {{ item.duration }}</span>
                  <span v-if="item.cost > 0" class="ml-auto text-xs font-semibold text-ocean">{{ fmt(item.cost, result.budget?.currency || 'USD') }}/인</span>
                  <span v-else-if="item.cost === 0" class="ml-auto text-[11px] font-semibold text-green-600 dark:text-green-400">무료</span>
                </div>
                <p class="mt-1.5 font-semibold text-sm text-black/90 dark:text-white/90">{{ item.activity }}</p>
                <p class="mt-0.5 text-xs text-black/50 dark:text-white/40">📍 {{ item.location }}</p>
                <p v-if="item.description" class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/60">{{ item.description }}</p>
                <div v-if="item.notes" class="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 dark:bg-amber-900/20">
                  <span class="mt-0.5 text-xs">📋</span>
                  <p class="text-xs italic text-amber-800 dark:text-amber-300">{{ item.notes }}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Budget table -->
      <Card v-if="result.budget">
        <div class="flex items-center justify-between">
          <h4 class="font-display font-semibold text-lg">💰 예산 내역</h4>
          <span class="text-xs text-black/40 dark:text-white/40">{{ result.budget.currency }}</span>
        </div>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-black/10 dark:border-white/10">
                <th class="pb-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-black/40">항목</th>
                <th class="pb-2 text-right text-xs font-semibold uppercase tracking-[0.15em] text-black/40">1인</th>
                <th class="pb-2 text-right text-xs font-semibold uppercase tracking-[0.15em] text-black/40">단체</th>
                <th class="pb-2 pl-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-black/40">비고</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5 dark:divide-white/5">
              <tr v-for="(row, i) in result.budget.breakdown" :key="i">
                <td class="py-2.5 pr-4">
                  <div class="flex items-center gap-2"><span>{{ categoryIcon(row.category) }}</span><span>{{ row.item }}</span></div>
                </td>
                <td class="py-2.5 text-right font-mono">{{ fmt(row.perPax, result.budget.currency) }}</td>
                <td class="py-2.5 text-right font-mono">{{ fmt(row.groupTotal, result.budget.currency) }}</td>
                <td class="py-2.5 pl-4 text-xs text-black/40">{{ row.note }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-ocean/30">
                <td class="pt-3 font-bold">합계</td>
                <td class="pt-3 text-right font-mono font-bold text-ocean">{{ fmt(result.budget.perPax, result.budget.currency) }}</td>
                <td class="pt-3 text-right font-mono font-bold text-ocean">{{ fmt(result.budget.groupTotal, result.budget.currency) }}</td>
                <td class="pt-3 pl-4 text-xs text-black/40">{{ answers.passengerCount }}명 기준</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <template v-if="result.budget.savingTips?.length">
          <h5 class="mt-5 font-semibold text-sm">💡 절약 팁</h5>
          <ul class="mt-2 space-y-1.5">
            <li v-for="(tip, i) in result.budget.savingTips" :key="i" class="flex items-start gap-2 text-sm text-black/60 dark:text-white/60">
              <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />{{ tip }}
            </li>
          </ul>
        </template>
      </Card>

      <!-- Tips & checklist -->
      <div class="grid gap-4 sm:grid-cols-2">
        <Card v-if="result.tips?.length">
          <h4 class="font-display font-semibold">💡 운영 팁</h4>
          <ul class="mt-3 space-y-2">
            <li v-for="(tip, i) in result.tips" :key="i" class="flex items-start gap-2 text-sm text-black/70 dark:text-white/70">
              <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ocean" />{{ tip }}
            </li>
          </ul>
        </Card>
        <Card v-if="result.checklist?.length">
          <h4 class="font-display font-semibold">✅ 체크리스트</h4>
          <ul class="mt-3 space-y-2">
            <li v-for="(item, i) in result.checklist" :key="i" class="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
              <span class="h-4 w-4 shrink-0 rounded border-2 border-ocean/40 text-center text-xs leading-3 text-ocean">✓</span>{{ item }}
            </li>
          </ul>
        </Card>
      </div>

      <!-- Reset button -->
      <div class="flex justify-center">
        <button
          class="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-black/60 transition hover:bg-black/5 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/5"
          @click="restart"
        >새 일정 만들기 ↺</button>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    defaultTripType?: 'land_tour' | 'cruise' | 'city_tour' | 'airport_transfer';
  }>(),
  { defaultTripType: 'land_tour' }
);

const { lang } = useI18n();

// ── Types ──────────────────────────────────────────────────────────────────
interface ScheduleItem { time: string; activity: string; location: string; type: string; duration?: string; cost?: number; description?: string; notes?: string; }
interface DaySchedule { day: number; title: string; items: ScheduleItem[]; }
interface BudgetRow { item: string; perPax: number; groupTotal: number; note: string; category: string; }
interface Budget { currency: string; perPax: number; groupTotal: number; breakdown: BudgetRow[]; shoreExcursionOptions: unknown[] | null; savingTips: string[]; }
interface AiResult { destination: string; duration: number; schedule: DaySchedule[]; budget?: Budget; tips: string[]; checklist: string[]; }

// ── Step definitions ───────────────────────────────────────────────────────
interface Step {
  field: string;
  question: (a: Record<string, string>) => string;
  placeholder: string;
  inputType?: string;
  min?: string;
  choices?: { label: string; value: string }[];
  skip?: (a: Record<string, string>) => boolean;
}

const STEPS: Step[] = [
  {
    field: 'destination',
    question: () => '안녕하세요! 어디로 여행을 계획하고 계신가요?<br><span class="text-xs text-black/40">예: 도쿄, 바르셀로나, 지중해 크루즈</span>',
    placeholder: '목적지를 입력하세요',
  },
  {
    field: 'tripType',
    question: (a) => `<b>${a.destination}</b> 여행 유형을 선택해주세요.`,
    placeholder: '유형 선택',
    choices: [
      { label: '🏔️ 육상 투어', value: 'land_tour' },
      { label: '⚓ 크루즈', value: 'cruise' },
      { label: '🏙️ 시티 투어', value: 'city_tour' },
      { label: '✈️ 공항 이동', value: 'airport_transfer' },
    ],
  },
  {
    field: 'duration',
    question: (a) => `<b>${a.destination}</b> 여행은 며칠 일정인가요?`,
    placeholder: '예: 3',
    inputType: 'number',
    min: '1',
  },
  {
    field: 'passengerCount',
    question: () => '참가 인원은 몇 명인가요?',
    placeholder: '예: 20',
    inputType: 'number',
    min: '1',
  },
  {
    field: 'shoreExcursion',
    question: () => '기항지 관광 방식을 선택해주세요.',
    placeholder: '',
    choices: [
      { label: '🗺️ 가이드 투어', value: 'guided' },
      { label: '🚶 자유 여행', value: 'free' },
      { label: '🔀 혼합 (오전 투어 + 오후 자유)', value: 'mixed' },
    ],
    skip: (a) => a.tripType !== 'cruise',
  },
  {
    field: 'budgetPerPax',
    question: () => '1인당 예산이 있으신가요? (없으면 AI가 추천합니다)<br><span class="text-xs text-black/40">없으면 "없음" 입력</span>',
    placeholder: '예: 500 또는 없음',
  },
  {
    field: 'currency',
    question: () => '통화를 선택해주세요.',
    placeholder: '',
    choices: [
      { label: '$ USD', value: 'USD' },
      { label: '₩ KRW', value: 'KRW' },
      { label: '€ EUR', value: 'EUR' },
      { label: '¥ JPY', value: 'JPY' },
      { label: 'S$ SGD', value: 'SGD' },
    ],
  },
  {
    field: 'notes',
    question: () => '특별히 포함하거나 주의해야 할 사항이 있나요?<br><span class="text-xs text-black/40">없으면 "없음" 입력</span>',
    placeholder: '예: 채식 식단 포함, 노약자 참가 등',
  },
];

// ── State ──────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'ai' | 'user';
  type?: 'text';
  content: string;
  field?: string;
  choices?: { label: string; value: string }[];
}

const messages = ref<ChatMessage[]>([]);
const userAnswers = ref<Record<string, string>>({});
const answers = computed(() => userAnswers.value);
const userInput = ref('');
const stepIdx = ref(0);
const thinking = ref(false);

// ── Voice input ──────────────────────────────────────────────────────────────
const speechSupported = ref(false);
const isListening = ref(false);
const voiceCountdown = ref(0);
let recognition: any = null;
let voiceAutoSendTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  if (!process.client) return;
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (SR) {
    speechSupported.value = true;
    recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const text = e.results[0]?.[0]?.transcript || '';
      const step = STEPS[stepIdx.value];
      if (text.trim() && step?.inputType !== 'number') {
        userInput.value = text.trim();
        voiceCountdown.value = 1;
        if (voiceAutoSendTimer) clearTimeout(voiceAutoSendTimer);
        voiceAutoSendTimer = setTimeout(() => {
          voiceCountdown.value = 0;
          submitInput();
        }, 1000);
      }
      isListening.value = false;
    };
    recognition.onend = () => { isListening.value = false; };
    recognition.onerror = () => { isListening.value = false; voiceCountdown.value = 0; };
  }
});

const toggleListen = () => {
  if (!recognition) return;
  if (voiceAutoSendTimer) { clearTimeout(voiceAutoSendTimer); voiceAutoSendTimer = null; voiceCountdown.value = 0; }
  if (isListening.value) { recognition.stop(); return; }
  recognition.lang = 'ko-KR';
  recognition.start();
  isListening.value = true;
};
const generating = ref(false);
const result = ref<AiResult | null>(null);

const chatEl = ref<HTMLDivElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);

// Current pending step (has no user answer yet)
const currentStep = computed<Step | null>(() => {
  if (result.value) return null;
  const step = STEPS[stepIdx.value];
  if (!step) return null;
  // only show input if step has no choices (or choices but no answer yet)
  if (step.choices) return null; // handled via chip clicks
  if (userAnswers.value[step.field]) return null; // already answered
  return step;
});

// ── Scroll helper ──────────────────────────────────────────────────────────
const scrollBottom = () => nextTick(() => {
  if (!chatEl.value) return;
  // 채팅창 내부 스크롤을 아래로
  chatEl.value.scrollTop = chatEl.value.scrollHeight;
  // 페이지가 채팅창 밖으로 스크롤됐을 경우 채팅창이 보이도록 뷰포트로 이동
  chatEl.value.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ── Advance to next step ───────────────────────────────────────────────────
const advanceStep = async () => {
  stepIdx.value++;
  // skip steps that should be skipped
  while (stepIdx.value < STEPS.length && STEPS[stepIdx.value].skip?.(userAnswers.value)) {
    stepIdx.value++;
  }

  if (stepIdx.value >= STEPS.length) {
    // All answered — generate
    await generateSchedule();
    return;
  }

  const step = STEPS[stepIdx.value];
  thinking.value = true;
  await new Promise(r => setTimeout(r, 600));
  thinking.value = false;

  messages.value.push({
    role: 'ai',
    type: 'text',
    content: step.question(userAnswers.value),
    field: step.field,
    choices: step.choices,
  });
  scrollBottom();
  await nextTick();
  inputEl.value?.focus();
};

// ── User submits typed input ───────────────────────────────────────────────
const submitInput = async () => {
  const step = STEPS[stepIdx.value];
  if (!step || !(String(userInput.value)).trim()) return;
  if (recognition && isListening.value) { recognition.stop(); isListening.value = false; }
  const val = String(userInput.value).trim();
  userAnswers.value[step.field] = val;
  messages.value.push({ role: 'user', content: val });
  userInput.value = ''; // Reset input value immediately
  scrollBottom();
  await advanceStep();

};

// ── User clicks a chip ─────────────────────────────────────────────────────
const pickChoice = async (field: string, value: string, label: string) => {
  if (userAnswers.value[field] || generating.value) return;
  userAnswers.value[field] = value;
  messages.value.push({ role: 'user', content: label });
  scrollBottom();
  await advanceStep();
};

// ── Generate schedule ──────────────────────────────────────────────────────
const generateSchedule = async () => {
  generating.value = true;
  thinking.value = true;
  messages.value.push({
    role: 'ai',
    type: 'text',
    content: '✨ 입력하신 정보를 바탕으로 일정을 생성하고 있습니다...',
  });
  scrollBottom();

  try {
    const a = userAnswers.value;
    const budgetRaw = a.budgetPerPax?.replace(/[^0-9]/g, '');
    result.value = await $fetch<AiResult>('/api/schedule-ai', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: {
        destination: a.destination,
        tripType: a.tripType || props.defaultTripType,
        duration: Number(a.duration) || 2,
        passengerCount: Number(a.passengerCount) || 20,
        language: lang.value,
        budgetPerPax: budgetRaw ? Number(budgetRaw) : undefined,
        currency: a.currency || 'USD',
        shoreExcursion: a.tripType === 'cruise' ? (a.shoreExcursion || 'guided') : undefined,
        notes: (a.notes && a.notes !== '없음') ? a.notes : undefined,
      },
    });
    thinking.value = false;
    messages.value.push({
      role: 'ai',
      type: 'text',
      content: `🎉 <b>${result.value.destination}</b> ${result.value.duration}일 일정이 완성됐습니다! 아래에서 확인하세요.`,
    });
  } catch (err: unknown) {
    thinking.value = false;
    const e = err as { data?: { message?: string; statusCode?: number }; message?: string; statusCode?: number };
    const errMsg = e?.data?.message || e?.message || (e?.statusCode ? `오류 ${e.statusCode}` : '알 수 없는 오류');
    messages.value.push({
      role: 'ai',
      type: 'text',
      content: `❌ 일정 생성에 실패했습니다: ${errMsg}\n\n잠시 후 다시 시도하거나 목적지를 영문으로 입력해보세요.`,
    });
  } finally {
    generating.value = false;
    scrollBottom();
  }
};

// ── Restart ────────────────────────────────────────────────────────────────
const restart = () => {
  messages.value = [];
  userAnswers.value = {};
  userInput.value = '';
  stepIdx.value = 0;
  result.value = null;
  generating.value = false;
  thinking.value = false;
  startChat();
};

// ── Helpers ────────────────────────────────────────────────────────────────
const typeIcon = (t: string) => ({ transport: '🚌', activity: '🎯', meal: '🍽️', accommodation: '🏨' }[t] || '📌');
const typeLabel = (t: string) => ({ transport: '이동', activity: '활동', meal: '식사', accommodation: '숙박' }[t] || t);
const typeColor = (t: string) => ({ transport: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300', activity: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300', meal: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300', accommodation: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' }[t] || 'bg-gray-50 text-gray-600');
const typeBadgeColor = (t: string) => ({ transport: 'bg-blue-100 text-blue-700', activity: 'bg-green-100 text-green-700', meal: 'bg-orange-100 text-orange-700', accommodation: 'bg-purple-100 text-purple-700' }[t] || 'bg-gray-100 text-gray-600');
const categoryIcon = (c: string) => ({ transport: '🚌', activity: '🎯', meal: '🍽️', accommodation: '🏨', entrance: '🎫', guide: '👤', misc: '📦' }[c] || '📌');
const fmt = (amount: number | undefined, currency: string) => {
  if (amount == null) return '-';
  const s: Record<string, string> = { USD: '$', KRW: '₩', EUR: '€', JPY: '¥', SGD: 'S$' };
  return (s[currency] || currency + ' ') + Number(amount).toLocaleString();
};

// ── Init ───────────────────────────────────────────────────────────────────
const startChat = async () => {
  // Pre-fill tripType from prop
  if (props.defaultTripType !== 'land_tour') {
    // don't pre-set so user still sees the question
  }
  await nextTick();
  thinking.value = true;
  await new Promise(r => setTimeout(r, 400));
  thinking.value = false;
  const first = STEPS[0];
  messages.value.push({
    role: 'ai',
    type: 'text',
    content: first.question({}),
    field: first.field,
  });
  scrollBottom();
  await nextTick();
  inputEl.value?.focus();
};

onMounted(startChat);

// 메시지가 추가될 때마다 스크롤 + 포커스 보장
watch(
  () => messages.value.length,
  () => {
    scrollBottom();
    nextTick(() => { if (!generating.value) inputEl.value?.focus(); });
  }
);
</script>
