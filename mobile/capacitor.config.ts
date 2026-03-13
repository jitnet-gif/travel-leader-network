import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.travel.leader.network',
  appName: 'Travel Leader Network',
  webDir: '../frontend/.output/public',
  bundledWebRuntime: false,
  server: {
    url: 'http://localhost:3000',
    cleartext: true
  }
};

export default config;
