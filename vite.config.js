import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      base: '/sigs/',
      registerType: 'autoUpdate',
      manifest: {
        "name": "Sistema de gestión de denuncias",
        "short_name": "SGD",
        "start_url": "/sigs/",
        "display": "standalone",
        "background_color": "#000000",
        "theme_color": "#005CA2",
        "icons": [
          {
            "src": "/sigs/img_logo.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/sigs/img_logo.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    })
  ],
  base: '/sigs/',
  server: {
    host: '0.0.0.0',
  }
})
