<template>
  <div ref="mapContainer" class="h-72 w-full rounded-2xl border border-black/10"></div>
</template>

<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    center?: [number, number];
    zoom?: number;
  }>(),
  {
    center: () => [139.734, 35.666],
    zoom: 9
  }
);

const mapContainer = ref<HTMLDivElement | null>(null);
let map: any = null;

onMounted(() => {
  const config = useRuntimeConfig();
  if (!mapContainer.value || !config.public.mapboxToken) {
    return;
  }
  import('mapbox-gl')
    .then((module) => {
      const mapboxgl = module.default;
      mapboxgl.accessToken = config.public.mapboxToken as string;
      map = new mapboxgl.Map({
        container: mapContainer.value as HTMLElement,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: props.center,
        zoom: props.zoom
      });
      const marker = new mapboxgl.Marker().setLngLat(props.center).addTo(map);
      
      marker.getElement().style.cursor = 'pointer';
      marker.getElement().addEventListener('click', () => {
        const [lng, lat] = props.center;
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank', 'noopener');
      });
    })
    .catch((error) => {
      console.warn('Mapbox failed to load', error);
    });
});

onBeforeUnmount(() => {
  map?.remove();
});
</script>
