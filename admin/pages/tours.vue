<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-display">Tour Management</h2>
    <div class="rounded-2xl border border-black/5 p-6">
      <div class="grid gap-4 text-sm">
        <div class="flex items-center justify-between">
          <span>Japan Spring Tour Leader</span>
          <span class="text-black/50">Open</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Manila Cruise Escort</span>
          <span class="text-black/50">Open</span>
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
