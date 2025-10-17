import Modulos from '../pages/Modulos'
import { ContextConfig } from '../context/ContextConfig';
import { useContext, useEffect, useState } from 'react';

const ModulosWrapper = () => {
    const { user, serverlocal } = useContext(ContextConfig);

    const modulos = [
        { nombre: "admin", img: `/logo_admin_v2.png`, imgHover: '/logo_admin_v2_blanco.png', enlace: `${serverlocal}/admin/`, roles: ['SISADMIN'] },
        { nombre: "datos", img: `/carga_datos_logo.png`, imgHover: '/carga_datos_logo_blanco.png', enlace: `${serverlocal}/mapa-operativo/homicidios`, roles: ['SISADMIN', 'ESTADISTICAS','MINISTERIO'] },
        { nombre: "ingreso", img: `/logo_ingreso_negro.png`, imgHover: '/logo_ingreso_blanco.png', enlace: `${serverlocal}/ingreso/estadisticas`, roles: ['SISADMIN', 'DENING','VINGRESO','IESTADISTICAS'] },
        { nombre: "mapa", img: `/logo_mapa_operativo_negro.svg`, imgHover: '/logo_mapa_operativo_blanco.svg', enlace: `${serverlocal}/mapa-operativo/`, roles: ['SISADMIN', 'ESTADISTICAS', 'VMAPA', 'CAMARAS','DENING','DENUNCIAS','MINISTERIO'] },
        { nombre: "denuncias", img: `/sgd_logo_negro.png`, imgHover: '/sgd_logo_blanco.png', enlace: `${serverlocal}/sgd/`, roles: ['SISADMIN','DENING','ESTADISTICAS','DENUNCIAS'] },
    ]

    const modulosPermitidos = modulos.filter(m => m.roles.includes(user.rol));

    if (modulosPermitidos.length === 1) {
        window.location.replace(modulosPermitidos[0].enlace);
        return null;
    }

    return <Modulos />;
};

export default ModulosWrapper;
