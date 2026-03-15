<template>
  <div class="relative rounded-2xl border border-black/10 dark:border-white/10" style="overflow:visible">
    <div ref="mapContainer" class="h-72 w-full rounded-2xl" style="overflow:hidden" />

    <div class="absolute bottom-3 right-3 z-[1000] flex flex-col gap-1.5 items-end">
      <a
        :href="appDeepLink"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-black/10 dark:border-white/15 px-3 py-1.5 text-xs font-semibold shadow-md transition active:scale-95 hover:bg-white dark:hover:bg-slate-700"
      >📍 앱에서 보기</a>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-black/10 dark:border-white/15 px-3 py-1.5 text-xs font-semibold shadow-md transition active:scale-95 hover:bg-white dark:hover:bg-slate-700"
        @click="zoomIn"
      >🔍 확대</button>
    </div>

    <Transition name="hint-fade">
      <div v-if="showHint" class="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-[999] flex justify-center">
        <div class="rounded-xl bg-black/55 px-4 py-2 text-center text-xs leading-relaxed text-white backdrop-blur-sm">
          한 손가락으로 이동<br>두 손가락으로 확대/축소
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
type Facility = { name: string; lat: number; lng: number; icon: string; color: string; category?: string };

const props = withDefaults(defineProps<{
  center?: [number, number];
  zoom?: number;
  placeName?: string;
  openTime?: string;
  closeTime?: string;
  facilities?: Facility[];
  showMarker?: boolean;
}>(), {
  center: () => [139.734, 35.666],
  zoom: 13,
  placeName: '',
  openTime: '',
  closeTime: '',
  facilities: () => [],
  showMarker: true,
});

const mapContainer = ref<HTMLDivElement | null>(null);
const showHint = ref(false);

let L: any = null;
let map: any = null;
let mainMarker: any = null;
let facilityMarkers: any[] = [];
let hintTimer: ReturnType<typeof setTimeout> | null = null;
let resizeObserver: ResizeObserver | null = null;

// Leaflet uses [lat, lng]; our props use [lng, lat]
const toLL = (c: [number, number]): [number, number] => [c[1], c[0]];

const appDeepLink = computed(() => {
  if (props.placeName) return `https://maps.google.com/?q=${encodeURIComponent(props.placeName)}`;
  const [lat, lng] = toLL(props.center);
  return `https://maps.google.com/?q=${lat},${lng}&z=15`;
});

const googleMapsUrl = (lat: number, lng: number) =>
  props.placeName
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.placeName)}`
    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

const zoomIn = () => { if (map) map.setZoom(map.getZoom() + 2); };

// ── Tooltip label: name + hours
const tooltipHtml = (name: string, openTime: string, closeTime: string) => {
  const is24h = openTime === '00:00' && closeTime === '24:00';
  const timeStr = is24h
    ? '🕐 24시간 운영'
    : openTime && closeTime
      ? `🕐 ${openTime} – ${closeTime}`
      : '';
  return `<div style="text-align:center;line-height:1.4">
    <div style="font-weight:700;font-size:12px;white-space:nowrap">${name}</div>
    ${timeStr ? `<div style="font-size:10px;color:#555;margin-top:2px">${timeStr}</div>` : ''}
  </div>`;
};


const makeFacilityIcon = (emoji: string, color: string) => L.divIcon({
  className: '',
  iconSize:    [28, 28],
  iconAnchor:  [14, 14],
  popupAnchor: [0, -16],
  html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${emoji}</div>`,
});

const addFacilities = (facilities: Facility[], name: string) => {
  facilityMarkers.forEach(m => m.remove());
  facilityMarkers = [];
  if (!facilities?.length || !L) return;
  facilities.forEach(f => {
    const fm = L.marker([f.lat, f.lng], { icon: makeFacilityIcon(f.icon, f.color) })
      .addTo(map)
      .bindTooltip(`<b style="font-size:12px">${f.icon} ${f.name}</b>`, {
        permanent: true,
        direction: 'top',
        offset: [0, -16],
        className: 'facility-tooltip',
      })
      .bindPopup(`<b style="font-size:13px">${f.icon} ${f.name}</b>`, { closeButton: false, offset: [0, -14] });
    fm.on('click', () =>
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${f.name} ${name}`)}`, '_blank', 'noopener')
    );
    facilityMarkers.push(fm);
  });
};

const initMap = async () => {
  if (!process.client || !mapContainer.value) return;
  try {
    const mod = await import('leaflet');
    L = mod.default ?? mod;

    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl:       new URL('leaflet/dist/images/marker-icon.png',    import.meta.url).href,
      iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
      shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png',  import.meta.url).href,
    });

    const ll = toLL(props.center);

    map = L.map(mapContainer.value, {
      dragging: true, touchZoom: true, doubleClickZoom: true,
      scrollWheelZoom: false, tap: false, zoomControl: false,
    }).setView(ll, props.zoom);

    await nextTick();
    map.invalidateSize();

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    if (props.showMarker) {
      mainMarker = L.marker(ll)
        .addTo(map)
        .bindTooltip(tooltipHtml(props.placeName, props.openTime, props.closeTime), {
          permanent: true,
          direction: 'top',
          offset: [0, -42],
          className: 'tln-tooltip',
        });

      mainMarker.openTooltip();

      mainMarker.on('click', () =>
        window.open(googleMapsUrl(ll[0], ll[1]), '_blank', 'noopener')
      );
    }

    // ResizeObserver: re-layout whenever the container size changes (modal transition, tab switch, etc.)
    resizeObserver = new ResizeObserver(() => {
      if (map) {
        map.invalidateSize();
        mainMarker?.openTooltip();
      }
    });
    resizeObserver.observe(mapContainer.value!);

    addFacilities(props.facilities, props.placeName);

    map.on('touchstart', () => {
      if (showHint.value) return;
      showHint.value = true;
      if (hintTimer) clearTimeout(hintTimer);
      hintTimer = setTimeout(() => { showHint.value = false; }, 2000);
    });
  } catch (e) {
    console.error('[LeafletMap] init failed:', e);
  }
};

onMounted(initMap);

onBeforeUnmount(() => {
  if (hintTimer) clearTimeout(hintTimer);
  resizeObserver?.disconnect();
  facilityMarkers.forEach(m => m.remove());
  if (map) { map.remove(); map = null; mainMarker = null; }
});

watch(
  () => [props.center, props.zoom, props.placeName, props.openTime, props.closeTime, props.facilities] as const,
  async ([c, z, name, openTime, closeTime, facilities]) => {
    if (!map || !L || !c) return;
    const ll = toLL(c as [number, number]);
    map.setView(ll, z ?? map.getZoom());
    await nextTick();
    map.invalidateSize();
    if (mainMarker) {
      mainMarker.setLatLng(ll);
      mainMarker.getTooltip()?.setContent(tooltipHtml(name as string, openTime as string, closeTime as string));
      mainMarker.openTooltip();
    }
    addFacilities(facilities as Facility[], name as string);
  },
  { deep: true }
);
</script>

<style>
/* Leaflet tooltip custom style — not scoped so Leaflet can apply it */
.tln-tooltip {
  background: rgba(15, 23, 42, 0.88) !important;
  border: none !important;
  border-radius: 8px !important;
  color: #fff !important;
  padding: 5px 10px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
  backdrop-filter: blur(4px);
}
.tln-tooltip::before {
  border-top-color: rgba(15, 23, 42, 0.88) !important;
}
.facility-tooltip {
  background: rgba(15, 23, 42, 0.85) !important;
  border: none !important;
  border-radius: 6px !important;
  color: #fff !important;
  padding: 3px 8px !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25) !important;
}
.facility-tooltip::before {
  border-top-color: rgba(15, 23, 42, 0.85) !important;
}
</style>

<style scoped>
.hint-fade-enter-active, .hint-fade-leave-active { transition: opacity 0.4s; }
.hint-fade-enter-from, .hint-fade-leave-to { opacity: 0; }
</style>
