<template>
  <Card>
    <p class="text-xs uppercase tracking-[0.2em] text-black/40">{{ label }}</p>
    <p class="mt-2 text-2xl font-display">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-black/60">{{ hint }}</p>
  </Card>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  hint?: string;
}>();
</script>
