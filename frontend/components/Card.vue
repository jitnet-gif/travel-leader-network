<script setup lang="ts">
defineProps<{
  premium?: boolean;
  glass?: boolean;
}>();
</script>

<template>
  <div
    class="rounded-[2rem] p-8 transition-all duration-300"
    :class="[
      glass ? 'glass' : 'bg-white dark:bg-ocean-900 border border-slate-100 dark:border-white/5 shadow-premium',
      premium ? 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ocean-900/5' : ''
    ]"
  >
    <slot />
  </div>
</template>
