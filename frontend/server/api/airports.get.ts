import { defineEventHandler, getQuery } from 'h3';
import localAirports from '../data/airports';

// Build a lat/lng lookup from local data
const latLngMap = new Map<string, { lat: number; lng: number }>(
  (localAirports as unknown as any[])
    .filter(a => a.lat != null && a.lng != null)
    .map(a => [a.iata, { lat: a.lat, lng: a.lng }])
);

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event);
  const config = useRuntimeConfig(event);
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseAnonKey;

  let airports: any[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const data = await $fetch<any[]>(`${supabaseUrl}/rest/v1/airports?select=*&limit=1000`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
      // Merge lat/lng from local data
      airports = data.map(a => ({
        ...a,
        ...(latLngMap.get(a.iata) ?? {}),
      }));
    } catch (e) {
      console.warn('[airports] Supabase fetch failed, falling back to local data:', e);
      airports = localAirports as unknown as any[];
    }
  } else {
    airports = localAirports as unknown as any[];
  }

  if (!q) return airports;
  const needle = String(q).toLowerCase();
  return airports.filter(a =>
    ['name', 'iata', 'city', 'country'].some(k =>
      String(a[k] || '').toLowerCase().includes(needle)
    )
  );
});
