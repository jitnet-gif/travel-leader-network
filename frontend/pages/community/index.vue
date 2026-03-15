<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('community.eyebrow')" :title="t('community.title')" :subtitle="t('community.subtitle')" />

    <div class="flex flex-wrap items-center justify-between gap-4">
      <SearchBar v-model="query" :placeholder="t('common.searchPlaceholder')" />
      <BaseButton variant="outline">{{ t('community.newPost') }}</BaseButton>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <PostCard v-for="post in filtered" :key="post.title" :post="post" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { matchesQuery } from '~/composables/useSearch';

type Post = {
  title: string;
  content: string;
  author: string;
  category?: string;
  created_at: string;
  likes?: number;
};

const { t, lang } = useI18n();
const query = useGlobalSearch();

const fallbackPosts = computed<Post[]>(() =>
  lang.value === 'ko'
    ? [
        {
          title: '승선 체크리스트 핵심',
          content: '여권, 바우처, 약 목록을 하나의 파우치에 정리하세요.',
          author: '이하나',
          category: '크루즈 팁',
          created_at: '2026-03-11',
          likes: 18
        },
        {
          title: '창이 환승 빠른 동선',
          content: '피크 타임에는 스카이트레인을 이용해 20분 절약할 수 있습니다.',
          author: '미겔 산토스',
          category: '공항 팁',
          created_at: '2026-03-10',
          likes: 11
        },
        {
          title: '여권 분실 프로토콜',
          content: '대사관 방문 전 경찰 신고서 발급 및 신분증 사본 확보.',
          author: '다나카 아이코',
          category: '비상 사례',
          created_at: '2026-03-09',
          likes: 24
        }
      ]
    : [
        {
          title: 'Boarding checklist essentials',
          content: 'Carry passports, printed vouchers, and medication lists in a single crew pouch.',
          author: 'Hana Lee',
          category: 'Cruise tips',
          created_at: '2026-03-11',
          likes: 18
        },
        {
          title: 'Fast transfer at Changi',
          content: 'Use the Skytrain between terminals during peak hours to save 20 minutes.',
          author: 'Miguel Santos',
          category: 'Airport tips',
          created_at: '2026-03-10',
          likes: 11
        },
        {
          title: 'Lost passport protocol',
          content: 'File a police report before embassy visit and keep copies of guest IDs.',
          author: 'Aiko Tanaka',
          category: 'Emergency cases',
          created_at: '2026-03-09',
          likes: 24
        }
      ]
);

const posts = ref<Post[]>(fallbackPosts.value);

const api = useApiClient();
onMounted(async () => {
  try {
    const result = await api.get<Post[]>('/api/community-posts');
    if (result && result.length) posts.value = result;
  } catch {
    // fallback already set
  }
});

const filtered = computed(() =>
  posts.value.filter((post) =>
    matchesQuery(query.value, [post.title, post.content, post.author, post.category])
  )
);
</script>
