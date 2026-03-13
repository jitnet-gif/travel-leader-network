import { defineEventHandler, getQuery } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const base = config.public.apiBase || 'http://localhost:4000';
  const query = getQuery(event);

  const url = new URL('/api/audio-pois', base);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });

  try {
    return await $fetch(url.toString());
  } catch (err: any) {
    console.error('[proxy] /api/audio-pois failed', err?.message || err);
    return [];
  }
});
