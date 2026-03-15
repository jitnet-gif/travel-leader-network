<script setup lang="ts">
const emit = defineEmits<{ (e: 'menu'): void }>();
const theme = useThemeStore();
const { t, lang, init, toggleLang } = useI18n();
const { $supabaseReady } = useNuxtApp();
const { user } = useAuth();

onMounted(() => {
  theme.init();
  init();
});

const toggleTheme = () => theme.toggle();
const langLabel = computed(() => (lang.value === 'en' ? 'KR' : 'EN'));
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-100 dark:border-white/5 bg-ivory/80 dark:bg-ocean-900/80 backdrop-blur-md">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <div class="flex items-center gap-4">
        <button
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/10 lg:hidden"
          @click="emit('menu')"
        >
          <span class="material-symbols-outlined text-ocean-900 dark:text-white">menu</span>
        </button>
        <div class="hidden md:flex flex-col">
          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Status</p>
          <div class="flex items-center gap-2 mt-0.5">
             <div class="w-2 h-2 rounded-full" :class="$supabaseReady ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'"></div>
             <span class="text-xs font-bold text-ocean-900 dark:text-white">{{ $supabaseReady ? 'Cloud Synced' : 'Offline Mode' }}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
        <!-- Theme Toggle -->
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          @click="toggleTheme"
        >
          <span class="material-symbols-outlined text-slate-600 dark:text-slate-400">
            {{ theme.mode === 'dark' ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <!-- Language Toggle -->
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-bold text-xs text-slate-600 dark:text-slate-400"
          @click="toggleLang"
        >
          {{ langLabel }}
        </button>

        <div class="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block"></div>

        <template v-if="user">
          <NuxtLink to="/dashboard" class="flex items-center gap-3 pl-2 group">
            <div class="hidden sm:block text-right">
              <p class="text-xs font-bold text-ocean-900 dark:text-white leading-none">Hana Lee</p>
              <p class="text-[10px] font-bold text-sky-600 uppercase mt-1 tracking-wider">Senior Leader</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 overflow-hidden ring-2 ring-sky-500/0 group-hover:ring-sky-500/20 transition-all">
               <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover">
               <div v-else class="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 font-bold">H</div>
            </div>
          </NuxtLink>
        </template>
        <template v-else>
           <BaseButton to="/login" variant="primary" size="sm">Sign In</BaseButton>
        </template>
      </div>
    </div>
  </header>
</template>
