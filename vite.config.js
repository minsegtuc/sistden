import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      base: '/sgd/',
      registerType: 'autoUpdate',
      manifest: {
        "name": "Sistema de gestión de denuncias",
        "short_name": "SGD",
        "start_url": "/sgd/",
        "display": "standalone",
        "background_color": "#000000",
        "theme_color": "#005CA2",
        "icons": [
          {
            "src": "/sgd/img_logo.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/sgd/img_logo.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /\/sgd\/.*\.(js|css|html|png|jpg|jpeg|svg|ico)$/,
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
            urlPattern: /\/sgd\/$/,
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
    })
  ],
  base: '/sgd/',
  // server: {
  //   host: '0.0.0.0',
  // }
})
