<template>
  <div class="mx-auto max-w-lg">
    <SectionHeader :eyebrow="t('login.eyebrow')" :title="t('login.title')" :subtitle="t('login.subtitle')" />
    <Card>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="text-xs uppercase tracking-[0.2em] text-black/50">{{ t('login.emailLabel') }}</label>
          <input
            v-model="email"
            class="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
            type="email"
            required
          />
        </div>
        <div>
          <label class="text-xs uppercase tracking-[0.2em] text-black/50">{{ t('login.passwordLabel') }}</label>
          <input
            v-model="password"
            class="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
            type="password"
            required
          />
        </div>
        <div>
          <label class="text-xs uppercase tracking-[0.2em] text-black/50">{{ t('login.roleLabel') }}</label>
          <select v-model="role" class="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-slate-900">
            <option value="tour_leader">{{ t('login.roleOptions.tourLeader') }}</option>
            <option value="agency">{{ t('login.roleOptions.agency') }}</option>
            <option value="admin">{{ t('login.roleOptions.admin') }}</option>
          </select>
        </div>
        <div class="flex flex-wrap gap-3">
          <BaseButton type="submit">{{ t('login.signIn') }}</BaseButton>
          <BaseButton variant="outline" @click="onRegister" type="button">{{ t('login.createAccount') }}</BaseButton>
        </div>
        <p v-if="message" class="text-sm text-ocean">{{ message }}</p>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const supabase = useSupabase();
const email = ref('');
const password = ref('');
const role = ref<'tour_leader' | 'agency' | 'admin'>('tour_leader');
const message = ref('');

const onSubmit = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  if (error) {
    message.value = error.message;
    return;
  }
  navigateTo('/dashboard');
};

const onRegister = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { role: role.value }
    }
  });
  message.value = error ? error.message : t('login.confirmEmail');
};
</script>
