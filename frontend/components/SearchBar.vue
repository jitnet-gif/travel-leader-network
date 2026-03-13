<template>
  <label
    class="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs text-black/60 dark:border-white/10 dark:bg-slate-900 dark:text-white/70"
  >
    <span class="text-[10px] uppercase tracking-[0.2em]">{{ t('common.search') }}</span>
    <input
      v-model="model"
      class="w-36 bg-transparent text-xs text-ink outline-none placeholder:text-black/30 md:w-44 dark:placeholder:text-white/40"
      :placeholder="resolvedPlaceholder"
    />
  </label>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    placeholder?: string;
  }>(),
  {
    placeholder: ''
  }
);

const { t } = useI18n();

const resolvedPlaceholder = computed(() => props.placeholder || t('common.searchPlaceholder'));
</script>
