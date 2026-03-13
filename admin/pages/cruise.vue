<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-display">Cruise Management</h2>
    <div class="rounded-2xl border border-black/5 p-6 space-y-6">
      <div>
        <h3 class="font-semibold">Cruise Lines</h3>
        <div class="mt-3 grid gap-2 text-sm">
          <div class="flex items-center justify-between">
            <span>Oceanic Voyages</span>
            <span class="text-black/50">Active</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Harbor Crown Cruises</span>
            <span class="text-black/50">Active</span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="font-semibold">Cruise Ports</h3>
        <div class="mt-3 grid gap-2 text-sm">
          <div class="flex items-center justify-between">
            <span>Yokohama Port</span>
            <span class="text-black/50">Japan</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Manila South Harbor</span>
            <span class="text-black/50">Philippines</span>
          </div>
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
