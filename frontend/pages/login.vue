<template>
  <div class="mx-auto max-w-lg">
    <SectionHeader :eyebrow="t('login.eyebrow')" :title="t('login.title')" :subtitle="t('login.subtitle')" />
    <Card>
      <!-- Email Confirmation State -->
      <div v-if="showEmailConfirmation" class="space-y-4 text-center">
        <div class="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p class="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">✅ 확인 이메일이 전송되었습니다</p>
          <p class="text-sm text-blue-700 dark:text-blue-200">{{ email }}로 전송된 확인 링크를 클릭해주세요</p>
        </div>
        <div class="border-t pt-4">
          <p class="mb-3 text-sm text-black/60 dark:text-white/60">아직 이메일을 받지 못하셨나요?</p>
          <BaseButton variant="outline" @click="resetToLogin">
            다시 로그인하기
          </BaseButton>
        </div>
      </div>

      <!-- Login/Register Form -->
      <form v-else class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="text-xs uppercase tracking-[0.2em] text-black/50">{{ t('login.emailLabel') }}</label>
          <input
            v-model="email"
            class="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/30 dark:border-white/10 dark:bg-slate-900"
            type="email"
            required
            :disabled="loading"
          />
        </div>
        <div>
          <label class="text-xs uppercase tracking-[0.2em] text-black/50">{{ t('login.passwordLabel') }}</label>
          <input
            v-model="password"
            class="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/30 dark:border-white/10 dark:bg-slate-900"
            type="password"
            required
            :disabled="loading"
          />
        </div>
        <div>
          <label class="text-xs uppercase tracking-[0.2em] text-black/50">{{ t('login.roleLabel') }}</label>
          <select
            v-model="role"
            class="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/30 dark:border-white/10 dark:bg-slate-900"
            :disabled="loading"
          >
            <option value="tour_leader">{{ t('login.roleOptions.tourLeader') }}</option>
            <option value="agency">{{ t('login.roleOptions.agency') }}</option>
            <option value="admin">{{ t('login.roleOptions.admin') }}</option>
          </select>
        </div>

        <!-- Error message -->
        <div v-if="errorMsg" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          {{ errorMsg }}
        </div>
        <!-- Success message -->
        <div v-if="successMsg" class="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400">
          {{ successMsg }}
        </div>

        <div class="flex flex-wrap gap-3">
          <BaseButton type="submit" :disabled="loading">
            {{ loading ? t('login.signingIn') : t('login.signIn') }}
          </BaseButton>
          <BaseButton variant="outline" type="button" :disabled="loading" @click="isRegistering = !isRegistering">
            {{ isRegistering ? t('login.backToLogin') : t('login.createAccount') }}
          </BaseButton>
        </div>

        <!-- Info help text -->
        <p class="text-xs text-black/50 dark:text-white/50">
          {{ isRegistering
            ? '회원가입 후 이메일 확인이 필요합니다. 스팸 폴더도 확인해주세요.'
            : '로그인 후 대시보드에 접근할 수 있습니다.'
          }}
        </p>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const api = useApiClient();
const { init } = useAuth();

const email = ref('');
const password = ref('');
const role = ref<'tour_leader' | 'agency' | 'admin'>('tour_leader');
const errorMsg = ref('');
const successMsg = ref('');
const loading = ref(false);
const isRegistering = ref(false);
const showEmailConfirmation = ref(false);

const clearMessages = () => {
  errorMsg.value = '';
  successMsg.value = '';
};

const resetToLogin = () => {
  showEmailConfirmation.value = false;
  isRegistering.value = false;
  clearMessages();
};

const onSubmit = async () => {
  clearMessages();

  if (isRegistering.value) {
    await onRegister();
  } else {
    await onLogin();
  }
};

const onLogin = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = t('login.emailPasswordRequired');
    return;
  }

  loading.value = true;
  try {
    const response = await api.auth.login(email.value, password.value);
    
    if (response?.session?.access_token) {
      // Store token in localStorage or cookie
      localStorage.setItem('auth_token', response.session.access_token);
      console.log('[Login] SignIn successful');
      init();
      await navigateTo('/dashboard');
    } else {
      errorMsg.value = '로그인에 실패했습니다';
    }
  } catch (e: any) {
    console.error('[Login] Unexpected error:', e);
    errorMsg.value = e?.data?.error || '로그인 중 오류가 발생했습니다';
  } finally {
    loading.value = false;
  }
};

const onRegister = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = t('login.emailPasswordRequired');
    return;
  }

  if (password.value.length < 6) {
    errorMsg.value = '비밀번호는 최소 6자 이상이어야 합니다';
    return;
  }

  loading.value = true;
  try {
    const response = await api.auth.signup(email.value, password.value, role.value);
    
    if (response?.user) {
      console.log('[Login] SignUp successful, showing email confirmation');
      showEmailConfirmation.value = true;
      successMsg.value = t('login.confirmEmail') || '확인 이메일이 전송되었습니다';
    } else {
      errorMsg.value = '회원가입에 실패했습니다';
    }
  } catch (e: any) {
    console.error('[Login] SignUp error:', e);
    errorMsg.value = e?.data?.error || '회원가입 중 오류가 발생했습니다';
  } finally {
    loading.value = false;
  }
};
</script>
