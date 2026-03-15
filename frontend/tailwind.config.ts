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
        display: ['Outfit', 'Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      colors: {
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0f172a', // Deep Navy
        },
        ivory: '#F8FAFC',
        ink: 'var(--ink)',
        primary: '#0ea5e9',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(16, 24, 37, 0.08)',
        premium: '0 10px 30px -10px rgba(15, 23, 42, 0.05), 0 4px 10px -5px rgba(15, 23, 42, 0.02)',
        glow: '0 0 20px rgba(56, 189, 248, 0.15)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: []
} satisfies Config;
