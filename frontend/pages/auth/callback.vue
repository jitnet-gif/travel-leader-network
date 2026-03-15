<template>
  <div class="min-h-screen flex items-center justify-center">
    <Card class="max-w-md w-full">
      <div v-if="loading" class="text-center space-y-4">
        <div class="animated">
          <div class="spinner" />
        </div>
        <p class="text-lg font-semibold">이메일 인증 처리 중...</p>
      </div>

      <div v-else-if="error" class="text-center space-y-4">
        <p class="text-2xl">❌</p>
        <p class="text-lg font-semibold text-red-600">인증 실패</p>
        <p class="text-sm text-black/60">{{ error }}</p>
        <NuxtLink to="/login">
          <BaseButton class="w-full">로그인 페이지로 돌아가기</BaseButton>
        </NuxtLink>
      </div>

      <div v-else class="text-center space-y-4">
        <p class="text-2xl">✅</p>
        <p class="text-lg font-semibold text-green-600">이메일 인증 완료!</p>
        <p class="text-sm text-black/60">계정이 활성화되었습니다. 로그인해주세요.</p>
        <NuxtLink to="/login">
          <BaseButton class="w-full">로그인하기</BaseButton>
        </NuxtLink>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const supabase = useSupabase();

const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    // Get the auth code from URL
    const code = route.query.code as string;

    if (!code) {
      error.value = '인증 코드를 찾을 수 없습니다.';
      loading.value = false;
      return;
    }

    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      error.value = exchangeError.message || '인증 중 오류가 발생했습니다.';
      console.error('[Auth Callback] Error:', exchangeError);
    }

    loading.value = false;

    // Redirect to dashboard if successful
    if (!error.value) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await navigateTo('/dashboard');
    }
  } catch (e) {
    console.error('[Auth Callback] Unexpected error:', e);
    error.value = '예상치 못한 오류가 발생했습니다.';
    loading.value = false;
  }
});
</script>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #0d8bda;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
