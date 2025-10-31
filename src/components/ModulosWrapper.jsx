import Modulos from '../pages/Modulos'
import { ContextConfig } from '../context/ContextConfig';
import { useContext, useEffect, useState } from 'react';

const ModulosWrapper = () => {
    const { user, serverlocal } = useContext(ContextConfig);

    const modulos = [
        { nombre: "admin", img: `/logo_admin_v2.png`, imgHover: '/logo_admin_v2_blanco.png', enlace: `${serverlocal}/admin/`, roles: ['SISADMIN'] },
        { nombre: "datos", img: `/carga_datos_logo.png`, imgHover: '/carga_datos_logo_blanco.png', enlace: `${serverlocal}/modulos/`, roles: ['SISADMIN', 'ESTADISTICAS', 'MINISTERIO', 'CAMARAS'] },
        { nombre: "ingreso", img: `/logo_ingreso_negro.png`, imgHover: '/logo_ingreso_blanco.png', enlace: `${serverlocal}/ingreso/estadisticas`, roles: ['SISADMIN', 'DENING', 'VINGRESO', 'IESTADISTICAS'] },
        { nombre: "mapa", img: `/logo_mapa_operativo_negro.svg`, imgHover: '/logo_mapa_operativo_blanco.svg', enlace: `${serverlocal}/mapa-operativo/`, roles: ['SISADMIN', 'ESTADISTICAS', 'VMAPA', 'DENING', 'DENUNCIAS', 'MINISTERIO', 'POLICIA'] },
        { nombre: "denuncias", img: `/sgd_logo_negro.png`, imgHover: '/sgd_logo_blanco.png', enlace: `${serverlocal}/sgd/`, roles: ['SISADMIN', 'DENING', 'ESTADISTICAS', 'DENUNCIAS'] },
    ]

    const modulosCarga = [
        { nombre: "Homicidios", enlace: `${serverlocal}/mapa-operativo/homicidios`, roles: ['SISADMIN', 'ESTADISTICAS', 'MINISTERIO'], estado: "activo" },
        { nombre: "Combustible", enlace: `${serverlocal}/mapa-operativo/combustible`, roles: ['SISADMIN', 'ESTADISTICAS', 'MINISTERIO'], estado: "activo" },
        { nombre: "Cámaras", enlace: `${serverlocal}/mapa-operativo/911`, roles: ['SISADMIN', 'ESTADISTICAS', 'MINISTERIO', 'CAMARAS'], estado: "inactivo" },
        { nombre: "Lapacho (Proximamente)", enlace: `${serverlocal}/mapa-operativo/lapacho`, roles: ['SISADMIN', 'ESTADISTICAS', 'MINISTERIO'], estado: "inactivo" }
    ]

    const modulosPermitidos = modulos.filter(m => m.roles.includes(user.rol));
    const modulosCargaPermitidos = modulosCarga.filter(m => m.roles.includes(user.rol));

    if (modulosPermitidos.length === 1) {
        if (modulosPermitidos[0].nombre === "datos") {
            if (modulosCargaPermitidos.length === 1) {
                window.location.replace(modulosCargaPermitidos[0].enlace);
                return null;
            }else{
                return <Modulos />;
            }
        }else{
            window.location.replace(modulosPermitidos[0].enlace);
            return null;
        }
    }

    return <Modulos />;
};

export default ModulosWrapper;
