self.addEventListener('install', (event) => {
    // Instalación del SW
    console.log('Service Worker instalado');
});

self.addEventListener('activate', (event) => {
    // Activación del SW
    console.log('Service Worker activado');
});

// No hay listeners de fetch → nunca intercepta las requests
