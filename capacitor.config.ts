import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'itmo.meet',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    url: 'http://185.178.47.42/',
    cleartext: true // Разрешить HTTP (без HTTPS)
  }
};

export default config;
