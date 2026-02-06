import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
const disablePwa = process.env.DISABLE_PWA === 'true'
const appEnv = process.env.VITE_APP_ENV
const isLocal = appEnv === 'local'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      disable: disablePwa,
      minify: !isLocal,
      registerType: 'autoUpdate',
      workbox: {
        navigateFallbackDenylist: [/^\/api\//, /^\/admin/],
        skipWaiting: true,
        clientsClaim: true,
        ...(isLocal && { mode: 'development' as const }),
        runtimeCaching: [
          {
            urlPattern: /\.(png|jpg|jpeg|webp|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Tasteam',
        short_name: 'Tasteam',
        description: 'Tasteam frontend',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
})
