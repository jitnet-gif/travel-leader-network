import { createClient } from '@supabase/supabase-js';

type SupabaseStub = {
  auth: {
    signInWithPassword: (args: Record<string, unknown>) => Promise<{ data: null; error: Error }>;
    signUp: (args: Record<string, unknown>) => Promise<{ data: null; error: Error }>;
    getUser: () => Promise<{ data: { user: null }; error: null }>;
    getSession: () => Promise<{ data: { session: null }; error: null }>;
  };
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File) => Promise<{ data: null; error: Error }>;
    };
  };
};

const createSupabaseStub = (): SupabaseStub => ({
  auth: {
    signInWithPassword: async () => ({
      data: null,
      error: new Error('Supabase is not configured. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY.')
    }),
    signUp: async () => ({
      data: null,
      error: new Error('Supabase is not configured. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY.')
    }),
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null })
  },
  storage: {
    from: () => ({
      upload: async () => ({
        data: null,
        error: new Error('Supabase is not configured. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY.')
      })
    })
  }
});

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseAnonKey = config.public.supabaseAnonKey;
  const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);

  if (!supabaseReady && process.dev) {
    console.warn('[supabase] Missing NUXT_PUBLIC_SUPABASE_URL or NUXT_PUBLIC_SUPABASE_ANON_KEY. Using stub client.');
  }

  const supabase = supabaseReady
    ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true } })
    : createSupabaseStub();

  return {
    provide: {
      supabase,
      supabaseReady
    }
  };
});
