<template>
  <div class="fixed right-3 bottom-6 z-50 flex flex-col gap-2">
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition active:scale-90 hover:bg-white dark:hover:bg-slate-700"
      aria-label="Scroll up"
      @click="scrollUp"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-black/60 dark:text-white/60"><path d="m18 15-6-6-6 6"/></svg>
    </button>
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 border border-black/10 dark:border-white/15 shadow-lg backdrop-blur-sm transition active:scale-90 hover:bg-white dark:hover:bg-slate-700"
      aria-label="Scroll down"
      @click="scrollDown"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-black/60 dark:text-white/60"><path d="m6 9 6 6 6-6"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const scrollUp   = () => window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
const scrollDown = () => window.scrollBy({ top:  window.innerHeight * 0.8, behavior: 'smooth' });
</script>
