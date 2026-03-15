<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string;
    variant?: 'primary' | 'ghost' | 'outline' | 'white';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button'
  }
);

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'button'));

const variantClass = computed(() => {
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base'
  };
  
  const base = `inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 ${sizes[props.size]}`;
  
  if (props.variant === 'ghost') {
    return `${base} text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5`;
  }
  if (props.variant === 'outline') {
    return `${base} border border-slate-200 dark:border-white/10 text-ocean-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5`;
  }
  if (props.variant === 'white') {
    return `${base} bg-white text-ocean-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5`;
  }
  return `${base} bg-ocean-900 dark:bg-sky-500 text-white shadow-lg hover:bg-sky-600 dark:hover:bg-sky-400 hover:shadow-xl hover:-translate-y-0.5`;
});
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :type="tag === 'button' ? type : undefined"
    :class="variantClass"
  >
    <slot />
  </component>
</template>
