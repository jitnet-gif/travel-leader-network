<template>
  <div class="space-y-3">
    <input type="file" @change="onFileChange" />
    <p v-if="message" class="text-xs text-black/60">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    bucket?: string;
  }>(),
  {
    bucket: 'documents'
  }
);

const { t } = useI18n();
const message = ref('');
const supabase = useSupabase();

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const filePath = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(props.bucket).upload(filePath, file);
  message.value = error ? error.message : t('common.uploadComplete');
};
</script>
