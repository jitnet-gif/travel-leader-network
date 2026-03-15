<template>
  <Card>
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-black/50 dark:text-white/50">{{ cruise.cruise_line }}</p>
        <h3 class="text-lg font-display">{{ cruise.ship_name }}</h3>
        <p class="mt-1 text-sm text-black/60 dark:text-white/60">
          {{ t('cruise.capacity', { count: cruise.capacity }) }}
        </p>
      </div>
      <span class="rounded-full bg-sky/70 px-3 py-1 text-xs font-semibold text-black/70 dark:bg-slate-800 dark:text-white/70">
        {{ t('cruise.serviceCharge', { amount: cruise.service_charge }) }}
      </span>
    </div>
    <div class="mt-4 grid gap-2 text-sm text-black/70 dark:text-white/70">
      <div class="flex items-center justify-between">
        <span>{{ t('cruise.drinkPackage') }}</span>
        <span class="font-semibold">${{ cruise.drink_package }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>{{ t('cruise.wifi') }}</span>
        <span class="font-semibold">${{ cruise.wifi_price }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>{{ t('cruise.specialtyDining') }}</span>
        <span class="font-semibold">${{ cruise.specialty_dining }}</span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
type CruiseShip = {
  cruise_line: string;
  ship_name: string;
  capacity: number;
  service_charge: number;
  wifi_price: number;
  drink_package: number;
  specialty_dining: number;
};

defineProps<{ cruise: CruiseShip }>();

const { t } = useI18n();
</script>
