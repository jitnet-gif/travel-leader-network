import { defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const base = config.public.apiBase || 'http://localhost:4000';
  const body = await readBody(event);

  try {
    return await $fetch('/api/leader-settings', {
      baseURL: base,
      method: 'POST',
      body
    });
  } catch (err: any) {
    console.error('[proxy] POST /api/leader-settings failed', err?.message || err);
    throw createError({
      statusCode: err?.response?.status || 500,
      statusMessage: err?.response?._data?.error || 'POST /api/leader-settings failed'
    });
  }
});
