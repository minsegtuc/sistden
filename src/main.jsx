import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    try {
      await Promise.all(registrations.map((registration) => registration.unregister()));
      if (window.caches && caches.keys) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      if (!sessionStorage.getItem('reloadedAfterSWClear')) {
        sessionStorage.setItem('reloadedAfterSWClear', '1');
        window.location.reload();
      }
    } catch (e) {
      // swallow errors; aim is to force fresh load even if some steps fail
      if (!sessionStorage.getItem('reloadedAfterSWClear')) {
        sessionStorage.setItem('reloadedAfterSWClear', '1');
        window.location.reload();
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
