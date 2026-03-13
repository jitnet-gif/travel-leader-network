import type { Config } from 'tailwindcss';

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Public Sans', 'system-ui', 'sans-serif']
      },
      colors: {
        graphite: '#121826',
        slate: '#263142',
        frost: '#f3f5f9',
        accent: '#2f5e4e'
      }
    }
  },
  plugins: []
} satisfies Config;
