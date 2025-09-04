import { useEffect, useState, useContext } from 'react'
import { BsHouse, BsFolderPlus, BsBoxArrowRight, BsListUl, BsPinMapFill, BsMap, BsBarChartLine, BsShieldLock, BsPerson, BsPersonCircle } from "react-icons/bs";
import { MdOutlineArrowDropDown, MdOutlineArrowRight, MdChecklistRtl } from "react-icons/md";
import { MdOutlineViewModule } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { NavLink, useNavigate } from 'react-router-dom';
import { ContextConfig } from '../context/ContextConfig';

const Aside = ({ open }) => {

    const [openDenuncias, setOpenDenuncias] = useState(false)
    const [openGeolocalizacion, setOpenGeolocalizacion] = useState(false)
    const [openEstadisticas, setOpenEstadisticas] = useState(false)
    const [openConfiguracion, setOpenConfiguracion] = useState(false)

    const { user, handleSession, HOST, HOST2, socket, denuncia } = useContext(ContextConfig);

    // console.log("Usuario en aside: ", user)

    const handleOpenClose = (item) => {
        switch (item) {
            case 'denuncias':
                setOpenDenuncias(!openDenuncias)
                break;
            case 'geolocalizacion':
                setOpenGeolocalizacion(!openGeolocalizacion)
                break;
            case 'estadisticas':
                setOpenEstadisticas(!openEstadisticas)
                break;
            case 'configuracion':
                setOpenConfiguracion(!openConfiguracion)
                break;
            default:
                break;
        }
    }

    const handleLogout = () => {
        const denunciaActualizar = decodeURIComponent(denuncia)
        socket.emit('leave_denuncia', { denunciaId: denunciaActualizar });
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

    useEffect(() => {
        if (!open) {
            setOpenDenuncias(false)
            setOpenGeolocalizacion(false)
            setOpenEstadisticas(false)
            setOpenConfiguracion(false)
        }
    }, [open])

    return (
        <aside className={`bg-[#005CA2] lg:h-heightfull transition-all duration-300 delay-100 flex flex-col ${open ? 'lg:w-1/6 max-h-screen' : 'max-h-0 lg:max-h-screen lg:w-0 lg:overflow-hidden -z-50'}`}>
            <div className={`text-white flex flex-row items-center justify-around pt-2 pb-2 border-b-2 border-blue-300 w-full transition-opacity duration-300 ease-in-out ${open ? 'opacity-100' : `opacity-0`}`}>
                <div className='flex lg:flex-col flex-row justify-center items-center gap-2 lg:gap-0'>
                    {
                        user.foto ? (<img src={user.foto} alt="" className='w-12 h-12 rounded-full' />) : (<BsPersonCircle className='text-4xl text-white' />)
                    }
                    <p className='text-white text-sm font-bold lg:pr-0'>{user.nombre} {user.apellido}</p>
                    <p className='text-white text-sm'>Rol: {user.rol}</p>
                </div>
                <div className='flex flex-row items-center cursor-pointer' onClick={() => handleLogout()} >
                    <BsBoxArrowRight className='text-2xl text-white' />
                </div>
            </div>
            <div className={`text-white flex flex-col pt-4 w-full h-4/6 transition-opacity duration-300 ease-in-out ${open ? 'opacity-100' : `opacity-0`}`}>
                <div className={`flex flex-row items-center w-full pl-6 py-1 hover:bg-[#4274e2] transition-colors ${open ? 'cursor-pointer' : ''}`}>
                    <NavLink to={'/sgd'} className='flex flex-row items-center '>
                        <BsHouse className='w-5 h-5' />
                        <p className='pl-2 text-md'>Inicio</p>
                    </NavLink>
                </div>
                <div className={`flex flex-row items-center w-full pl-6 py-1 hover:bg-[#4274e2] transition-colors ${open ? 'cursor-pointer' : ''}`} onClick={() => handleOpenClose('denuncias')}>
                    {openDenuncias ? <MdOutlineArrowDropDown className='w-5 h-5' /> : <MdOutlineArrowRight className='w-5 h-5' />}
                    <p className='pl-2 text-md'>Denuncias</p>
                </div>
                <div className={`overflow-hidden transition-max-height duration-500 ${openDenuncias ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className='flex flex-col items-start w-full'>
                        <div className='pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <NavLink to={'/sgd/denuncias'} className='flex flex-row items-center '>
                                <BsFolderPlus className='w-5 h-5' />
                                <p className='pl-2 text-md'>Gestion Denuncias</p>
                            </NavLink>
                        </div>
                        {/* <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <NavLink to={'/sgd/denuncias/listado'} className='flex flex-row items-center '>
                                <BsListUl className='w-5 h-5' />
                                <p className='pl-2 text-md'>Listado de denuncias</p>
                            </NavLink>
                        </div> */}
                        {
                            user.rol === "SISADMIN" ? <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <NavLink to={'/sgd/denuncias/completa'} className='flex flex-row items-center '>
                                <BsListUl className='w-5 h-5' />
                                <p className='pl-2 text-md'>Cargar denuncias completas</p>
                            </NavLink>
                        </div> : ''
                        }                        
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <NavLink to={'/sgd/denuncias/corregir'} className='flex flex-row items-center '>
                                <MdChecklistRtl className='w-5 h-5' />
                                <p className='pl-2 text-md'>Corregir denuncias</p>
                            </NavLink>
                        </div>
                    </div>
                </div>
                {/* <div className={`flex flex-row items-center w-full pl-6 py-1 hover:bg-[#4274e2] transition-colors ${open ? 'cursor-pointer' : ''}`} onClick={() => handleOpenClose('geolocalizacion')}>
                    {openGeolocalizacion ? <MdOutlineArrowDropDown className='w-5 h-5' /> : <MdOutlineArrowRight className='w-5 h-5' />}
                    <p className='pl-2 text-md'>Geolocalización</p>
                </div> */}
                <div className={`overflow-hidden transition-max-height duration-500 ${openGeolocalizacion ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className='flex flex-col items-start w-full'>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <BsPinMapFill className='w-5 h-5' />
                            <p className='pl-2 text-md'>Corregir ubicaciones</p>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <BsMap className='w-5 h-5' />
                            <p className='pl-2 text-md'>Ver mapa</p>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-row items-center w-full pl-6 py-1 hover:bg-[#4274e2] transition-colors ${open ? 'cursor-pointer' : ''}`} onClick={() => handleOpenClose('estadisticas')}>
                    {openEstadisticas ? <MdOutlineArrowDropDown className='w-5 h-5' /> : <MdOutlineArrowRight className='w-5 h-5' />}
                    <p className='pl-2 text-md'>Estadisticas</p>
                </div>
                <div className={`overflow-hidden transition-max-height duration-500 ${openEstadisticas ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className='flex flex-col items-start w-full'>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <img src="/tucumán.svg" alt="" className='h-5 w-4' />
                            <NavLink to={'/sgd/estadisticas'}>
                                <p className='pl-2 text-md'>Provincia</p>
                            </NavLink>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <IoStatsChartOutline />
                            <NavLink to={'/sgd/estadisticasIA'}>
                                <p className='pl-2 text-md'>Clasificación</p>
                            </NavLink>
                        </div>
                        {/* <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <img src="/sgd/URC.svg" alt="" className='h-5 w-4' />
                            <NavLink to={'/sgd/estadisticas/capital'}>
                                <p className='pl-2 text-md'>Capital</p>
                            </NavLink>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <img src="/sgd/URN.svg" alt="" className='h-5 w-4' />
                            <NavLink to={'/sgd/estadisticas/norte'}>
                                <p className='pl-2 text-md'>Norte</p>
                            </NavLink>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <img src="/sgd/URS.svg" alt="" className='h-5 w-4' />
                            <NavLink to={'/sgd/estadisticas/sur'}>
                                <p className='pl-2 text-md'>Sur</p>
                            </NavLink>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <img src="/sgd/URE.svg" alt="" className='h-5 w-4' />
                            <NavLink to={'/sgd/estadisticas/este'}>
                                <p className='pl-2 text-md'>Este</p>
                            </NavLink>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <img src="/sgd/URO.svg" alt="" className='h-5 w-4' />
                            <NavLink to={'/sgd/estadisticas/oeste'}>
                                <p className='pl-2 text-md'>Oeste</p>
                            </NavLink>
                        </div> */}
                    </div>
                </div>
                {
                    user.rol === "ADMIN" || user.rol === "SISADMIN" ? <div className={`flex flex-row items-center w-full pl-6 py-1 hover:bg-[#4274e2] transition-colors ${open ? 'cursor-pointer' : ''}`} onClick={() => handleOpenClose('configuracion')}>
                        {openConfiguracion ? <MdOutlineArrowDropDown className='w-5 h-5' /> : <MdOutlineArrowRight className='w-5 h-5' />}
                        <p className='pl-2 text-md'>Configuración</p>
                    </div> : ''
                }
                <div className={`overflow-hidden transition-max-height duration-500 ${openConfiguracion ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className='flex flex-col items-start w-full'>
                        {
                            user.rol === "SISADMIN" ? <NavLink to={'/sgd/auditoria'} className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                                <BsShieldLock className='w-5 h-5' />
                                <p className='pl-2 text-md'>Auditoria</p>
                            </NavLink> : ''
                        }
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <NavLink to={'/sgd/usuarios'} className='flex flex-row items-center '>
                                <BsPerson className='w-5 h-5' />
                                <p className='pl-2 text-md'>Usuarios</p>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-row items-center w-full pl-6 py-1 hover:bg-[#4274e2] transition-colors ${open ? 'cursor-pointer' : ''}`}>
                    <NavLink to={'/modulos'} className='flex flex-row items-center '>
                        <MdOutlineViewModule className='w-5 h-5'/>
                        <p className='pl-2 text-md'>Módulos</p>
                    </NavLink>
                </div>
            </div>
            <div className='md:hidden justify-center items-end h-1/6 my-4 flex'>
                <img src="/Minseg_white.png" alt="" className='h-16 w-auto' />
            </div>
        </aside>
    )
}

export default Aside