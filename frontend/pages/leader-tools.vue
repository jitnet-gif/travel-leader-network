<template>
  <div class="space-y-8">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ocean via-sky/80 to-ocean/60 px-8 py-10 text-white shadow-xl">
      <div class="relative z-10">
        <p class="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">{{ t('leaderTools.eyebrow') }}</p>
        <h1 class="mt-2 text-3xl font-display font-bold leading-tight lg:text-4xl">{{ t('leaderTools.title') }}</h1>
        <p class="mt-3 max-w-xl text-sm text-white/80">{{ t('leaderTools.subtitle') }}</p>
      </div>
      <div class="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
    </div>

    <!-- AI Schedule Recommendation -->
    <Card>
      <div class="flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-ocean/10 text-lg">✨</span>
        <div>
          <h3 class="text-lg font-display">{{ t('leaderTools.aiSchedule.title') }}</h3>
          <p class="text-sm text-black/50 dark:text-white/50">{{ t('leaderTools.aiSchedule.subtitle') }}</p>
        </div>
      </div>

      <!-- Row 1: destination / type / duration / passengers -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="field-label">{{ t('leaderTools.aiSchedule.destinationLabel') }}</label>
          <input
            v-model="aiForm.destination"
            type="text"
            :placeholder="t('leaderTools.aiSchedule.destinationPlaceholder')"
            class="field-input"
          />
        </div>
        <div>
          <label class="field-label">{{ t('leaderTools.aiSchedule.tripTypeLabel') }}</label>
          <select v-model="aiForm.tripType" class="field-input">
            <option value="land_tour">{{ t('leaderTools.aiSchedule.tripTypes.land_tour') }}</option>
            <option value="cruise">{{ t('leaderTools.aiSchedule.tripTypes.cruise') }}</option>
            <option value="city_tour">{{ t('leaderTools.aiSchedule.tripTypes.city_tour') }}</option>
            <option value="airport_transfer">{{ t('leaderTools.aiSchedule.tripTypes.airport_transfer') }}</option>
          </select>
        </div>
        <div>
          <label class="field-label">{{ t('leaderTools.aiSchedule.durationLabel') }}</label>
          <input v-model.number="aiForm.duration" type="number" min="1" max="14" class="field-input" />
        </div>
        <div>
          <label class="field-label">{{ t('leaderTools.aiSchedule.passengerLabel') }}</label>
          <input v-model.number="aiForm.passengerCount" type="number" min="1" class="field-input" />
        </div>
      </div>

      <!-- Row 2: budget / currency / shore excursion (cruise only) -->
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="field-label">{{ t('leaderTools.aiSchedule.budgetLabel') }}</label>
          <input
            v-model.number="aiForm.budgetPerPax"
            type="number"
            min="0"
            :placeholder="t('leaderTools.aiSchedule.budgetPlaceholder')"
            class="field-input"
          />
        </div>
        <div>
          <label class="field-label">{{ t('leaderTools.aiSchedule.currencyLabel') }}</label>
          <select v-model="aiForm.currency" class="field-input">
            <option value="USD">USD ($)</option>
            <option value="KRW">KRW (₩)</option>
            <option value="EUR">EUR (€)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="SGD">SGD (S$)</option>
          </select>
        </div>
        <div v-if="aiForm.tripType === 'cruise'" class="sm:col-span-2">
          <label class="field-label">{{ t('leaderTools.aiSchedule.shoreExcursionLabel') }}</label>
          <select v-model="aiForm.shoreExcursion" class="field-input">
            <option value="guided">{{ t('leaderTools.aiSchedule.shoreOptions.guided') }}</option>
            <option value="free">{{ t('leaderTools.aiSchedule.shoreOptions.free') }}</option>
            <option value="mixed">{{ t('leaderTools.aiSchedule.shoreOptions.mixed') }}</option>
          </select>
        </div>
        <div :class="aiForm.tripType === 'cruise' ? 'sm:col-span-4' : 'sm:col-span-2'">
          <label class="field-label">{{ t('leaderTools.aiSchedule.notesLabel') }}</label>
          <input
            v-model="aiForm.notes"
            type="text"
            :placeholder="t('leaderTools.aiSchedule.notesPlaceholder')"
            class="field-input"
          />
        </div>
      </div>

      <div class="mt-5">
        <button
          :disabled="aiLoading || !aiForm.destination"
          class="inline-flex items-center gap-2 rounded-full bg-ocean px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-ocean/90 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
          @click="generateSchedule"
        >
          <span v-if="aiLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span v-else>✨</span>
          {{ aiLoading ? t('leaderTools.aiSchedule.generating') : t('leaderTools.aiSchedule.generateBtn') }}
        </button>
      </div>

      <div v-if="aiError" class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {{ t('leaderTools.aiSchedule.errorTitle') }}: {{ aiError }}
      </div>
    </Card>

    <!-- AI Result -->
    <template v-if="aiResult">
      <div class="flex items-center gap-3">
        <div class="h-px flex-1 bg-black/10 dark:bg-white/10" />
        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
          {{ t('leaderTools.aiSchedule.resultTitle') }} · {{ aiResult.destination }}
        </span>
        <div class="h-px flex-1 bg-black/10 dark:bg-white/10" />
      </div>

      <!-- Day-by-day schedule -->
      <div class="space-y-4">
        <Card v-for="day in aiResult.schedule" :key="day.day" class="border-l-4 border-ocean/40">
          <div class="flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-full bg-ocean text-xs font-bold text-white">{{ day.day }}</span>
            <h4 class="font-display font-semibold">{{ t('leaderTools.aiSchedule.day') }} {{ day.day }} · {{ day.title }}</h4>
          </div>
          <div class="mt-4 space-y-2">
            <div
              v-for="(item, idx) in day.items"
              :key="idx"
              class="flex items-start gap-3 rounded-lg bg-black/[0.02] px-3 py-2 dark:bg-white/[0.03]"
            >
              <span class="mt-0.5 text-base leading-none">{{ typeIcon(item.type) }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-semibold text-sm">{{ item.time }}</span>
                  <span class="text-xs text-black/40 dark:text-white/40 truncate">{{ item.location }}</span>
                </div>
                <p class="mt-0.5 text-sm text-black/70 dark:text-white/70">{{ item.activity }}</p>
                <p v-if="item.notes" class="mt-0.5 text-xs text-black/40 dark:text-white/40 italic">{{ item.notes }}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Budget Breakdown Table -->
      <Card v-if="aiResult.budget">
        <div class="flex items-center justify-between">
          <h4 class="font-display font-semibold text-lg">💰 {{ t('leaderTools.aiSchedule.budgetTitle') }}</h4>
          <span class="text-xs text-black/40 dark:text-white/40">{{ aiResult.budget.currency }}</span>
        </div>

        <!-- Budget Table -->
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-black/10 dark:border-white/10">
                <th class="pb-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-black/40 dark:text-white/40">{{ t('leaderTools.aiSchedule.budgetItem') }}</th>
                <th class="pb-2 text-right text-xs font-semibold uppercase tracking-[0.15em] text-black/40 dark:text-white/40">{{ t('leaderTools.aiSchedule.budgetPerPax') }}</th>
                <th class="pb-2 text-right text-xs font-semibold uppercase tracking-[0.15em] text-black/40 dark:text-white/40">{{ t('leaderTools.aiSchedule.budgetGroup', { count: aiForm.passengerCount }) }}</th>
                <th class="pb-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-black/40 dark:text-white/40 pl-4">{{ t('leaderTools.aiSchedule.budgetNote') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5 dark:divide-white/5">
              <tr v-for="(row, i) in aiResult.budget.breakdown" :key="i" class="group">
                <td class="py-2.5 pr-4">
                  <div class="flex items-center gap-2">
                    <span class="text-base">{{ categoryIcon(row.category) }}</span>
                    <span class="text-black/80 dark:text-white/80">{{ row.item }}</span>
                  </div>
                </td>
                <td class="py-2.5 text-right font-mono text-black/70 dark:text-white/70">
                  {{ formatMoney(row.perPax, aiResult.budget.currency) }}
                </td>
                <td class="py-2.5 text-right font-mono text-black/70 dark:text-white/70">
                  {{ formatMoney(row.groupTotal, aiResult.budget.currency) }}
                </td>
                <td class="py-2.5 pl-4 text-xs text-black/40 dark:text-white/40">{{ row.note }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-ocean/30">
                <td class="pt-3 font-bold text-black dark:text-white">{{ t('leaderTools.aiSchedule.budgetTotal') }}</td>
                <td class="pt-3 text-right font-mono font-bold text-ocean">{{ formatMoney(aiResult.budget.perPax, aiResult.budget.currency) }}</td>
                <td class="pt-3 text-right font-mono font-bold text-ocean">{{ formatMoney(aiResult.budget.groupTotal, aiResult.budget.currency) }}</td>
                <td class="pt-3 pl-4 text-xs text-black/40 dark:text-white/40">{{ t('leaderTools.aiSchedule.budgetGroup', { count: aiForm.passengerCount }) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Shore Excursion Options (Cruise) -->
        <template v-if="aiResult.budget.shoreExcursionOptions?.length">
          <h5 class="mt-6 font-semibold text-sm">⚓ {{ t('leaderTools.aiSchedule.shoreExcursionLabel') }}</h5>
          <div class="mt-3 space-y-3">
            <div
              v-for="(opt, i) in aiResult.budget.shoreExcursionOptions"
              :key="i"
              class="rounded-lg border border-black/10 p-3 dark:border-white/10"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="font-semibold text-sm">{{ opt.port }}</p>
                  <p class="mt-0.5 text-xs text-black/50 dark:text-white/50">{{ opt.label }}</p>
                  <ul v-if="opt.included?.length" class="mt-2 space-y-0.5">
                    <li v-for="(inc, j) in opt.included" :key="j" class="flex items-center gap-1.5 text-xs text-black/60 dark:text-white/60">
                      <span class="h-1 w-1 rounded-full bg-ocean/60" />
                      {{ inc }}
                    </li>
                  </ul>
                </div>
                <span class="shrink-0 rounded-full bg-ocean/10 px-3 py-1 text-sm font-mono font-semibold text-ocean">
                  {{ formatMoney(opt.perPax, aiResult.budget.currency) }}<span class="text-xs font-normal">/인</span>
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Saving Tips -->
        <template v-if="aiResult.budget.savingTips?.length">
          <h5 class="mt-5 font-semibold text-sm">💡 절약 팁</h5>
          <ul class="mt-2 space-y-1.5">
            <li
              v-for="(tip, i) in aiResult.budget.savingTips"
              :key="i"
              class="flex items-start gap-2 text-sm text-black/60 dark:text-white/60"
            >
              <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              {{ tip }}
            </li>
          </ul>
        </template>
      </Card>

      <!-- Tips & Checklist -->
      <div class="grid gap-4 sm:grid-cols-2">
        <Card v-if="aiResult.tips?.length">
          <h4 class="font-display font-semibold">💡 {{ t('leaderTools.aiSchedule.tips') }}</h4>
          <ul class="mt-3 space-y-2">
            <li v-for="(tip, i) in aiResult.tips" :key="i" class="flex items-start gap-2 text-sm text-black/70 dark:text-white/70">
              <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ocean" />
              {{ tip }}
            </li>
          </ul>
        </Card>
        <Card v-if="aiResult.checklist?.length">
          <h4 class="font-display font-semibold">✅ {{ t('leaderTools.aiSchedule.checklist') }}</h4>
          <ul class="mt-3 space-y-2">
            <li v-for="(item, i) in aiResult.checklist" :key="i" class="flex items-center gap-2 text-sm text-black/70 dark:text-white/70">
              <span class="h-4 w-4 shrink-0 rounded border-2 border-ocean/40 text-center text-xs leading-3 text-ocean">✓</span>
              {{ item }}
            </li>
          </ul>
        </Card>
      </div>
    </template>

    <!-- Today's schedule & checklist -->
    <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.scheduleTitle') }}</h3>
        <div class="mt-4 space-y-3 text-sm text-black/70 dark:text-white/70">
          <div v-for="item in schedule" :key="item.time" class="flex items-center justify-between">
            <span>{{ item.time }} · {{ item.task }}</span>
            <span class="text-xs text-black/50 dark:text-white/50">{{ item.location }}</span>
          </div>
        </div>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.checklistTitle') }}</h3>
        <ul class="mt-4 space-y-2 text-sm text-black/70 dark:text-white/70">
          <li v-for="item in checklist" :key="item">{{ item }}</li>
        </ul>
      </Card>
    </div>

    <div class="section-grid">
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.passengerListTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.passengerListSubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.openManifest') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.flightInfoTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.flightInfoSubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.viewArrivals') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.hotelInfoTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.hotelInfoSubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.roomingList') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.cruiseItineraryTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.cruiseItinerarySubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.openItinerary') }}</BaseButton>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('leaderTools.operationalNotesTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ t('leaderTools.operationalNotesSubtitle') }}</p>
        <BaseButton class="mt-4" variant="outline">{{ t('leaderTools.buttons.openNotes') }}</BaseButton>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta, lang } = useI18n();
const api = useApiClient();

const schedule = computed(() => ta<{ time: string; task: string; location: string }>('leaderTools.scheduleItems'));
const checklist = computed(() => ta<string>('leaderTools.checklistItems'));

interface ScheduleItem {
  time: string;
  activity: string;
  location: string;
  type: string;
  notes?: string;
}

interface DaySchedule {
  day: number;
  title: string;
  items: ScheduleItem[];
}

interface BudgetRow {
  item: string;
  perPax: number;
  groupTotal: number;
  note: string;
  category: string;
}

interface ShoreOption {
  port: string;
  option: string;
  label: string;
  perPax: number;
  included: string[];
}

interface Budget {
  currency: string;
  perPax: number;
  groupTotal: number;
  breakdown: BudgetRow[];
  shoreExcursionOptions: ShoreOption[] | null;
  savingTips: string[];
}

interface AiScheduleResult {
  destination: string;
  duration: number;
  schedule: DaySchedule[];
  budget?: Budget;
  tips: string[];
  checklist: string[];
}

const aiForm = reactive({
  destination: '',
  tripType: 'land_tour',
  duration: 2,
  passengerCount: 20,
  budgetPerPax: null as number | null,
  currency: 'USD',
  shoreExcursion: 'guided',
  notes: ''
});

const aiLoading = ref(false);
const aiError = ref('');
const aiResult = ref<AiScheduleResult | null>(null);

const typeIcon = (type: string) => {
  const icons: Record<string, string> = { transport: '🚌', activity: '📍', meal: '🍽️', accommodation: '🏨' };
  return icons[type] || '📌';
};

const categoryIcon = (cat: string) => {
  const icons: Record<string, string> = {
    transport: '🚌', activity: '📍', meal: '🍽️', accommodation: '🏨',
    entrance: '🎫', guide: '👤', misc: '📦'
  };
  return icons[cat] || '📌';
};

const formatMoney = (amount: number, currency: string) => {
  if (amount == null) return '-';
  const symbols: Record<string, string> = { USD: '$', KRW: '₩', EUR: '€', JPY: '¥', SGD: 'S$' };
  const sym = symbols[currency] || currency + ' ';
  return sym + Number(amount).toLocaleString();
};

const generateSchedule = async () => {
  if (!aiForm.destination) return;
  aiLoading.value = true;
  aiError.value = '';
  aiResult.value = null;

  try {
    const result = await api.post<AiScheduleResult>('/api/schedule-ai', {
      destination: aiForm.destination,
      tripType: aiForm.tripType,
      duration: aiForm.duration,
      passengerCount: aiForm.passengerCount,
      language: lang.value,
      budgetPerPax: aiForm.budgetPerPax || undefined,
      currency: aiForm.currency,
      shoreExcursion: aiForm.tripType === 'cruise' ? aiForm.shoreExcursion : undefined,
      notes: aiForm.notes || undefined
    });
    aiResult.value = result;
  } catch (err: unknown) {
    const error = err as { data?: { error?: string }; message?: string };
    aiError.value = error?.data?.error || error?.message || 'Unknown error';
  } finally {
    aiLoading.value = false;
  }
};

definePageMeta({
  middleware: ['auth']
});
</script>

<style scoped>
.field-label {
  @apply block text-xs font-semibold uppercase tracking-[0.15em] text-black/50 dark:text-white/50;
}
.field-input {
  @apply mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black placeholder:text-black/30 focus:border-ocean focus:outline-none dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/30;
}
</style>
