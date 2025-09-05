import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

// Registra el Service Worker y maneja la actualización
registerSW({
  // Esta función se ejecuta cuando una nueva versión está lista para ser activada.
  onNeedRefresh() {
    console.log('Nueva versión de la app disponible. Recargando para actualizar...');
    window.location.reload(); // Esto fuerza un refresco de la página.
  },
  onOfflineReady() {
    console.log('App lista para trabajar offline');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
