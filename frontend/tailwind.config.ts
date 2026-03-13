import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      colors: {
        ink: 'var(--ink)',
        ocean: 'var(--ocean)',
        sand: 'var(--sand)',
        sky: 'var(--sky)',
        sun: 'var(--sun)',
        pine: 'var(--pine)',
        primary: '#13a4ec',
        'background-light': '#f6f7f8',
        'background-dark': '#101c22'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(16, 24, 37, 0.12)'
      }
    }
  },
  plugins: []
} satisfies Config;
