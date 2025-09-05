import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
    onNeedRefresh() {
        // Muestra una notificación al usuario o un botón para refrescar
        if (confirm('Hay una nueva versión de la app. ¿Deseas recargar para actualizar?')) {
            updateSW(true); // Fuerza la actualización del SW y recarga la página
        }
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
