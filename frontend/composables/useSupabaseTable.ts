export const useSupabaseTable = <T extends Record<string, unknown>>(table: string, fallback: T[]) => {
  const { $supabase, $supabaseReady } = useNuxtApp();
  const config = useRuntimeConfig();
  const data = ref<T[]>(fallback);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const apiPaths: Record<string, string> = {
    airports: '/api/airports',
    cruise_lines: '/api/cruise-lines',
    cruise_ports: '/api/cruise-ports',
    cruise_ships: '/api/cruise-ships',
    countries: '/api/countries',
    embassies: '/api/embassies',
    community_posts: '/api/community-posts',
    tour_jobs: '/api/jobs',
    route_briefs: '/api/route-briefs'
  };

  const load = async () => {
    if (!$supabaseReady) {
      const path = apiPaths[table];
      if (!path) return;
      try {
        const base = config.public.apiBase || 'http://localhost:4000';
        const rows = await $fetch<T[]>(`${base}${path}`);
        if (rows) data.value = rows;
      } catch (err: any) {
        error.value = err?.message || 'Failed to load data';
      }
      return;
    }
    loading.value = true;
    const { data: rows, error: supabaseError } = await $supabase.from(table).select('*');
    if (supabaseError) {
      error.value = supabaseError.message;
    } else if (rows) {
      data.value = rows as T[];
    }
    loading.value = false;
  };

  onMounted(load);

  return { data, loading, error, reload: load };
};
