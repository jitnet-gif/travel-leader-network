<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-display">Community Moderation</h2>
    <div class="rounded-2xl border border-black/5 p-6">
      <div class="grid gap-4 text-sm">
        <div class="flex items-center justify-between">
          <span>Boarding checklist essentials</span>
          <span class="text-black/50">Approved</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Lost passport in Tokyo</span>
          <span class="text-black/50">Flagged</span>
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
