import type { Airport } from '~/types/airport';
import type { GpsStatus } from '~/types/gps';

export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Singleton module-level state (shared across all consumers) ────────────────
const position = ref<{ lat: number; lng: number } | null>(null);
const status   = ref<GpsStatus>('idle');
const error    = ref<string | null>(null);
let watchId: number | null = null;
let refCount = 0;

export function useGeolocation() {
  const start = () => {
    if (!process.client) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      status.value = 'unsupported';
      return;
    }
    refCount++;
    if (watchId !== null) return; // already watching
    status.value = 'checking';
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        position.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        status.value = 'ok';
        error.value = null;
      },
      (err) => {
        status.value = err.code === err.PERMISSION_DENIED ? 'denied' : 'error';
        error.value = err.message;
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 10_000 },
    );
  };

  const stop = () => {
    refCount = Math.max(0, refCount - 1);
    if (refCount === 0 && watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      status.value = 'idle';
    }
  };

  const nearestAirport = (airports: Airport[]) =>
    computed(() => {
      if (!position.value) return null;
      const { lat, lng } = position.value;
      let best: Airport | null = null;
      let bestDist = Infinity;
      for (const a of airports) {
        if (a.lat == null || a.lng == null) continue;
        const d = haversineMeters(lat, lng, a.lat, a.lng);
        if (d < bestDist) { bestDist = d; best = a; }
      }
      return best;
    });

  const distanceM = (airport: Airport) =>
    computed(() => {
      if (!position.value || airport.lat == null || airport.lng == null) return null;
      return haversineMeters(position.value.lat, position.value.lng, airport.lat, airport.lng);
    });

  return { position, status, error, start, stop, nearestAirport, distanceM };
}
