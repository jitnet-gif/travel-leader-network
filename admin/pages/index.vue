<template>
  <div class="space-y-8">
    <div>
      <p class="text-xs uppercase tracking-[0.2em] text-accent">Admin Dashboard</p>
      <h2 class="mt-2 text-3xl font-display">Operational overview</h2>
      <p class="mt-2 text-sm text-black/60">Manage users, agencies, tours, and community content.</p>
    </div>
    <div class="grid gap-6 md:grid-cols-3">
      <AdminStat label="Active Users" value="1,240" hint="+4% this month" />
      <AdminStat label="Open Tours" value="42" hint="18 cruise, 24 land" />
      <AdminStat label="Pending Reviews" value="9" hint="Community posts" />
    </div>
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-black/5 p-6">
        <h3 class="text-lg font-display">Recent agency signups</h3>
        <ul class="mt-3 space-y-2 text-sm text-black/70">
          <li>Blue Compass Travel</li>
          <li>WaveLink Cruises</li>
          <li>Skyline Asia Tours</li>
        </ul>
      </div>
      <div class="rounded-2xl border border-black/5 p-6">
        <h3 class="text-lg font-display">Moderation alerts</h3>
        <ul class="mt-3 space-y-2 text-sm text-black/70">
          <li>2 posts flagged for review</li>
          <li>1 agency profile pending verification</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
});
</script>
