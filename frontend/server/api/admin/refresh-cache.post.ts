// POST /api/admin/refresh-cache
// Called by admin UI or an external cron service at 3am KST (18:00 UTC)
// Refreshes immigration + culture cache for all countries in the database

export default defineEventHandler(async (event): Promise<{ ok: boolean; refreshed: string[]; errors: string[] }> => {
  const config = useRuntimeConfig(event);
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseAnonKey;

  if (!supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, message: 'Supabase not configured' });
  }

  // Fetch all countries from Supabase
  const countries = await $fetch<{ name: string }[]>(`${supabaseUrl}/rest/v1/countries?select=name&limit=1000`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
  });

  const host = getRequestHeader(event, 'host') ?? 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const refreshed: string[] = [];
  const errors: string[] = [];

  // Refresh immigration + culture cache for each country (sequentially to avoid rate limits)
  for (const { name } of countries) {
    try {
      await $fetch(`${baseUrl}/api/immigration/${encodeURIComponent(name)}`, { method: 'GET' });
      refreshed.push(`immigration:${name}`);
    } catch (e) {
      errors.push(`immigration:${name}`);
    }

    try {
      await $fetch(`${baseUrl}/api/culture/${encodeURIComponent(name)}`, { method: 'GET' });
      refreshed.push(`culture:${name}`);
    } catch (e) {
      errors.push(`culture:${name}`);
    }
  }

  return { ok: true, refreshed, errors };
});
