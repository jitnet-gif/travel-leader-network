import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'light' as 'light' | 'dark'
  }),
  actions: {
    init() {
      if (process.client) {
        const saved = localStorage.getItem('tln-theme');
        if (saved === 'dark' || saved === 'light') {
          this.mode = saved;
        }
        this.apply();
      }
    },
    toggle() {
      this.mode = this.mode === 'dark' ? 'light' : 'dark';
      if (process.client) {
        localStorage.setItem('tln-theme', this.mode);
        this.apply();
      }
    },
    apply() {
      if (!process.client) return;
      document.documentElement.classList.toggle('dark', this.mode === 'dark');
    }
  }
});
