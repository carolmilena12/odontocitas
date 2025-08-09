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
      // Configuración básica
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Habilita PWA en desarrollo (opcional)
      },

      // Workbox: Solución para el error de tamaño de archivo
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json,woff2,ttf}', // Archivos a cachear
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50, // Máximo 50 imágenes en caché
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
        ],
      },

      
      manifest: {
        name: 'OdontoCitas',
        short_name: 'OdontoCitas',
        description: 'Aplicación de gestión de citas odontológicas',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      // Opcional: Precaché de archivos críticos
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
        'src/assets/**', // Incluye assets importantes
      ],
    }),
  ],
});
