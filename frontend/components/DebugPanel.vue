<template>
  <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-950 text-white overflow-hidden font-mono text-xs">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-white/10">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span class="font-bold tracking-wider uppercase text-white/60">Debug Panel</span>
      </div>
      <div class="flex gap-2">
        <button
          class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition text-white/70 flex items-center gap-1.5"
          @click="copyAllLogs"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          로그 복사
        </button>
        <button
          class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition text-white/70"
          @click="runAll"
        >▶ 전체 테스트</button>
        <button
          class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition text-white/70"
          @click="clearLogs"
        >✕ 지우기</button>
      </div>
    </div>

    <!-- API Test Buttons -->
    <div class="flex flex-wrap gap-2 px-4 py-3 border-b border-white/10 bg-slate-900/60">
      <button
        v-for="test in TESTS"
        :key="test.id"
        class="flex items-center gap-1.5 px-3 py-1 rounded-lg border transition text-[11px] font-semibold"
        :class="statusClass(test.id)"
        @click="runTest(test)"
      >
        <span>{{ statusIcon(test.id) }}</span>
        <span>{{ test.label }}</span>
        <span v-if="durations[test.id]" class="text-white/40">{{ durations[test.id] }}ms</span>
      </button>
    </div>

    <!-- Log output -->
    <div ref="logEl" class="h-64 overflow-y-auto px-4 py-3 space-y-1.5">
      <div v-if="!logs.length" class="text-white/30 italic py-8 text-center">
        테스트 버튼을 눌러 API를 확인하세요
      </div>
      <div
        v-for="(log, i) in logs"
        :key="i"
        class="flex items-start gap-2 group"
      >
        <span class="shrink-0 mt-0.5" :class="log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'warn' ? 'text-amber-400' : 'text-white/40'">
          {{ log.type === 'error' ? '✗' : log.type === 'success' ? '✓' : log.type === 'warn' ? '!' : '·' }}
        </span>
        <span class="text-white/30 shrink-0">{{ log.time }}</span>
        <span :class="log.type === 'error' ? 'text-red-300' : log.type === 'success' ? 'text-emerald-300' : log.type === 'warn' ? 'text-amber-300' : 'text-white/70'" class="break-all flex-1">{{ log.msg }}</span>
        <button
          class="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition text-white/40 hover:text-white"
          title="로그 복사"
          @click="copyText(log.msg)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </div>
    </div>

    <!-- Console error intercept notice -->
    <div class="px-4 py-2 border-t border-white/10 bg-slate-900/40 flex items-center justify-between">
      <span class="text-white/30">콘솔 에러 자동 수집</span>
      <span class="text-white/40">{{ errorCount }}개 감지됨</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LogEntry {
  time: string;
  type: 'info' | 'success' | 'error' | 'warn';
  msg: string;
}

interface TestDef {
  id: string;
  label: string;
  run: () => Promise<string>;
}

const logs = ref<LogEntry[]>([]);
const statuses = ref<Record<string, 'idle' | 'running' | 'ok' | 'error'>>({});
const durations = ref<Record<string, number>>({});
const errorCount = ref(0);
const logEl = ref<HTMLElement | null>(null);

const now = () => new Date().toLocaleTimeString('ko-KR', { hour12: false });

const addLog = (type: LogEntry['type'], msg: string) => {
  logs.value.push({ time: now(), type, msg });
  nextTick(() => { if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight; });
};

const TESTS: TestDef[] = [
  {
    id: 'chat',
    label: '/api/chat',
    run: async () => {
      const res = await $fetch<{ reply: string }>('/api/chat', {
        method: 'POST',
        body: { messages: [{ role: 'user', content: '안녕' }], language: 'ko' },
      });
      return `reply: ${res.reply?.slice(0, 60)}...`;
    },
  },
  {
    id: 'schedule',
    label: '/api/schedule-ai',
    run: async () => {
      const res = await $fetch<{ destination?: string }>('/api/schedule-ai', {
        method: 'POST',
        body: { destination: 'Tokyo', tripType: 'city_tour', duration: 2, passengerCount: 10, language: 'ko' },
      });
      return `destination: ${(res as { destination?: string })?.destination || JSON.stringify(res).slice(0, 60)}`;
    },
  },
  {
    id: 'airports',
    label: '/api/airports',
    run: async () => {
      const res = await $fetch<unknown[]>('/api/airports');
      return `${Array.isArray(res) ? res.length : '?'}개 공항`;
    },
  },
  {
    id: 'airport-detail',
    label: '/api/airport-detail/ICN',
    run: async () => {
      const res = await $fetch<{ name?: string; facilities?: unknown[] }>('/api/airport-detail/ICN');
      return `${res.name} / 시설 ${res.facilities?.length ?? 0}개`;
    },
  },
  {
    id: 'countries',
    label: '/api/countries',
    run: async () => {
      const res = await $fetch<unknown[]>('/api/countries');
      return `${Array.isArray(res) ? res.length : '?'}개 국가`;
    },
  },
];

const runTest = async (test: TestDef) => {
  statuses.value[test.id] = 'running';
  addLog('info', `[${test.label}] 테스트 시작...`);
  const start = Date.now();
  try {
    const result = await test.run();
    const ms = Date.now() - start;
    durations.value[test.id] = ms;
    statuses.value[test.id] = 'ok';
    addLog('success', `[${test.label}] ✓ ${result} (${ms}ms)`);
  } catch (err: unknown) {
    const ms = Date.now() - start;
    durations.value[test.id] = ms;
    statuses.value[test.id] = 'error';
    const e = err as { statusCode?: number; message?: string; data?: { message?: string } };
    const msg = e?.data?.message || e?.message || String(err);
    addLog('error', `[${test.label}] ✗ ${e?.statusCode ? `HTTP ${e.statusCode}` : ''} ${msg} (${ms}ms)`);
  }
};

const runAll = async () => {
  addLog('info', '── 전체 API 테스트 시작 ──');
  for (const test of TESTS) {
    await runTest(test);
  }
  addLog('info', '── 완료 ──');
};

const clearLogs = () => {
  logs.value = [];
  statuses.value = {};
  durations.value = {};
};

const copyText = (text: string) => {
  if (!process.client) return;
  navigator.clipboard.writeText(text).then(() => {
    // Optionally alert or show UI feedback
  });
};

const copyAllLogs = () => {
  const text = logs.value.map(l => `[${l.time}] ${l.type.toUpperCase()}: ${l.msg}`).join('\n');
  copyText(text);
};

const statusClass = (id: string) => {
  const s = statuses.value[id] || 'idle';
  if (s === 'ok')      return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20';
  if (s === 'error')   return 'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20';
  if (s === 'running') return 'border-amber-500/50 bg-amber-500/10 text-amber-400 animate-pulse';
  return 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10';
};

const statusIcon = (id: string) => {
  const s = statuses.value[id] || 'idle';
  if (s === 'ok')      return '✓';
  if (s === 'error')   return '✗';
  if (s === 'running') return '…';
  return '○';
};

// 콘솔 에러 자동 수집
onMounted(() => {
  if (!process.client) return;
  const origError = console.error.bind(console);
  const origWarn = console.warn.bind(console);
  console.error = (...args: unknown[]) => {
    origError(...args);
    errorCount.value++;
    addLog('error', args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ').slice(0, 200));
  };
  console.warn = (...args: unknown[]) => {
    origWarn(...args);
    addLog('warn', args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ').slice(0, 200));
  };
});
</script>
