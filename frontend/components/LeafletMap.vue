<template>
  <div ref="mapContainer" class="h-72 w-full rounded-2xl border border-black/10"></div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    center?: [number, number]; // [lng, lat]
    zoom?: number;
  }>(),
  {
    center: () => [139.734, 35.666],
    zoom: 9
  }
);

const mapContainer = ref<HTMLDivElement | null>(null);
let map: any = null;
let marker: any = null;

const toLeafletLatLng = (coords: [number, number]) => {
  const [lng, lat] = coords;
  return [lat, lng] as [number, number];
};

const initMap = async () => {
  if (!process.client || !mapContainer.value) return;
  const L = await import('leaflet');

  // Ensure default marker icons load correctly in Vite/Nuxt
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
  });

  const start = toLeafletLatLng(props.center);
  map = L.map(mapContainer.value).setView(start, props.zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  marker = L.marker(start).addTo(map);
  
  marker.on('click', () => {
    const [lat, lng] = start;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank', 'noopener');
  });
};

onMounted(initMap);

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
    marker = null;
  }
});

watch(
  () => [props.center, props.zoom],
  ([nextCenter, nextZoom]) => {
    if (!map || !nextCenter) return;
    const next = toLeafletLatLng(nextCenter as [number, number]);
    map.setView(next, nextZoom || map.getZoom());
    if (marker) marker.setLatLng(next);
  }
);
</script>
