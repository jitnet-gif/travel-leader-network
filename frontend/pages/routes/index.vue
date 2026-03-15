<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('routes.eyebrow')" :title="t('routes.title')" :subtitle="t('routes.subtitle')" />
    <div class="flex flex-wrap items-center justify-between gap-4">
      <SearchBar v-model="query" :placeholder="t('routes.searchPlaceholder')" />
      <BaseButton variant="outline" to="/dashboard">{{ t('routes.dashboard') }}</BaseButton>
    </div>

    <div class="section-grid">
      <Card v-for="route in filtered" :key="route.id">
        <h3 class="text-lg font-display">{{ route.title }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">{{ route.description }}</p>
        <p class="mt-3 text-sm text-black/70 dark:text-white/70">{{ t('routes.start') }}: {{ route.start_location }}</p>
        <p class="mt-2 text-sm text-black/70 dark:text-white/70">{{ t('routes.end') }}: {{ route.end_location }}</p>
        <div v-if="route.waypoints?.length" class="mt-3">
          <p class="text-xs uppercase tracking-[0.2em] text-black/40 dark:text-white/40">{{ t('routes.waypoints') }}</p>
          <div class="mt-2 space-y-1 text-sm text-black/70 dark:text-white/70">
            <div v-for="(point, idx) in route.waypoints" :key="idx">- {{ point }}</div>
          </div>
        </div>
        <p v-if="route.notes" class="mt-3 text-sm text-black/60 dark:text-white/60">
          {{ t('routes.notes') }}: {{ route.notes }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <a
            class="inline-flex items-center justify-center gap-2 rounded-full border border-ocean/40 px-4 py-2 text-xs font-semibold text-ocean hover:bg-sky/60"
            :href="route.maps_url"
            target="_blank"
            rel="noopener"
          >
            {{ t('routes.openMaps') }}
          </a>
          <button
            class="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/70 hover:bg-sky/60 dark:border-white/10 dark:text-white/70"
            @click="copy(route.maps_url)"
          >
            {{ t('routes.copyLink') }}
          </button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { matchesQuery } from '~/composables/useSearch';

const api = useApiClient();
const { t, lang } = useI18n();
const query = useGlobalSearch();
const routes = ref<Array<Record<string, unknown>>>([]);
const usingFallback = ref(true);

const fallbackRoutes = computed(() =>
  lang.value === 'ko'
    ? [
        {
          id: '1',
          title: '싱가포르 시티 하이라이트 루프',
          description:
            '크루즈 도착 동선: 마리나 베이 크루즈 센터 → 가든스 바이 더 베이 → 머라이언 파크 → 래플스 호텔 → 차이나타운 헤리티지 센터 → 복귀',
          start_location: 'Marina Bay Cruise Centre Singapore, 61 Marina Coastal Dr, Singapore 018947',
          end_location: 'Marina Bay Cruise Centre Singapore, 61 Marina Coastal Dr, Singapore 018947',
          waypoints: [
            'Gardens by the Bay, 18 Marina Gardens Dr, Singapore 018953',
            'Merlion Park, 1 Fullerton Rd, Singapore 049213',
            'Raffles Singapore, 1 Beach Rd, Singapore 189673',
            'Chinatown Heritage Centre, 48 Pagoda St, Singapore 059207'
          ],
          maps_url:
            'https://www.google.com/maps/dir/Marina+Bay+Cruise+Centre+Singapore,+61+Marina+Coastal+Dr,+Singapore+018947/Gardens+by+the+Bay,+18+Marina+Gardens+Dr,+Singapore+018953/Merlion+Park,+1+Fullerton+Rd,+Singapore+049213/Raffles+Singapore,+1+Beach+Rd,+Singapore+189673/Chinatown+Heritage+Centre,+48+Pagoda+St,+Singapore+059207/Marina+Bay+Cruise+Centre+Singapore,+61+Marina+Coastal+Dr,+Singapore+018947/@1.2757712,103.8234828,13.4z/data=!3m1!5s0x31da19734845e93f:0x81f2323dbcc673cd!4m38!4m37!1m5!1m1!1s0x31da1900758262cb:0x36ec1640ec829d0c!2m2!1d103.8602571!2d1.2667383!1m5!1m1!1s0x31da1904937e1633:0x62099677b59fca76!2m2!1d103.8636132!2d1.2815683!1m5!1m1!1s0x31da190ed6203605:0x66ad5eee6e01f3a7!2m2!1d103.8543872!2d1.2867449!1m5!1m1!1s0x31da19a5bbca44c1:0x647f3845b65cdec2!2m2!1d103.854483!2d1.294889!1m5!1m1!1s0x31da1973493ae8dd:0x26539d86b7ad1b0b!2m2!1d103.8442036!2d1.2835298!1m5!1m1!1s0x31da1900758262cb:0x36ec1640ec829d0c!2m2!1d103.8602571!2d1.2667383!3e0?entry=ttu&g_ep=EgoyMDI2MDMwOS4wIKXMDSoASAFQAw%3D%3D',
          notes: '각 지점 간 이동 여유 10-15분 확보. 래플스 호텔 하차 지점 사용.'
        }
      ]
    : [
        {
          id: '1',
          title: 'Singapore City Highlights Loop',
          description:
            'Cruise arrival city loop: Marina Bay Cruise Centre → Gardens by the Bay → Merlion Park → Raffles Hotel → Chinatown Heritage Centre → return.',
          start_location: 'Marina Bay Cruise Centre Singapore, 61 Marina Coastal Dr, Singapore 018947',
          end_location: 'Marina Bay Cruise Centre Singapore, 61 Marina Coastal Dr, Singapore 018947',
          waypoints: [
            'Gardens by the Bay, 18 Marina Gardens Dr, Singapore 018953',
            'Merlion Park, 1 Fullerton Rd, Singapore 049213',
            'Raffles Singapore, 1 Beach Rd, Singapore 189673',
            'Chinatown Heritage Centre, 48 Pagoda St, Singapore 059207'
          ],
          maps_url:
            'https://www.google.com/maps/dir/Marina+Bay+Cruise+Centre+Singapore,+61+Marina+Coastal+Dr,+Singapore+018947/Gardens+by+the+Bay,+18+Marina+Gardens+Dr,+Singapore+018953/Merlion+Park,+1+Fullerton+Rd,+Singapore+049213/Raffles+Singapore,+1+Beach+Rd,+Singapore+189673/Chinatown+Heritage+Centre,+48+Pagoda+St,+Singapore+059207/Marina+Bay+Cruise+Centre+Singapore,+61+Marina+Coastal+Dr,+Singapore+018947/@1.2757712,103.8234828,13.4z/data=!3m1!5s0x31da19734845e93f:0x81f2323dbcc673cd!4m38!4m37!1m5!1m1!1s0x31da1900758262cb:0x36ec1640ec829d0c!2m2!1d103.8602571!2d1.2667383!1m5!1m1!1s0x31da1904937e1633:0x62099677b59fca76!2m2!1d103.8636132!2d1.2815683!1m5!1m1!1s0x31da190ed6203605:0x66ad5eee6e01f3a7!2m2!1d103.8543872!2d1.2867449!1m5!1m1!1s0x31da19a5bbca44c1:0x647f3845b65cdec2!2m2!1d103.854483!2d1.294889!1m5!1m1!1s0x31da1973493ae8dd:0x26539d86b7ad1b0b!2m2!1d103.8442036!2d1.2835298!1m5!1m1!1s0x31da1900758262cb:0x36ec1640ec829d0c!2m2!1d103.8602571!2d1.2667383!3e0?entry=ttu&g_ep=EgoyMDI2MDMwOS4wIKXMDSoASAFQAw%3D%3D',
          notes: 'Allow 10-15 minutes between stops for group movement. Use Raffles Hotel drop-off point for coach parking.'
        }
      ]
);

const applyFallback = () => {
  routes.value = fallbackRoutes.value;
};

onMounted(async () => {
  try {
    routes.value = await api.get('/api/route-briefs');
    usingFallback.value = false;
  } catch (error) {
    console.warn('Using fallback route data', error);
    applyFallback();
  }
});

watch(
  () => lang.value,
  () => {
    if (usingFallback.value) applyFallback();
  }
);

const filtered = computed(() =>
  routes.value.filter((item) =>
    matchesQuery(query.value, [
      String(item.title ?? ''),
      String(item.description ?? ''),
      String(item.start_location ?? ''),
      String(item.end_location ?? ''),
      String(item.notes ?? ''),
      ...(Array.isArray(item.waypoints) ? (item.waypoints as string[]) : []),
    ])
  )
);

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.warn('Failed to copy', error);
  }
};
</script>
