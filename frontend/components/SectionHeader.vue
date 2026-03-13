<template>
  <div class="mb-6 flex flex-col gap-2">
    <p v-if="eyebrow" class="text-xs uppercase tracking-[0.2em] text-ocean">{{ eyebrow }}</p>
    <h2 class="text-2xl md:text-3xl font-display">{{ title }}</h2>
    <p v-if="subtitle" class="text-sm text-black/60 max-w-2xl">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  eyebrow?: string;
}>();
</script>
