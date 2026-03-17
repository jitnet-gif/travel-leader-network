<template>
  <!-- ── Floating Genie Icon ── (항상 표시, 전체화면 제외) -->
  <div
    v-show="!isOpen"
    class="fixed bottom-24 right-3 z-50 flex flex-col items-center gap-2"
  >
    <button
      type="button"
      class="h-16 w-16 rounded-full shadow-2xl transition active:scale-95 focus:outline-none group relative overflow-hidden"
      :style="isMini
        ? 'background: linear-gradient(135deg, #7c4a2a 0%, #3d1f0a 100%); box-shadow: 0 0 0 3px #c8956c55'
        : 'background: linear-gradient(135deg, #c8956c 0%, #7c4a2a 100%)'"
      :aria-label="t('common.open')"
      @click="isMini ? close() : openMini()"
    >
      <span v-if="!isMini" class="absolute inset-0 bg-white/20 animate-pulse" />
      <span class="relative flex h-full w-full items-center justify-center text-4xl select-none drop-shadow-lg">🧞‍♂️</span>
      <!-- 활성 표시기 -->
      <span v-if="isMini" class="absolute top-1 right-1 h-3 w-3 rounded-full bg-emerald-400 shadow" />
      <span class="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-stone-900/90 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition pointer-events-none">
        {{ isMini ? t('chatbot.close') : t('chatbot.name') }}
      </span>
    </button>
  </div>

  <!-- ── Mini Chat Window ── -->
  <Transition name="mini-pop">
    <div
      v-if="isMini && !isOpen"
      class="fixed bottom-24 right-3 z-[55] w-72 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden"
      style="background: rgba(30, 18, 10, 0.96)"
    >
      <!-- Mini Header -->
      <div class="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
        <div class="flex items-center gap-2">
          <span class="text-xl">🧞‍♂️</span>
          <span class="text-xs font-bold" style="color: #d4a574">{{ t('chatbot.name') }}</span>
        </div>
        <div class="flex gap-1">
          <button @click="isOpen = true" class="p-1 hover:bg-white/10 rounded text-white/60"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></button>
          <button @click="close" class="p-1 hover:bg-white/10 rounded text-white/60"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
      </div>

      <!-- Mini Messages -->
      <div class="px-3 py-3 space-y-2 min-h-[80px] max-h-[120px] overflow-y-auto text-xs">
        <div v-if="!messages.length" class="text-white/40 italic text-center py-4">
          {{ t('chatbot.ready') }}...
        </div>
        <div v-for="(msg, i) in messages.slice(-2)" :key="i" :class="msg.role === 'user' ? 'text-right' : 'text-left'">
          <span :class="msg.role === 'user' ? 'text-amber-200' : 'text-white/80'" class="inline-block px-2 py-1 rounded-lg border border-white/5" :style="msg.role === 'user' ? 'background: rgba(160,100,50,0.25)' : 'background: rgba(255,255,255,0.05)'">
            {{ msg.content }}
          </span>
        </div>
        <div v-if="loading" class="flex gap-1 animate-pulse">
          <span class="w-1 h-1 rounded-full" style="background:#c8956c"></span>
          <span class="w-1 h-1 rounded-full" style="background:#c8956c"></span>
          <span class="w-1 h-1 rounded-full" style="background:#c8956c"></span>
        </div>
      </div>

      <!-- Active Alarms -->
      <div v-if="alarms.length" class="px-3 py-2 border-t border-white/10 space-y-1">
        <div v-for="alarm in alarms" :key="alarm.id" class="flex items-center justify-between gap-2 rounded-lg px-2 py-1" style="background: rgba(200,149,108,0.15)">
          <span class="text-[10px] text-amber-300">⏰ {{ alarm.label }}</span>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-white/50">{{ formatCountdown(alarm.fireAt) }}</span>
            <button @click="cancelAlarm(alarm.id)" class="text-white/30 hover:text-red-400 transition text-[10px]">✕</button>
          </div>
        </div>
      </div>

      <!-- Mini Input -->
      <div class="p-2 border-t border-white/10 flex gap-1.5">
        <input
          v-model="textInput"
          class="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/30 outline-none"
          style="focus:border-color: #c8956c"
          :placeholder="t('chatbot.placeholder')"
          @keyup.enter="sendText(textInput)"
        />
        <button
          v-if="speechSupported"
          class="h-7 w-7 flex items-center justify-center rounded-lg transition"
          :class="isListening ? 'animate-pulse' : 'bg-white/10 hover:bg-white/20'"
          :style="isListening ? 'background:#c0392b' : ''"
          @click="toggleListen"
        >
          <svg v-if="isListening" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" class="text-white"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
          <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-white/60"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </button>
        <button
          class="h-7 w-7 flex items-center justify-center rounded-lg transition text-white"
          style="background: #a0642e"
          @click="sendText(textInput)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  </Transition>

  <!-- ── Fullscreen Overlay ── -->
  <Teleport to="body">
    <Transition name="chat-expand">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[60] flex flex-col text-white"
        style="background: #1a0f07"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 border-b border-white/10 px-4 py-3 shrink-0">
          <div class="flex h-9 w-9 items-center justify-center rounded-full text-xl shrink-0 shadow-lg" style="background: linear-gradient(135deg, #c8956c, #7c4a2a)">🧞‍♂️</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold leading-none">{{ t('chatbot.title') }}</p>
            <p class="text-[10px] text-white/40 mt-0.5">Travel Leader Network</p>
          </div>
          <div class="flex items-center gap-2 mr-2">
            <div v-if="isListening" class="flex items-center gap-1">
              <span class="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span class="text-[10px] text-red-400">{{ t('chatbot.listening') }}</span>
            </div>
            <div v-else-if="isSpeaking" class="flex items-center gap-1">
              <span class="h-2 w-2 rounded-full animate-pulse" style="background:#c8956c" />
              <span class="text-[10px]" style="color:#c8956c">{{ t('chatbot.speaking') }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="close"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              title="최소화"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <button
              @click="close"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-red-400"
              title="닫기"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
          <div v-for="(msg, i) in messages" :key="i" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
            <div
              class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm"
              :style="msg.role === 'user'
                ? 'background: #7c4a2a; color: white; border-radius: 1rem 1rem 0.25rem 1rem'
                : 'background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); border: 1px solid rgba(255,255,255,0.05); border-radius: 1rem 1rem 1rem 0.25rem'"
            >
              <div v-html="msg.content.replace(/\n/g, '<br>')"></div>
            </div>
          </div>
          <div v-if="loading" class="flex justify-start">
            <div class="rounded-2xl px-4 py-3" style="background: rgba(255,255,255,0.08)">
              <div class="flex gap-1">
                <span class="h-2 w-2 rounded-full animate-bounce" style="background:#c8956c" />
                <span class="h-2 w-2 rounded-full animate-bounce" style="background:#c8956c; animation-delay:150ms" />
                <span class="h-2 w-2 rounded-full animate-bounce" style="background:#c8956c; animation-delay:300ms" />
              </div>
            </div>
          </div>
        </div>

        <!-- Active Alarms -->
        <div v-if="alarms.length" class="px-4 py-2 border-t border-white/10 flex flex-wrap gap-2" style="background: rgba(30,15,5,0.5)">
          <div v-for="alarm in alarms" :key="alarm.id" class="flex items-center gap-2 rounded-full px-3 py-1 text-xs" style="background: rgba(200,149,108,0.2); border: 1px solid rgba(200,149,108,0.3)">
            <span class="text-amber-300">⏰ {{ alarm.label }}</span>
            <span class="text-white/40">{{ formatCountdown(alarm.fireAt) }}</span>
            <button @click="cancelAlarm(alarm.id)" class="text-white/30 hover:text-red-400 transition ml-1">✕</button>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-white/10 px-4 py-4 shrink-0 space-y-3" style="background: rgba(30,15,5,0.7)">
          <div class="flex items-center gap-2">
            <input
              v-model="textInput"
              class="flex-1 rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
              :placeholder="t('chatbot.placeholder')"
              @keyup.enter="sendText(textInput)"
            />
            <button
              type="button"
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition active:scale-90 text-white"
              :class="isListening ? 'animate-pulse' : ''"
              :style="isListening ? 'background:#c0392b' : 'background:#7c4a2a'"
              @click="toggleListen"
            >
              <svg v-if="isListening" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </button>
            <button
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40 transition"
              style="background: #a0642e"
              :disabled="!textInput.trim() || loading"
              @click="sendText(textInput)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          <div class="flex items-center justify-between px-1">
            <span v-if="voiceCountdown > 0" class="text-[10px] text-amber-400 animate-pulse">{{ voiceCountdown }}초 후 전송...</span>
            <span v-else class="text-[10px] text-white/30">{{ t('chatbot.voiceTts') }}</span>
            <button
              type="button"
              class="relative inline-flex h-5 w-9 rounded-full transition"
              :style="ttsEnabled ? 'background:#a0642e' : 'background:rgba(255,255,255,0.2)'"
              @click="ttsEnabled = !ttsEnabled"
            >
              <span class="inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform" :class="ttsEnabled ? 'translate-x-4' : 'translate-x-0.5'" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { t, lang } = useI18n();
const isOpen    = useState('chatbot-open', () => false);
const isMini    = useState('chatbot-mini', () => false);
const loading   = ref(false);
const textInput = ref('');
const messages  = ref<{ role: 'user' | 'assistant'; content: string }[]>([]);
const messagesEl = ref<HTMLElement | null>(null);

// ── Voice ─────────────────────────────────────────────────────────────────────
const isListening  = ref(false);
const isSpeaking   = ref(false);
const ttsEnabled   = ref(true);
const speechSupported = ref(false);
let recognition: any = null;
let voiceAutoSendTimer: ReturnType<typeof setTimeout> | null = null;
const voiceCountdown = ref(0);

onMounted(() => {
  if (!process.client) return;
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (SR) {
    speechSupported.value = true;
    recognition = new SR();
    recognition.lang = lang.value === 'ko' ? 'ko-KR' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      let final = '';
      for (const result of e.results) { if (result.isFinal) final += result[0].transcript; }
      if (final.trim()) {
        isListening.value = false;
        textInput.value = final.trim();
        // 1초 카운트다운 후 자동 전송
        voiceCountdown.value = 1;
        if (voiceAutoSendTimer) clearTimeout(voiceAutoSendTimer);
        voiceAutoSendTimer = setTimeout(() => {
          voiceCountdown.value = 0;
          sendText(textInput.value);
        }, 1000);
      }
    };
    recognition.onend = () => { isListening.value = false; };
    recognition.onerror = () => { isListening.value = false; voiceCountdown.value = 0; };
  }
});

const toggleListen = () => {
  if (!recognition) return;
  if (voiceAutoSendTimer) { clearTimeout(voiceAutoSendTimer); voiceAutoSendTimer = null; voiceCountdown.value = 0; }
  if (isListening.value) { recognition.stop(); } else { recognition.start(); isListening.value = true; }
};

// iOS/mobile: unlock speechSynthesis on first user gesture
let ttsUnlocked = false;
const unlockTts = () => {
  if (!process.client || ttsUnlocked || !window.speechSynthesis) return;
  const utt = new SpeechSynthesisUtterance('');
  utt.volume = 0;
  window.speechSynthesis.speak(utt);
  ttsUnlocked = true;
};

const speak = (text: string) => {
  if (!process.client || !ttsEnabled.value || !window.speechSynthesis) return;
  // iOS workaround: resume if paused
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang.value === 'ko' ? 'ko-KR' : 'en-US';
  utt.rate = 1.1;
  utt.onstart = () => { isSpeaking.value = true; };
  utt.onend = () => { isSpeaking.value = false; };
  utt.onerror = () => { isSpeaking.value = false; };
  window.speechSynthesis.speak(utt);
};

// ── Alarm ─────────────────────────────────────────────────────────────────────
interface Alarm { id: number; label: string; fireAt: number; timeoutId: ReturnType<typeof setTimeout> }
const alarms = ref<Alarm[]>([]);
let alarmIdSeq = 0;

const requestNotificationPermission = async () => {
  if (!process.client || !('Notification' in window)) return;
  if (Notification.permission === 'default') await Notification.requestPermission();
};

const scheduleAlarm = async (label: string, delayMs: number) => {
  await requestNotificationPermission();
  const id = ++alarmIdSeq;
  const fireAt = Date.now() + delayMs;
  const timeoutId = setTimeout(() => {
    if (process.client && Notification.permission === 'granted') {
      new Notification('⏰ 투어지니 알람', { body: label, icon: '/icons/icon-192.png' });
    }
    speak(label);
    alarms.value = alarms.value.filter(a => a.id !== id);
  }, delayMs);
  alarms.value.push({ id, label, fireAt, timeoutId });
};

const cancelAlarm = (id: number) => {
  const alarm = alarms.value.find(a => a.id === id);
  if (alarm) { clearTimeout(alarm.timeoutId); alarms.value = alarms.value.filter(a => a.id !== id); }
};

const formatCountdown = (fireAt: number) => {
  const ms = fireAt - Date.now();
  if (ms <= 0) return '곧';
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

// Countdown ticker
const tick = ref(0);
let tickInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => { tickInterval = setInterval(() => { tick.value++; }, 1000); });
onUnmounted(() => { if (tickInterval) clearInterval(tickInterval); });

// ── Chat Logic ────────────────────────────────────────────────────────────────
const sendText = async (text: string) => {
  const msg = text.trim();
  if (!msg || loading.value) return;
  textInput.value = '';
  messages.value.push({ role: 'user', content: msg });
  scrollBottom();

  if (msg.includes('지니') || msg.toLowerCase().includes('genie')) {
    const reply = t('chatbot.masterResponse');
    messages.value.push({ role: 'assistant', content: reply });
    speak(reply);
    return;
  }

  // ── 클라이언트 알람 감지 ─────────────────────────────────────────────────
  // 모닝콜: "모닝콜 7시", "7시 모닝콜" 등
  const morningMatch = msg.match(/(?:모닝콜|morning\s*call|wake[\s-]?up).*?(\d{1,2})(?::(\d{2}))?/i)
    || msg.match(/(\d{1,2})(?::(\d{2}))?.*(?:모닝콜|morning\s*call|wake[\s-]?up)/i);
  if (morningMatch) {
    const h = parseInt(morningMatch[1]);
    const m = parseInt(morningMatch[2] || '0');
    const now = new Date();
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const reply = `${h}시 ${m > 0 ? m + '분 ' : ''}모닝콜을 설정했어요! ⏰ 굿 나잇~`;
    messages.value.push({ role: 'assistant', content: reply });
    speak(reply);
    await scheduleAlarm(`모닝콜 ${h}:${String(m).padStart(2,'0')}`, target.getTime() - now.getTime());
    return;
  }
  // N분/시간/초 후 알람: "30분 후 알람", "1시간 후 미팅", "10분 후"
  const delayMatch = msg.match(/(\d+)\s*(시간|분|초)\s*후/);
  if (delayMatch) {
    const n = parseInt(delayMatch[1]);
    const unit = delayMatch[2];
    const msMap: Record<string, number> = { 시간: 3600000, 분: 60000, 초: 1000 };
    const delayMs = n * msMap[unit];
    const label = msg.replace(/알람|설정|해줘|부탁|주세요/g, '').trim().slice(0, 20) || `${n}${unit} 알람`;
    const reply = `${n}${unit} 후 알람을 설정했어요! ⏰`;
    messages.value.push({ role: 'assistant', content: reply });
    speak(reply);
    await scheduleAlarm(label, delayMs);
    return;
  }

  loading.value = true;
  try {
    const res = await $fetch<{ reply: string }>('/api/chat', {
      method: 'POST',
      body: { messages: messages.value.slice(-8), language: lang.value },
    });
    messages.value.push({ role: 'assistant', content: res.reply });
    scrollBottom();
    speak(res.reply);

    if (res.reply.length > 120 || res.reply.includes('1.')) {
      isOpen.value = true;
    }
  } catch (err: unknown) {
    const e = err as { statusCode?: number; data?: { message?: string }; message?: string };
    const detail = e?.data?.message || e?.message || '';
    const code = e?.statusCode;
    const errMsg = code === 403 ? '서버 접근이 차단됐습니다 (403). 잠시 후 다시 시도해주세요.'
      : code === 500 ? 'API 키 설정 오류입니다.'
      : detail ? `오류: ${detail}`
      : '오류가 발생했습니다. 다시 시도해주세요.';
    messages.value.push({ role: 'assistant', content: errMsg });
  } finally {
    loading.value = false;
  }
};

const scrollBottom = () => {
  nextTick(() => { if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight; });
};

const openMini = () => {
  unlockTts();
  isMini.value = true;
  speak(t('chatbot.ready'));
};

const close = () => {
  isOpen.value = false;
  isMini.value = false;
  if (process.client && window.speechSynthesis) window.speechSynthesis.cancel();
};
</script>

<style scoped>
.float-in-enter-active, .float-in-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.float-in-enter-from, .float-in-leave-to { opacity: 0; transform: scale(0.5) translateY(20px); }

.mini-pop-enter-active, .mini-pop-leave-active { transition: all 0.3s ease-out; }
.mini-pop-enter-from, .mini-pop-leave-to { opacity: 0; transform: scale(0.9) translateY(10px); }

.chat-expand-enter-active, .chat-expand-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.chat-expand-enter-from, .chat-expand-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
</style>
