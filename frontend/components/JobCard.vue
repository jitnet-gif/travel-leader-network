<script setup lang="ts">
type Job = {
  agency: string;
  title?: string;
  country: string;
  tour_date: string;
  salary: string;
  description: string;
};

defineProps<{ job: Job }>();

const { t } = useI18n();
</script>

<template>
  <div class="group p-2 bg-white dark:bg-ocean-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:shadow-ocean-900/5 transition-all duration-300 cursor-pointer">
    <div class="w-full sm:w-48 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-white/5 relative">
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-white/10">work</span>
      </div>
      <!-- Image could be added here if available in data -->
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-sky-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-sky-500/20">Verified</span>
      </div>
    </div>
    
    <div class="py-4 pr-8 flex flex-col justify-between flex-grow">
      <div>
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-bold text-sky-600 uppercase tracking-widest">{{ job.agency }} • {{ job.tour_date }}</span>
          <span class="text-xl font-display font-extrabold text-ocean-900 dark:text-white">{{ job.salary }}</span>
        </div>
        <h4 class="text-xl font-display font-bold mt-2 text-ocean-900 dark:text-white group-hover:text-sky-600 transition-colors tracking-tight leading-tight">
          {{ job.title || t('jobs.assignment', { country: job.country }) }}
        </h4>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-2 line-clamp-2 leading-relaxed">
          {{ job.description }}
        </p>
      </div>
      
      <div class="flex items-center justify-between mt-6">
        <div class="flex items-center gap-4">
           <div class="flex items-center gap-1.5">
             <span class="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ t('common.statusOpen') }}</span>
           </div>
           <div class="flex items-center gap-1.5">
             <span class="material-symbols-outlined text-sm text-sky-500">location_on</span>
             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ job.country }}</span>
           </div>
        </div>
        <BaseButton variant="primary" size="sm" class="opacity-0 group-hover:opacity-100 transition-opacity">
           {{ t('common.apply') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
