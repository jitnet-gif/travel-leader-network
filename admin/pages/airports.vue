<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-display">Airport Management</h2>
    <div class="rounded-2xl border border-black/5 p-6">
      <div class="grid gap-4 text-sm">
        <div class="flex items-center justify-between">
          <span>Tokyo Haneda (HND)</span>
          <span class="text-black/50">Japan</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Ninoy Aquino (MNL)</span>
          <span class="text-black/50">Philippines</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
});
</script>
