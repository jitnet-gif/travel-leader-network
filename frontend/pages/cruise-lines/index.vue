<template>
  <div class="space-y-8">
    <SectionHeader :eyebrow="t('cruise.eyebrow')" :title="t('cruise.title')" :subtitle="t('cruise.subtitle')" />

    <div class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <h3 class="text-lg font-display">{{ t('cruise.lineDirectoryTitle') }}</h3>
        <div class="mt-4 space-y-3 text-sm text-black/70 dark:text-white/70">
          <div v-for="line in cruiseLines" :key="line.name" class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold">{{ line.name }}</p>
              <p class="text-xs text-black/50 dark:text-white/50">{{ t('cruise.hqLabel') }}: {{ line.country }}</p>
            </div>
            <Tag>{{ t('cruise.activeTag') }}</Tag>
          </div>
        </div>
      </Card>
      <Card>
        <h3 class="text-lg font-display">{{ t('cruise.costSnapshotTitle') }}</h3>
        <p class="mt-2 text-sm text-black/60 dark:text-white/60">
          {{ t('cruise.costSnapshotBody') }}
        </p>
        <div class="mt-4 grid gap-3 text-sm text-black/70 dark:text-white/70">
          <div class="flex items-center justify-between">
            <span>{{ t('cruise.costLabels.serviceRange') }}</span>
            <span class="font-semibold">$16 - $20</span>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('cruise.costLabels.drinkRange') }}</span>
            <span class="font-semibold">$75 - $85</span>
          </div>
          <div class="flex items-center justify-between">
            <span>{{ t('cruise.costLabels.wifiRange') }}</span>
            <span class="font-semibold">$18 - $20</span>
          </div>
        </div>
      </Card>
    </div>

    <section>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-lg font-display">{{ t('cruise.featuredTitle') }}</h3>
          <p class="text-sm text-black/60 dark:text-white/60">{{ t('cruise.featuredSubtitle') }}</p>
        </div>
        <BaseButton variant="outline" to="/cruise-ports">{{ t('cruise.viewPorts') }}</BaseButton>
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <CruiseCard v-for="ship in cruiseShips" :key="ship.ship" :cruise="ship" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type CruiseLine = {
  name: string;
  country: string;
};

type CruiseShip = {
  cruise_line: string;
  ship: string;
  capacity: number;
  service_charge: number;
  wifi_price: number;
  drink_package: number;
  specialty_dining: number;
};

const { t, lang } = useI18n();

const fallbackLines = computed<CruiseLine[]>(() =>
  lang.value === 'ko'
    ? [
        { name: '로열 캐리비안', country: '미국' },
        { name: 'MSC 크루즈', country: '스위스' }
      ]
    : [
        { name: 'Royal Caribbean', country: 'United States' },
        { name: 'MSC Cruises', country: 'Switzerland' }
      ]
);

const fallbackShips = computed<CruiseShip[]>(() =>
  lang.value === 'ko'
    ? [
        {
          cruise_line: '로열 캐리비안',
          ship: '원더 오브 더 씨즈',
          capacity: 6988,
          service_charge: 18,
          wifi_price: 20,
          drink_package: 85,
          specialty_dining: 60
        },
        {
          cruise_line: 'MSC 크루즈',
          ship: 'MSC 월드 유로파',
          capacity: 6762,
          service_charge: 16,
          wifi_price: 18,
          drink_package: 75,
          specialty_dining: 50
        }
      ]
    : [
        {
          cruise_line: 'Royal Caribbean',
          ship: 'Wonder of the Seas',
          capacity: 6988,
          service_charge: 18,
          wifi_price: 20,
          drink_package: 85,
          specialty_dining: 60
        },
        {
          cruise_line: 'MSC Cruises',
          ship: 'MSC World Europa',
          capacity: 6762,
          service_charge: 16,
          wifi_price: 18,
          drink_package: 75,
          specialty_dining: 50
        }
      ]
);

const { data: cruiseLines } = useSupabaseI18nTable<CruiseLine>({
  table: 'cruise_lines',
  i18nTable: 'cruise_lines_i18n',
  fields: ['name', 'country'],
  fallback: fallbackLines
});

const { data: cruiseShips } = useSupabaseI18nTable<CruiseShip>({
  table: 'cruise_ships',
  i18nTable: 'cruise_ships_i18n',
  fields: ['cruise_line', 'ship'],
  fallback: fallbackShips
});
</script>
