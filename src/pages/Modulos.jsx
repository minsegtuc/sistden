import { ContextConfig } from '../context/ContextConfig';
import { useContext, useEffect, useState } from 'react';

const Modulos = () => {

    const { user, serverlocal, HOST_AUTH, handleSession } = useContext(ContextConfig);
    const [activeModulo, setActiveModulo] = useState(null);

    const modulos = [
        { nombre: "admin", img: `/logo_admin_v2.png`, imgHover: '/logo_admin_v2_blanco.png', enlace: `${serverlocal}/admin/`, roles: ['SISADMIN'] },
        { nombre: "datos", img: `/carga_datos_logo.png`, imgHover: '/carga_datos_logo_blanco.png', enlace: `${serverlocal}/datos/`, roles: ['SISADMIN', 'ESTADISTICAS'] },
        { nombre: "ingreso", img: `/logo_ingreso_negro.png`, imgHover: '/logo_ingreso_blanco.png', enlace: `${serverlocal}/ingreso/estadisticas`, roles: ['SISADMIN', 'DENING','VINGRESO'] },
        { nombre: "mapa", img: `/logo_mapa_operativo_negro.svg`, imgHover: '/logo_mapa_operativo_blanco.svg', enlace: `${serverlocal}/mapa-operativo/`, roles: ['SISADMIN', 'ESTADISTICAS', 'VMAPA', 'CAMARAS','DENING','DENUNCIAS'] },
        { nombre: "denuncias", img: `/sgd_logo_negro.png`, imgHover: '/sgd_logo_blanco.png', enlace: `${serverlocal}/sgd/`, roles: ['SISADMIN','DENING','ESTADISTICAS','DENUNCIAS'] },
    ]

    const modulosPermitidos = modulos.filter(modulo =>
        modulo.roles.includes(user.rol)
    )

    const handleLogout = () => {
        fetch(`${HOST_AUTH}/auth/usuario/logout`, {
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

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                setActiveModulo(null);
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    return (
        <div className='h-screen w-screen '>
            <div className='min-h-[10%] max-h-[10%] bg-[#005CA2] text-white flex justify-center items-center'>
                <h1 className='font-bold md:text-3xl text-center w-full ml-8'>SISTEMA DE CONTROL DE GESTIÓN</h1>
                <div className='flex-end ml-auto px-4'>
                    <button className='' onClick={handleLogout}>SALIR</button>
                </div>
            </div>
            <div className='min-h-[80%] max-h-[80%] grid md:grid-cols-3 grid-cols-2 items-center justify-items-center md:gap-6 gap-8 overflow-y-scroll overflow-x-hidden py-4 px-4'>
                {/* MODULOS SEGUN ROL */}
                {modulosPermitidos.map((modulo, index) => {
                    const isActive = activeModulo === modulo.nombre;
                    return (
                        <div
                            key={index}
                            className="hover:bg-black/70 hover:shadow-2xl hover:shadow-[#005CA2]/30 shadow-md rounded-xl hover:scale-[1.02] transition-all duration-[350ms] md:h-full min-h-[150px] w-full flex justify-center items-center group"
                            onClick={() => setActiveModulo(modulo.nombre)}
                        >
                            <a href={modulo.enlace} className='flex justify-center items-center w-full h-full'>
                                {/* Si está activo -> siempre mostramos imgHover */}
                                {isActive ? (
                                    <img
                                        src={modulo.imgHover}
                                        alt={modulo.nombre}
                                        className="group max-w-[85%] md:max-w-[70%] object-contain block mx-auto py-2"
                                    />
                                ) : (
                                    <>
                                        {/* Imagen normal (visible por defecto, se oculta en hover) */}
                                        <img
                                            src={modulo.img}
                                            alt={modulo.nombre}
                                            className="group-hover:hidden max-w-[85%] md:max-w-[70%] object-contain block mx-auto py-2"
                                        />
                                        {/* Imagen hover (oculta por defecto, aparece en hover) */}
                                        <img
                                            src={modulo.imgHover}
                                            alt={modulo.nombre}
                                            className="hidden group-hover:block max-w-[85%] md:max-w-[70%] object-contain mx-auto py-2S"
                                        />
                                    </>
                                )}
                            </a>
                        </div>
                    );
                })}
            </div>
            <div className='min-h-[10%] max-h-[10%] bg-[#005CA2] justify-between items-center flex'>
                <div className='ml-8 flex flex-col'>
                    <p className='text-[8px] md:text-xs text-white'>Dirección de Control de Gestión</p>
                    <p className='text-[8px] md:text-xs text-white'>gestionminsegtuc@gmail.com</p>
                </div>
                <img src="/Minseg_white.png" alt="" className='h-[45px] w-auto cursor-none mr-8' />
            </div>
        </div>
    )
}

export default Modulos