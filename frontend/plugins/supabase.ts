import { createClient } from '@supabase/supabase-js';

type SupabaseStub = {
  auth: {
    signInWithPassword: (args: Record<string, unknown>) => Promise<{ data: null; error: Error }>;
    signUp: (args: Record<string, unknown>) => Promise<{ data: null; error: Error }>;
    signOut: () => Promise<{ error: null }>;
    getUser: () => Promise<{ data: { user: null }; error: null }>;
    getSession: () => Promise<{ data: { session: null }; error: null }>;
    onAuthStateChange: (cb: (event: string, session: null) => void) => { data: { subscription: { unsubscribe: () => void } } };
    exchangeCodeForSession: (code: string) => Promise<{ data: { session: null; user: null }; error: Error | null }>;
  };
  from: (table: string) => {
    select: (columns?: string) => any;
    insert: (values: any) => any;
    update: (values: any) => any;
    delete: () => any;
    upsert: (values: any) => any;
  };
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File) => Promise<{ data: null; error: Error }>;
    };
  };
};

const createSupabaseStub = (): SupabaseStub => {
  const errorObj = { data: null, error: new Error('Supabase is not configured. Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY.') };
  const chainable = {
    select: () => Promise.resolve(errorObj),
    insert: () => Promise.resolve(errorObj),
    update: () => Promise.resolve(errorObj),
    delete: () => Promise.resolve(errorObj),
    upsert: () => Promise.resolve(errorObj),
  };

  return {
    auth: {
      signInWithPassword: async () => errorObj,
      signUp: async () => errorObj,
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      exchangeCodeForSession: async () => ({ data: { session: null, user: null }, error: null })
    },
    from: () => chainable as any,
    storage: {
      from: () => ({
        upload: async () => errorObj
      })
    }
  };
};


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
