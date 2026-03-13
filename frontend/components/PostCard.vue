<template>
  <Card>
    <div class="flex items-start justify-between gap-3">
      <div>
        <Tag>{{ post.category || t('community.general') }}</Tag>
        <h3 class="mt-3 text-lg font-display">{{ post.title }}</h3>
      </div>
      <span class="text-xs text-black/40 dark:text-white/40">{{ post.created_at }}</span>
    </div>
    <p class="mt-3 text-sm text-black/70 dark:text-white/70">{{ post.content }}</p>
    <div class="mt-4 flex items-center justify-between text-xs text-black/50 dark:text-white/50">
      <span>{{ t('common.by') }} {{ post.author }}</span>
      <span>{{ post.likes ?? 0 }} {{ t('common.likes') }}</span>
    </div>
  </Card>
</template>

<script setup lang="ts">
type Post = {
  title: string;
  content: string;
  author: string;
  category?: string;
  created_at: string;
  likes?: number;
};

defineProps<{ post: Post }>();

const { t } = useI18n();
</script>
