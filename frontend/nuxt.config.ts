export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/tailwind.css', 'leaflet/dist/leaflet.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  nitro: {
    compatibilityDate: '2026-03-12',
    preset: 'cloudflare-pages'
  },
  runtimeConfig: {
    aerodataboxKey: process.env.AERODATABOX_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''
    }
  },
  app: {
    head: {
      title: 'Travel Leader Network',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Professional platform for tour leaders and travel agencies.' }
      ]
    }
  }
});
