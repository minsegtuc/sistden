import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    filename: 'pwa-sw.js',
    scope: '/',
    manifest: {
      "name": "Sistema de control de gestión",
      "short_name": "SCG",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#000000",
      "theme_color": "#005CA2",
      "icons": [{
        "src": "/img_logo.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/img_logo.png",
        "sizes": "512x512",
        "type": "image/png"
      }]
    },
    workbox: {
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{
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