import Modulos from '../pages/Modulos'
import { ContextConfig } from '../context/ContextConfig';
import { useContext, useEffect, useState } from 'react';

const ModulosWrapper = () => {
    const { user, serverlocal } = useContext(ContextConfig);

    const modulos = [
        { nombre: "admin", enlace: `${serverlocal}/admin/`, roles: ['SISADMIN'] },
        { nombre: "datos", enlace: `${serverlocal}/datos/`, roles: ['SISADMIN', 'MINISTERIO'] },
        { nombre: "ingreso", enlace: `${serverlocal}/ingreso/estadisticas`, roles: ['SISADMIN', 'MINISTERIO', 'VINGRESO'] },
        { nombre: "mapa", enlace: `${serverlocal}/mapa-operativo/`, roles: ['SISADMIN', 'MINISTERIO', 'VMAPA', 'CAMARAS'] },
        { nombre: "denuncias", enlace: `${serverlocal}/sgd/`, roles: ['SISADMIN', 'MINISTERIO'] },
    ];

    const modulosPermitidos = modulos.filter(m => m.roles.includes(user.rol));

    if (modulosPermitidos.length === 1) {
        window.location.replace(modulosPermitidos[0].enlace);
        return null;
    }

    return <Modulos />;
};

export default ModulosWrapper;
