import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1d9de162365949c28c0122028859da7d',
  appName: 'saude-cidadao-ui',
  webDir: 'dist',
  server: {
    url: 'https://1d9de162-3659-49c2-8c01-22028859da7d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Share: {
      // Plugin configuration if needed
    }
  }
};

export default config;