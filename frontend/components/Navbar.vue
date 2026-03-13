<template>
  <header class="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
      <div class="flex items-center gap-3">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-xs font-semibold uppercase tracking-[0.2em] text-black/70 lg:hidden dark:border-white/10 dark:text-white/70"
          @click="emit('menu')"
        >
          {{ t('common.menu') }}
        </button>
        <div class="hidden md:block">
          <SearchBar v-model="query" :placeholder="t('common.searchPlaceholder')" />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-black/70 dark:border-white/10 dark:text-white/70"
          @click="toggleTheme"
        >
          {{ theme.mode === 'dark' ? t('common.lightMode') : t('common.darkMode') }}
        </button>
        <button
          class="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-black/70 dark:border-white/10 dark:text-white/70"
          @click="toggleLang"
        >
          {{ langLabel }}
        </button>
        <span
          class="hidden rounded-full border px-3 py-2 text-xs font-semibold lg:inline-flex"
          :class="supabaseReady ? 'border-green-400 text-green-600 dark:text-green-300' : 'border-amber-400 text-amber-600 dark:text-amber-300'"
        >
          {{ supabaseReady ? t('common.supabaseOk') : t('common.supabaseMissing') }}
        </span>
        <BaseButton to="/dashboard" size="sm">{{ t('common.openDashboard') }}</BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const query = defineModel<string>('query', { default: '' });
const emit = defineEmits<{ (e: 'menu'): void }>();
const theme = useThemeStore();
const { t, lang, init, toggleLang } = useI18n();
const { $supabaseReady } = useNuxtApp();

onMounted(() => {
  theme.init();
  init();
});

const toggleTheme = () => theme.toggle();

const langLabel = computed(() => (lang.value === 'en' ? 'KR' : 'EN'));
const supabaseReady = computed(() => $supabaseReady);
</script>
