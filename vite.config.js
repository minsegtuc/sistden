import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'pwa-sw.js',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      scope: '/',
      start_url: '/',
      manifest: {
        name: "Sistema de control de gestión",
        short_name: "SCG",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#005CA2",
        icons: [
          {
            src: "/img_logo.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/img_logo.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      // Desactiva completamente Workbox
      workbox: null,
      // Genera un SW en blanco, sin precache
      injectRegister: 'auto',
      strategies: 'injectManifest'
    })
  ],
  base: '/'
})
