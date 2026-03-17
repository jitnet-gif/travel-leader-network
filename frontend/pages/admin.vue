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

    <!-- Feature Flags -->
    <Card>
      <h3 class="text-lg font-display">Frontend Menu &amp; Feature Management</h3>
      <p class="mt-1 text-sm text-black/60 dark:text-white/60">사이드바 메뉴 및 기능의 표시 여부를 제어합니다.</p>
      <div class="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        <label
          v-for="f in navFeatures"
          :key="f.key"
          class="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-white/5 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <span class="material-symbols-outlined text-xl text-slate-400">{{ f.icon }}</span>
          <span class="flex-1 text-sm font-semibold text-ocean-900 dark:text-white">{{ f.label }}</span>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
            :class="(flags[f.key] ?? true) ? 'bg-sky-500' : 'bg-slate-200 dark:bg-white/10'"
            @click="toggle(f.key, !(flags[f.key] ?? true))"
          >
            <span
              class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200"
              :class="(flags[f.key] ?? true) ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
        </label>
      </div>
    </Card>

    <!-- Role Permissions Management -->
    <Card>
      <h3 class="text-lg font-display">Role-Based Access Control</h3>
      <p class="mt-1 text-sm text-black/60 dark:text-white/60">역할별 메뉴 및 기능 접근 권한을 설정합니다.</p>
      
      <div class="mt-4 space-y-6">
        <div v-for="role in roles" :key="role.name" class="border border-slate-100 dark:border-white/5 rounded-xl p-4">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-md font-semibold text-ocean-900 dark:text-white">{{ role.label }}</h4>
            <span class="text-xs text-slate-500">{{ role.description }}</span>
          </div>
          
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <h5 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">메뉴 권한</h5>
              <div class="space-y-2">
                <label v-for="menu in availableMenus" :key="menu.key" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="role.permissions.menus.includes(menu.key)"
                    @change="toggleRoleMenu(role.name, menu.key, $event.target.checked)"
                    class="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span class="text-sm">{{ menu.label }}</span>
                </label>
              </div>
            </div>
            
            <div>
              <h5 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">기능 권한</h5>
              <div class="space-y-2">
                <label v-for="feature in availableFeatures" :key="feature.key" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="role.permissions.features.includes(feature.key)"
                    @change="toggleRoleFeature(role.name, feature.key, $event.target.checked)"
                    class="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span class="text-sm">{{ feature.label }}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="mt-4 flex justify-end">
            <BaseButton variant="outline" size="sm" @click="saveRolePermissions(role.name)">
              권한 저장
            </BaseButton>
          </div>
        </div>
      </div>
    </Card>

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
const { flags, load, toggle } = useFeatureFlags();

const adminModules = computed(() => ta<{ title: string; description: string; actions: string[] }>('admin.modules'));

definePageMeta({
  middleware: ['auth']
});

onMounted(() => load());

const navFeatures = [
  { key: 'nav.dashboard',   label: 'Dashboard',     icon: 'dashboard' },
  { key: 'nav.countries',   label: 'Countries',     icon: 'public' },
  { key: 'nav.airports',    label: 'Airports',      icon: 'flight_takeoff' },
  { key: 'nav.cruiseLines', label: 'Cruise Lines',  icon: 'directions_boat' },
  { key: 'nav.cruisePorts', label: 'Cruise Ports',  icon: 'anchor' },
  { key: 'nav.audioGuide',  label: 'Audio Guide',   icon: 'headphones' },
  { key: 'nav.jobs',        label: 'Jobs',           icon: 'work' },
  { key: 'nav.community',   label: 'Community',     icon: 'forum' },
  { key: 'nav.leaderTools', label: 'Leader Tools',  icon: 'construction' },
  { key: 'nav.education',   label: 'Education',     icon: 'school' },
  { key: 'nav.emergency',   label: 'Emergency',     icon: 'emergency' },
  { key: 'nav.routes',      label: 'Routes',        icon: 'route' },
];

// Role permissions management
const availableMenus = [
  { key: 'dashboard', label: '대시보드' },
  { key: 'countries', label: '국가 정보' },
  { key: 'airports', label: '공항 정보' },
  { key: 'cruise-lines', label: '크루즈 라인' },
  { key: 'cruise-ports', label: '크루즈 포트' },
  { key: 'tour-jobs', label: '투어 직업' },
  { key: 'community-posts', label: '커뮤니티 게시물' },
  { key: 'leader-tools', label: '리더 도구' },
  { key: 'admin', label: '관리자 패널' },
];

const availableFeatures = [
  { key: 'create_airports', label: '공항 생성' },
  { key: 'edit_airports', label: '공항 편집' },
  { key: 'delete_airports', label: '공항 삭제' },
  { key: 'create_cruise_lines', label: '크루즈 라인 생성' },
  { key: 'edit_cruise_lines', label: '크루즈 라인 편집' },
  { key: 'delete_cruise_lines', label: '크루즈 라인 삭제' },
  { key: 'create_posts', label: '게시물 생성' },
  { key: 'edit_posts', label: '게시물 편집' },
  { key: 'delete_posts', label: '게시물 삭제' },
  { key: 'create_jobs', label: '직업 생성' },
  { key: 'edit_jobs', label: '직업 편집' },
  { key: 'delete_jobs', label: '직업 삭제' },
  { key: 'manage_users', label: '사용자 관리' },
  { key: 'view_applications', label: '지원서 조회' },
  { key: 'manage_applications', label: '지원서 관리' },
];

const roles = ref([
  {
    name: 'admin',
    label: '관리자',
    description: '모든 기능에 접근 가능',
    permissions: {
      menus: ['dashboard', 'countries', 'airports', 'cruise-lines', 'cruise-ports', 'tour-jobs', 'community-posts', 'leader-tools', 'admin'],
      features: ['create_airports', 'edit_airports', 'delete_airports', 'create_cruise_lines', 'edit_cruise_lines', 'delete_cruise_lines', 'create_posts', 'edit_posts', 'delete_posts', 'create_jobs', 'edit_jobs', 'delete_jobs', 'manage_users', 'view_applications', 'manage_applications']
    }
  },
  {
    name: 'agency',
    label: '에이전시',
    description: '직업 및 지원서 관리',
    permissions: {
      menus: ['dashboard', 'tour-jobs', 'community-posts'],
      features: ['create_jobs', 'edit_jobs', 'delete_jobs', 'view_applications', 'manage_applications', 'create_posts', 'edit_posts']
    }
  },
  {
    name: 'leader',
    label: '투어 리더',
    description: '기본 정보 조회 및 지원',
    permissions: {
      menus: ['dashboard', 'countries', 'airports', 'cruise-lines', 'cruise-ports', 'community-posts'],
      features: ['create_posts', 'edit_posts', 'view_applications']
    }
  }
]);

const toggleRoleMenu = (roleName: string, menuKey: string, enabled: boolean) => {
  const role = roles.value.find(r => r.name === roleName);
  if (!role) return;
  
  if (enabled && !role.permissions.menus.includes(menuKey)) {
    role.permissions.menus.push(menuKey);
  } else if (!enabled) {
    role.permissions.menus = role.permissions.menus.filter(m => m !== menuKey);
  }
};

const toggleRoleFeature = (roleName: string, featureKey: string, enabled: boolean) => {
  const role = roles.value.find(r => r.name === roleName);
  if (!role) return;
  
  if (enabled && !role.permissions.features.includes(featureKey)) {
    role.permissions.features.push(featureKey);
  } else if (!enabled) {
    role.permissions.features = role.permissions.features.filter(f => f !== featureKey);
  }
};

const saveRolePermissions = async (roleName: string) => {
  const role = roles.value.find(r => r.name === roleName);
  if (!role) return;
  
  try {
    // 백엔드 API를 통해 권한 저장
    const response = await $fetch(`/api/permissions/${roleName}`, {
      method: 'PUT',
      body: {
        menus: role.permissions.menus,
        features: role.permissions.features
      }
    });
    
    console.log('Permissions saved:', response);
    // 성공 메시지 표시
  } catch (error) {
    console.error('Failed to save permissions:', error);
    // 에러 메시지 표시
  }
};

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
