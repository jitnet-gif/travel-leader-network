<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  hint?: string;
  icon?: string;
  color?: 'sky' | 'amber' | 'emerald' | 'rose';
}>();

const colorClasses = {
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
};
</script>

<template>
  <div class="rounded-[2rem] bg-white dark:bg-ocean-900 p-8 border border-slate-100 dark:border-white/5 shadow-premium transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group">
    <div v-if="icon" class="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" :class="colorClasses[color || 'sky']">
      <span class="material-symbols-outlined text-2xl">{{ icon }}</span>
    </div>
    <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{{ label }}</p>
    <p class="mt-2 text-3xl font-display font-bold text-ocean-900 dark:text-white tracking-tight">{{ value }}</p>
    <p v-if="hint" class="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{{ hint }}</p>
  </div>
</template>
