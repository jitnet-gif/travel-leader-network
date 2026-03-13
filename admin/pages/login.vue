<template>
  <div class="mx-auto max-w-md space-y-6">
    <div>
      <p class="text-xs uppercase tracking-[0.2em] text-accent">Admin Access</p>
      <h2 class="mt-2 text-2xl font-display">Sign in</h2>
    </div>
    <div class="rounded-2xl border border-black/5 bg-white p-6">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="text-xs uppercase tracking-[0.2em] text-black/50">Email</label>
          <input v-model="email" class="mt-2 w-full rounded-lg border border-black/10 px-3 py-2" type="email" required />
        </div>
        <div>
          <label class="text-xs uppercase tracking-[0.2em] text-black/50">Password</label>
          <input v-model="password" class="mt-2 w-full rounded-lg border border-black/10 px-3 py-2" type="password" required />
        </div>
        <button class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white" type="submit">Sign In</button>
        <p v-if="message" class="text-sm text-accent">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $supabase } = useNuxtApp();
const email = ref('');
const password = ref('');
const message = ref('');

const onSubmit = async () => {
  const { error } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  if (error) {
    message.value = error.message;
    return;
  }
  navigateTo('/');
};
</script>
