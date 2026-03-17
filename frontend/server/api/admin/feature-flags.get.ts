// GET /api/admin/feature-flags
// Returns all feature flags from Supabase

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const supabaseUrl = config.public.supabaseUrl as string;
  const supabaseKey = config.public.supabaseAnonKey as string;

  const defaultFlags: Record<string, boolean> = {
    'nav.dashboard':   true,
    'nav.countries':   true,
    'nav.airports':    true,
    'nav.cruiseLines': true,
    'nav.cruisePorts': true,
    'nav.audioGuide':  true,
    'nav.jobs':        true,
    'nav.community':   true,
    'nav.leaderTools': true,
    'nav.education':   true,
    'nav.emergency':   true,
    'nav.routes':      true,
  };

  if (!supabaseUrl || !supabaseKey) return defaultFlags;

  try {
    const rows = await $fetch<{ key: string; enabled: boolean }[]>(
      `${supabaseUrl}/rest/v1/feature_flags?select=key,enabled`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const flags = { ...defaultFlags };
    for (const row of rows) flags[row.key] = row.enabled;
    return flags;
  } catch {
    return defaultFlags;
  }
});
