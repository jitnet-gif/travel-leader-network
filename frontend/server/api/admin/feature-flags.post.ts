// POST /api/admin/feature-flags
// Body: { key: string; enabled: boolean }
// Upserts a feature flag in Supabase

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const supabaseUrl = config.public.supabaseUrl as string;
  const supabaseKey = config.public.supabaseAnonKey as string;

  const body = await readBody<{ key: string; enabled: boolean }>(event);

  if (!body?.key || typeof body.enabled !== 'boolean') {
    throw createError({ statusCode: 400, message: 'key and enabled are required' });
  }

  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, message: 'Supabase not configured' });
  }

  await $fetch(`${supabaseUrl}/rest/v1/feature_flags`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: { key: body.key, enabled: body.enabled, updated_at: new Date().toISOString() },
  });

  return { ok: true };
});
