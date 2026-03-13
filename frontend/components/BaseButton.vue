<template>
  <component
    :is="tag"
    :to="to"
    :type="tag === 'button' ? type : undefined"
    class="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
    :class="variantClass"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string;
    variant?: 'primary' | 'ghost' | 'outline';
    size?: 'sm' | 'md';
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button'
  }
);

const tag = computed(() => (props.to ? 'NuxtLink' : 'button'));

const variantClass = computed(() => {
  const size = props.size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2';
  if (props.variant === 'ghost') {
    return `${size} text-ink hover:text-ocean hover:bg-sky/60`;
  }
  if (props.variant === 'outline') {
    return `${size} border border-ocean/40 text-ocean hover:bg-sky/60`;
  }
  return `${size} bg-ocean text-white hover:bg-[#0a5a6a] shadow-soft`;
});
</script>
