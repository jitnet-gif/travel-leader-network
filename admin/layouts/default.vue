<template>
  <div class="min-h-screen bg-frost">
    <div class="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-[260px_1fr]">
      <aside class="rounded-3xl bg-white p-6 shadow">
        <div class="mb-8">
          <p class="text-xs uppercase tracking-[0.2em] text-accent">Admin</p>
          <h1 class="mt-2 text-xl font-display">Travel Leader Network</h1>
        </div>
        <nav class="space-y-3 text-sm">
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-frost" to="/">Dashboard</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-frost" to="/users">User Management</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-frost" to="/tours">Tour Management</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-frost" to="/countries">Country Management</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-frost" to="/airports">Airport Management</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-frost" to="/cruise">Cruise Management</NuxtLink>
          <NuxtLink class="block rounded-lg px-3 py-2 hover:bg-frost" to="/community">Community Moderation</NuxtLink>
        </nav>
      </aside>
      <main class="rounded-3xl bg-white p-8 shadow">
        <slot />
      </main>
    </div>
  </div>
</template>
