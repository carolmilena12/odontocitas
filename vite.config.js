import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // ...tus otros aliases
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'OdontoCitas',
        short_name: 'MySite',
        description: 'Mi sitio web de odontologia',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#228be6',
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000, // Increase cache limit to 5MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      }
    }),
  ],
});
