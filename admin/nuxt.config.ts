export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  },
  app: {
    head: {
      title: 'Travel Leader Network Admin',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
});
