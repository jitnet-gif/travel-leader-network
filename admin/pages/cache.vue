<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-display">캐시 자동 업데이트</h2>
      <p class="mt-1 text-sm text-black/50">입국 팁·복장·주류 정보를 전국 자동 갱신합니다 (매일 새벽 3시 KST).</p>
    </div>

    <!-- Status card -->
    <div class="rounded-2xl border border-black/5 p-6 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold">마지막 갱신</p>
          <p class="text-xs text-black/40 mt-0.5">{{ lastRunAt ?? '실행 기록 없음' }}</p>
        </div>
        <button
          class="rounded-xl bg-blue-600 text-white text-sm font-semibold px-5 py-2 hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="running"
          @click="runNow"
        >
          <span v-if="running">⏳ 업데이트 중…</span>
          <span v-else">▶ 지금 실행</span>
        </button>
      </div>

      <!-- Progress -->
      <div v-if="running || result" class="space-y-2">
        <div v-if="running" class="text-xs text-blue-600 animate-pulse">AI가 각 국가별 최신 정보를 검색 중입니다…</div>
        <template v-if="result">
          <div class="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            ✅ {{ result.refreshed.length }}개 캐시 갱신 완료
          </div>
          <div v-if="result.errors.length" class="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ⚠️ {{ result.errors.length }}개 오류: {{ result.errors.slice(0, 5).join(', ') }}{{ result.errors.length > 5 ? ' …' : '' }}
          </div>
        </template>
      </div>
    </div>

    <!-- Schedule info -->
    <div class="rounded-2xl border border-black/5 p-6 space-y-3 text-sm">
      <p class="font-semibold">⏰ 자동 스케줄 설정 방법</p>
      <p class="text-black/60">Cloudflare Cron Trigger 또는 외부 크론 서비스에서 아래 엔드포인트를 <strong>매일 18:00 UTC (새벽 3시 KST)</strong>에 호출하세요.</p>
      <code class="block rounded-lg bg-slate-100 px-4 py-3 text-xs font-mono text-black/80 break-all">
        POST https://travel-leader-network.pages.dev/api/admin/refresh-cache
      </code>
      <p class="text-xs text-black/40">
        Cloudflare Dashboard → Workers & Pages → travel-leader-network → Settings → Cron Triggers<br>
        Cron 표현식: <code class="font-mono bg-slate-100 px-1 rounded">0 18 * * *</code>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] });

const config = useRuntimeConfig();
const apiBase = config.public.apiBase || 'https://travel-leader-network.pages.dev';

const running = ref(false);
const result = ref<{ refreshed: string[]; errors: string[] } | null>(null);
const lastRunAt = ref<string | null>(null);

const runNow = async () => {
  running.value = true;
  result.value = null;
  try {
    const data = await $fetch<{ ok: boolean; refreshed: string[]; errors: string[] }>(
      `${apiBase}/api/admin/refresh-cache`,
      { method: 'POST' }
    );
    result.value = data;
    lastRunAt.value = new Date().toLocaleString('ko-KR');
  } catch (e) {
    result.value = { refreshed: [], errors: ['요청 실패: ' + String(e)] };
  } finally {
    running.value = false;
  }
};
</script>
