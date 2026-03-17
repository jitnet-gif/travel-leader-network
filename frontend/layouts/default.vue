<template>
  <div class="min-h-screen bg-ivory dark:bg-ocean-900 transition-colors duration-300">
    <div class="flex">
      <Sidebar v-model:open="mobileOpen" />
      <div class="flex-1 lg:ml-0 flex flex-col min-h-screen">
        <Navbar @menu="mobileOpen = true" />
        <main class="mx-auto w-full max-w-7xl px-6 py-5 flex-grow animate-fade-up">
          <slot />
        </main>
        <AiChatbot />
        <ScrollButtons />
        <footer class="hidden lg:block border-t border-slate-100 dark:border-white/5 bg-white/50 dark:bg-ocean-900/50 backdrop-blur-sm">
          <div class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-xs font-bold uppercase tracking-widest text-slate-400 md:flex-row md:items-center md:justify-between">
            <span>{{ t('footer.copyright') }}</span>
            <div class="flex gap-6">
              <NuxtLink class="hover:text-sky-500 transition-colors" to="/community">{{ t('footer.community') }}</NuxtLink>
              <NuxtLink class="hover:text-sky-500 transition-colors" to="/leader-tools">{{ t('footer.leaderTools') }}</NuxtLink>
            </div>
          </div>
        </footer>
        <BottomNav />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mobileOpen = ref(false);
const { t } = useI18n();
</script>
