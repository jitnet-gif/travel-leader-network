<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-display">User Management</h2>
    <div class="rounded-2xl border border-black/5 p-6">
      <div class="grid gap-4 text-sm">
        <div class="flex items-center justify-between">
          <span>Maria Santos</span>
          <span class="text-black/50">Leader</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Daniel Park</span>
          <span class="text-black/50">Agency</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Admin Team</span>
          <span class="text-black/50">Admin</span>
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
