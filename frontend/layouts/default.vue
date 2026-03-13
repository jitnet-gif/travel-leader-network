<template>
  <div class="min-h-screen">
    <div class="flex">
      <Sidebar v-model:open="mobileOpen" />
      <div class="flex-1 lg:ml-0">
        <Navbar v-model:query="query" @menu="mobileOpen = true" />
        <main class="mx-auto max-w-6xl px-6 py-10">
          <slot />
        </main>
        <footer class="border-t border-black/5 bg-white/70 dark:border-white/10 dark:bg-slate-950/70">
          <div class="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-black/60 md:flex-row md:items-center md:justify-between dark:text-white/60">
            <span>{{ t('footer.copyright') }}</span>
            <div class="flex gap-4">
              <NuxtLink class="hover:text-ocean" to="/community">{{ t('footer.community') }}</NuxtLink>
              <NuxtLink class="hover:text-ocean" to="/leader-tools">{{ t('footer.leaderTools') }}</NuxtLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const query = ref('');
const mobileOpen = ref(false);
const { t } = useI18n();
</script>
