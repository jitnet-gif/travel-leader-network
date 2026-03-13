<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('admin.eyebrow')" :title="t('admin.title')" :subtitle="t('admin.subtitle')" />

    <div class="grid gap-6 md:grid-cols-3">
      <StatCard :label="t('admin.stats.activeUsers')" value="1,284" :hint="t('admin.stats.activeUsersHint')" />
      <StatCard :label="t('admin.stats.contentUpdates')" value="56" :hint="t('admin.stats.contentUpdatesHint')" />
      <StatCard :label="t('admin.stats.openJobs')" value="128" :hint="t('admin.stats.openJobsHint')" />
    </div>

    <div class="section-grid">
      <Card v-for="module in adminModules" :key="module.title">
        <h3 class="text-lg font-display">{{ module.title }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ module.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <Tag v-for="action in module.actions" :key="action">{{ action }}</Tag>
        </div>
        <BaseButton class="mt-4" variant="outline">{{ t('common.manage') }}</BaseButton>
      </Card>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <h3 class="text-lg font-display">Add Country (EN/KR)</h3>
        <form class="mt-4 grid gap-3" @submit.prevent="submitCountry">
          <div class="grid gap-2 md:grid-cols-2">
            <input v-model="countryForm.name_en" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Name (EN)" required />
            <input v-model="countryForm.name_ko" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Name (KR)" required />
          </div>
          <textarea v-model="countryForm.visa_en" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Visa info (EN)" rows="2"></textarea>
          <textarea v-model="countryForm.visa_ko" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Visa info (KR)" rows="2"></textarea>
          <div class="grid gap-2 md:grid-cols-2">
            <input v-model="countryForm.embassy_en" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Embassy (EN)" />
            <input v-model="countryForm.embassy_ko" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Embassy (KR)" />
          </div>
          <div class="grid gap-2 md:grid-cols-2">
            <input v-model="countryForm.emergency_en" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Emergency # (EN)" />
            <input v-model="countryForm.emergency_ko" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Emergency # (KR)" />
          </div>
          <textarea v-model="countryForm.tips_en" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Immigration tips (EN)" rows="2"></textarea>
          <textarea v-model="countryForm.tips_ko" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Immigration tips (KR)" rows="2"></textarea>
          <div class="flex flex-wrap gap-3">
            <BaseButton type="submit" :disabled="countryLoading">{{ countryLoading ? 'Saving...' : 'Save Country' }}</BaseButton>
            <p v-if="countryMsg" class="text-sm text-ocean">{{ countryMsg }}</p>
          </div>
        </form>
      </Card>

      <Card>
        <h3 class="text-lg font-display">Add Job (EN/KR)</h3>
        <form class="mt-4 grid gap-3" @submit.prevent="submitJob">
          <input v-model="jobForm.agency" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Agency" required />
          <div class="grid gap-2 md:grid-cols-2">
            <input v-model="jobForm.country_en" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Country (EN)" required />
            <input v-model="jobForm.country_ko" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Country (KR)" required />
          </div>
          <input v-model="jobForm.tour_date" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Tour date (YYYY-MM-DD)" required />
          <input v-model="jobForm.salary" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Salary" required />
          <input v-model="jobForm.title_en" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Title (EN)" required />
          <input v-model="jobForm.title_ko" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Title (KR)" required />
          <textarea v-model="jobForm.desc_en" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Description (EN)" rows="2"></textarea>
          <textarea v-model="jobForm.desc_ko" class="w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900" placeholder="Description (KR)" rows="2"></textarea>
          <div class="flex flex-wrap gap-3">
            <BaseButton type="submit" :disabled="jobLoading">{{ jobLoading ? 'Saving...' : 'Save Job' }}</BaseButton>
            <p v-if="jobMsg" class="text-sm text-ocean">{{ jobMsg }}</p>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, ta } = useI18n();
const supabase = useSupabase();

const adminModules = computed(() => ta<{ title: string; description: string; actions: string[] }>('admin.modules'));

definePageMeta({
  middleware: ['auth']
});

const countryForm = reactive({
  name_en: '',
  name_ko: '',
  visa_en: '',
  visa_ko: '',
  embassy_en: '',
  embassy_ko: '',
  emergency_en: '',
  emergency_ko: '',
  tips_en: '',
  tips_ko: ''
});
const countryLoading = ref(false);
const countryMsg = ref('');

const submitCountry = async () => {
  countryLoading.value = true;
  countryMsg.value = '';
  try {
    const { data, error } = await supabase
      .from('countries')
      .insert({
        name: countryForm.name_en,
        visa_info: countryForm.visa_en,
        embassy: countryForm.embassy_en,
        emergency_number: countryForm.emergency_en,
        immigration_tips: countryForm.tips_en
      })
      .select('id')
      .single();

    if (error || !data) throw error;

    const countryId = data.id;
    const { error: i18nError } = await supabase.from('countries_i18n').insert([
      {
        country_id: countryId,
        lang: 'en',
        name: countryForm.name_en,
        visa_info: countryForm.visa_en,
        embassy: countryForm.embassy_en,
        emergency_number: countryForm.emergency_en,
        immigration_tips: countryForm.tips_en
      },
      {
        country_id: countryId,
        lang: 'ko',
        name: countryForm.name_ko,
        visa_info: countryForm.visa_ko,
        embassy: countryForm.embassy_ko,
        emergency_number: countryForm.emergency_ko,
        immigration_tips: countryForm.tips_ko
      }
    ]);

    if (i18nError) throw i18nError;
    countryMsg.value = 'Saved country with translations.';
  } catch (err: unknown) {
    countryMsg.value = err instanceof Error ? err.message : 'Save failed';
  } finally {
    countryLoading.value = false;
  }
};

const jobForm = reactive({
  agency: '',
  country_en: '',
  country_ko: '',
  tour_date: '',
  salary: '',
  title_en: '',
  title_ko: '',
  desc_en: '',
  desc_ko: ''
});
const jobLoading = ref(false);
const jobMsg = ref('');

const submitJob = async () => {
  jobLoading.value = true;
  jobMsg.value = '';
  try {
    const { data, error } = await supabase
      .from('tour_jobs')
      .insert({
        agency: jobForm.agency,
        country: jobForm.country_en,
        tour_date: jobForm.tour_date,
        salary: jobForm.salary,
        title: jobForm.title_en,
        description: jobForm.desc_en
      })
      .select('id')
      .single();

    if (error || !data) throw error;
    const jobId = data.id;

    const { error: i18nError } = await supabase.from('tour_jobs_i18n').insert([
      {
        tour_job_id: jobId,
        lang: 'en',
        title: jobForm.title_en,
        description: jobForm.desc_en,
        country: jobForm.country_en
      },
      {
        tour_job_id: jobId,
        lang: 'ko',
        title: jobForm.title_ko,
        description: jobForm.desc_ko,
        country: jobForm.country_ko
      }
    ]);

    if (i18nError) throw i18nError;
    jobMsg.value = 'Saved job with translations.';
  } catch (err: unknown) {
    jobMsg.value = err instanceof Error ? err.message : 'Save failed';
  } finally {
    jobLoading.value = false;
  }
};
</script>
