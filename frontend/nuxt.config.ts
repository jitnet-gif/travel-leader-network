export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', ...(process.env.RAILWAY_ENVIRONMENT ? [] : ['@vite-pwa/nuxt'])],
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
        { name: 'description', content: 'Professional platform for tour leaders and travel agencies.' },
        { name: 'theme-color', content: '#0ea5e9' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    workbox: {
      globPatterns: ['**/*.{js,css,woff2}'],
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: /^\/api\/airports(\?.*)?$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-airports',
            expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /^\/api\/countries(\?.*)?$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-countries',
            expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /^\/api\/cruise-ports(\?.*)?$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-cruise-ports',
            expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.+\.png$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'osm-tiles',
            expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    manifest: {
      name: 'Travel Leader Network',
      short_name: 'TLN',
      description: 'Professional platform for tour leaders and travel agencies.',
      theme_color: '#0ea5e9',
      background_color: '#0f172a',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    devOptions: { 
      enabled: process.env.NODE_ENV !== 'production',
      type: 'module'
    },
  },
});
