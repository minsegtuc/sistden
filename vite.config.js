import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    filename: 'pwa-sw.js',
    scope: '/',
    start_url: '/',
    workbox: {
      clientsClaim: true,
      skipWaiting: true,
      globIgnores: ['/ingreso/**', '**/*.js', '**/*.css', '**/*.html'],
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/ingreso/'),
          handler: 'NetworkOnly'
        },
        {
          urlPattern: /\/\/.*\.(js|css|html|png|jpg|jpeg|svg|ico)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-assets',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
        {
          urlPattern: /\/\/$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'html-pages',
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
      ]
    }
  })],
  base: '/'
})