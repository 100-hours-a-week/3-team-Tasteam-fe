import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
const disablePwaByEnv = process.env.DISABLE_PWA === 'true'
const appEnv = process.env.VITE_APP_ENV
const isLocal = appEnv === 'local'
const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as {
  version?: string
}
const appVersion = process.env.VITE_APP_VERSION ?? packageJson.version ?? '0.0.0'

export default defineConfig(({ command }) => {
  const disablePwa = disablePwaByEnv || command === 'serve'

  return {
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
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-radix': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-aspect-ratio',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip',
            ],
            'vendor-charts': ['recharts'],
            'vendor-firebase': ['firebase/app', 'firebase/messaging'],
            'vendor-form': ['react-hook-form', '@hookform/resolvers'],
            'vendor-sentry': ['@sentry/react'],
            'vendor-utils': ['lucide-react', 'embla-carousel-react', 'react-day-picker'],
          },
        },
      },
    },
    server: {
      port: 3000,
    },
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
    },
  }
})
