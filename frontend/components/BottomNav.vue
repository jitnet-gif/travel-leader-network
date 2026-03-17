<template>
  <nav class="fixed bottom-0 w-full bg-white dark:bg-ocean-900 border-t border-slate-100 dark:border-white/10 pb-safe z-40 lg:hidden">
    <div class="flex justify-around items-center h-16 px-2 relative">
      <NuxtLink 
        v-for="item in items" 
        :key="item.name" 
        :to="item.to"
        class="flex flex-col items-center justify-center w-16 h-full text-slate-400 hover:text-sky-500 transition-colors"
        active-class="text-sky-500"
      >
        <!-- Center FAB (if specified) -->
        <div v-if="item.isFab" class="absolute -top-5 flex items-center justify-center w-14 h-14 bg-sky-500 rounded-full shadow-lg shadow-sky-500/30 text-white">
          <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 0">{{ item.icon }}</span>
        </div>
        
        <!-- Standard Icon -->
        <span v-else class="material-symbols-outlined text-2xl mb-1" :class="isActive(item.to) ? 'fill-icon' : ''" :style="isActive(item.to) ? 'font-variation-settings: \'FILL\' 1' : 'font-variation-settings: \'FILL\' 0'">
          {{ item.icon }}
        </span>
        
        <!-- Label -->
        <span v-if="!item.isFab" class="text-[10px] font-medium">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

// Make this customizable passing a prop, 
// or define default bottom nav based on current route context.
const route = useRoute();

const items = computed(() => {
  // If we are in countries/global directory (match picture 2)
  if (route.path.includes('/countries')) {
    return [
      { name: 'Home', icon: 'home', to: '/' },
      { name: 'Countries', icon: 'public', to: '/countries' },
      { name: 'Add', icon: 'add', to: '/add', isFab: true },
      { name: 'Alerts', icon: 'notifications', to: '/alerts' },
      { name: 'Settings', icon: 'settings', to: '/settings' },
    ];
  }
  
  // Default (match picture 3/4)
  return [
    { name: 'Home', icon: 'home', to: '/' },
    { name: 'Trips', icon: 'work', to: '/trips' }, // using work as suitcase
    { name: 'Alerts', icon: 'notifications', to: '/alerts' },
    { name: 'Network', icon: 'group', to: '/network' },
  ];
});

const isActive = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.fill-icon {
  font-variation-settings: 'FILL' 1;
}
</style>
