import { defineEventHandler, getQuery } from 'h3';
import localCountries from '../data/countries';

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event);
  const config = useRuntimeConfig(event);
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseAnonKey;

  let countries: any[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      countries = await $fetch<any[]>(`${supabaseUrl}/rest/v1/countries?select=*&limit=1000`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });
    } catch (e) {
      console.warn('[countries] Supabase fetch failed, falling back to local data:', e);
      countries = localCountries as unknown as any[];
    }
  } else {
    countries = localCountries as unknown as any[];
  }

  if (!q) return countries;
  const needle = String(q).toLowerCase();
  return countries.filter(c =>
    String(c.name || '').toLowerCase().includes(needle)
  );
});
