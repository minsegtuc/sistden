import { ContextConfig } from '../context/ContextConfig';
import { useContext, useState } from 'react';

const Modulos = () => {

    const { user, serverlocal, HOST2, handleSession } = useContext(ContextConfig);

    const modulos = [
        { nombre: "admin", img: `/logo_admin_v2.svg`, imgHover: '/logo_admin_v2_blanco.svg', enlace: `${serverlocal}/admin/`, roles: ['SISADMIN'] },
        { nombre: "datos", img: `/carga_datos_logo.svg`, imgHover: '/carga_datos_logo_blanco.svg', enlace: `${serverlocal}/datos/`, roles: ['SISADMIN', 'MINISTERIO'] },
        { nombre: "ingreso", img: `/sgd_logo_negro.svg`, imgHover: '/sgd_logo_blanco.svg', enlace: `${serverlocal}/ingreso/`, roles: ['SISADMIN', 'MINISTERIO'] },
        { nombre: "mapa", img: `/logo_mapa_operativo_negro.svg`, imgHover: '/logo_mapa_operativo_blanco.svg', enlace: `${serverlocal}/mapa-operativo/`, roles: ['SISADMIN', 'MINISTERIO', 'VMAPA', 'CAMARAS'] },
        { nombre: "denuncias", img: `/sgd_logo_negro.svg`, imgHover: '/sgd_logo_blanco.svg', enlace: `${serverlocal}/sgd/`, roles: ['SISADMIN', 'MINISTERIO'] },
    ]

    const modulosPermitidos = modulos.filter(modulo =>
        modulo.roles.includes(user.rol)
    )

    const handleLogout = () => {
        fetch(`${HOST2}/auth/usuario/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(res => {
                if (res.status === 200) {
                    handleSession();
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='h-screen w-screen'>
            <div className='h-[10%] bg-[#005CA2] text-white flex justify-center items-center'>
                <h1 className='font-bold md:text-3xl text-center w-full ml-8'>SISTEMA DE CONTROL DE GESTIÓN</h1>
                <div className='flex-end ml-auto px-4'>
                    <button className='' onClick={handleLogout}>SALIR</button>
                </div>
            </div>
            <div className='h-[80%] grid md:grid-cols-2 items-center justify-items-center md:gap-4 gap-8 overflow-y-scroll'>
                {/* MODULOS SEGUN ROL */}
                {modulosPermitidos.map((modulo, index) => (
                    <div key={index} className='hover:bg-gray-600 transition-colors h-full w-full flex justify-center items-center group'>
                        <a href={modulo.enlace}>
                            <img
                                src={modulo.img}
                                alt=""
                                className='md:max-w-[350px] max-w-[150px] md:min-h-[150px] group-hover:hidden' // Se oculta en hover
                            />
                            <img
                                src={modulo.imgHover} // imagen para hover
                                alt=""
                                className='md:max-w-[350px] max-w-[150px] md:min-h-[150px] hidden group-hover:block' // Se muestra en hover
                            />
                        </a>
                    </div>
                ))}
            </div>
            <div className='h-[10%] bg-[#005CA2] justify-between items-center flex'>
                <div className='ml-8 flex flex-col'>
                    <p className='text-xs text-white'>Ministerio de Seguridad - Dirección de Control de Gestión</p>
                    <p className='text-xs text-white'>gestionminsegtuc@gmail.com</p>
                </div>
                <img src="/Minseg_white.png" alt="" className='h-[45px] w-auto cursor-none mr-8' />
            </div>
        </div>
    )
}

export default Modulos