<template>
  <div class="mx-auto max-w-lg">
    <SectionHeader :eyebrow="t('login.eyebrow')" :title="t('login.title')" :subtitle="t('login.subtitle')" />
    <Card>
      <form class="space-y-4" @submit.prevent="onSubmit">
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
          <BaseButton variant="outline" type="button" :disabled="loading" @click="onRegister">
            {{ loading ? t('login.signingIn') : t('login.createAccount') }}
          </BaseButton>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const supabase = useSupabase();
const { init } = useAuth();

const email = ref('');
const password = ref('');
const role = ref<'tour_leader' | 'agency' | 'admin'>('tour_leader');
const errorMsg = ref('');
const successMsg = ref('');
const loading = ref(false);

const clearMessages = () => {
  errorMsg.value = '';
  successMsg.value = '';
};

const onSubmit = async () => {
  clearMessages();
  loading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  loading.value = false;
  if (error) {
    errorMsg.value = error.message;
    return;
  }
  init();
  await navigateTo('/dashboard');
};

const onRegister = async () => {
  clearMessages();
  if (!email.value || !password.value) {
    errorMsg.value = t('login.emailPasswordRequired');
    return;
  }
  loading.value = true;
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: { data: { role: role.value } }
  });
  loading.value = false;
  if (error) {
    errorMsg.value = error.message;
  } else {
    successMsg.value = t('login.confirmEmail');
  }
};
</script>
