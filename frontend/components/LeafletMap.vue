<template>
  <div class="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">

    <!-- Map -->
    <div ref="mapContainer" class="h-72 w-full touch-pan-y"></div>

    <!-- "앱에서 보기" + "확대" buttons -->
    <div class="absolute bottom-3 right-3 z-[1000] flex flex-col gap-1.5 items-end">
      <a
        :href="appDeepLink"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-black/10 dark:border-white/15 px-3 py-1.5 text-xs font-semibold shadow-md transition active:scale-95 hover:bg-white dark:hover:bg-slate-700"
      >
        📍 앱에서 보기
      </a>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-black/10 dark:border-white/15 px-3 py-1.5 text-xs font-semibold shadow-md transition active:scale-95 hover:bg-white dark:hover:bg-slate-700"
        @click="zoomIn"
      >
        🔍 확대
      </button>
    </div>

    <!-- Touch hint (fades away after 2 s) -->
    <Transition name="hint-fade">
      <div
        v-if="showHint"
        class="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-[999] flex justify-center"
      >
        <div class="rounded-xl bg-black/55 px-4 py-2 text-center text-xs leading-relaxed text-white backdrop-blur-sm">
          한 손가락으로 이동<br>두 손가락으로 확대/축소
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    center?: [number, number]; // [lng, lat]
    zoom?: number;
    placeName?: string;        // fallback label & URL if coords imprecise
  }>(),
  {
    center: () => [139.734, 35.666],
    zoom: 13,
    placeName: ''
  }
);

const mapContainer = ref<HTMLDivElement | null>(null);
const showHint = ref(false);

let map: any = null;
let marker: any = null;
let hintTimer: ReturnType<typeof setTimeout> | null = null;

// [lng, lat] → [lat, lng] for Leaflet
const toLL = (c: [number, number]): [number, number] => [c[1], c[0]];

// Google Maps deep link — name preferred for correct place recognition
const appDeepLink = computed(() => {
  if (props.placeName) {
    return `https://maps.google.com/?q=${encodeURIComponent(props.placeName)}`;
  }
  const ll = toLL(props.center);
  const [lat, lng] = ll;
  return `https://maps.google.com/?q=${lat},${lng}&z=17`;
});

const zoomIn = () => {
  if (map) map.setZoom(map.getZoom() + 2);
};

// Marker click: name-based URL so Google Maps shows the correct named place
const buildGoogleMapsUrl = (lat: number, lng: number) => {
  if (props.placeName) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.placeName)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

const initMap = async () => {
  if (!process.client || !mapContainer.value) return;
  const L = await import('leaflet');

  // Fix default marker icons in Vite/Nuxt
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl:       new URL('leaflet/dist/images/marker-icon.png',    import.meta.url).href,
    shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png',  import.meta.url).href
  });

  const start = toLL(props.center);

  map = L.map(mapContainer.value, {
    // ── Touch / gesture controls ──────────────────────────
    dragging:         true,   // one-finger pan
    touchZoom:        true,   // two-finger pinch zoom
    doubleClickZoom:  true,
    scrollWheelZoom:  false,  // disable scroll-wheel on desktop (avoids page-scroll conflict)
    tap:              false,  // disable tap plugin (causes ghost-click on iOS)
    // ─────────────────────────────────────────────────────
    zoomControl:      false,  // we add it bottom-left manually
  }).setView(start, props.zoom);

  // Zoom control — bottom left so it doesn't overlap our buttons
  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  // Tile layer with place names (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // Marker with place-name popup
  const popupHtml = props.placeName
    ? `<div style="font-weight:600;font-size:13px;line-height:1.4">${props.placeName}</div>
       <div style="font-size:11px;color:#555;margin-top:2px">${start[0].toFixed(4)}, ${start[1].toFixed(4)}</div>`
    : `<div style="font-size:12px;color:#555">${start[0].toFixed(4)}, ${start[1].toFixed(4)}</div>`;

  marker = L.marker(start)
    .addTo(map)
    .bindPopup(popupHtml, { closeButton: false, offset: [0, -28] })
    .openPopup();

  // Clicking marker → Google Maps
  marker.on('click', () => {
    window.open(buildGoogleMapsUrl(start[0], start[1]), '_blank', 'noopener');
  });

  // Clicking map → Google Maps (at clicked point)
  map.on('click', (e: any) => {
    window.open(buildGoogleMapsUrl(e.latlng.lat, e.latlng.lng), '_blank', 'noopener');
  });

  // Show hint briefly on first touch
  map.on('touchstart', () => {
    if (showHint.value) return;
    showHint.value = true;
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(() => { showHint.value = false; }, 2000);
  });
};

onMounted(initMap);

onBeforeUnmount(() => {
  if (hintTimer) clearTimeout(hintTimer);
  if (map) { map.remove(); map = null; marker = null; }
});

watch(
  () => [props.center, props.zoom, props.placeName] as const,
  ([nextCenter, nextZoom, nextName]) => {
    if (!map || !nextCenter) return;
    const ll = toLL(nextCenter as [number, number]);
    map.setView(ll, nextZoom ?? map.getZoom());
    if (marker) {
      marker.setLatLng(ll);
      const html = nextName
        ? `<div style="font-weight:600;font-size:13px;line-height:1.4">${nextName}</div>
           <div style="font-size:11px;color:#555;margin-top:2px">${ll[0].toFixed(4)}, ${ll[1].toFixed(4)}</div>`
        : `<div style="font-size:12px;color:#555">${ll[0].toFixed(4)}, ${ll[1].toFixed(4)}</div>`;
      marker.getPopup()?.setContent(html);
      marker.openPopup();
    }
  }
);
</script>

<style scoped>
.hint-fade-enter-active,
.hint-fade-leave-active { transition: opacity 0.4s ease; }
.hint-fade-enter-from,
.hint-fade-leave-to    { opacity: 0; }
</style>
