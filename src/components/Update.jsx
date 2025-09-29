// src/PwaUpdater.jsx
import { useState, useEffect } from 'react';

export const usePwaUpdater = () => {
    const [showReload, setShowReload] = useState(false);
    const [reloadSW, setReloadSW] = useState(null);

    useEffect(() => {
        // PWA deshabilitado: no registramos service workers.
        setShowReload(false);
        setReloadSW(null);
    }, []);

    const update = () => {
        // Sin SW activo, no hay actualización que aplicar.
    };

    return { showReload, update };
};