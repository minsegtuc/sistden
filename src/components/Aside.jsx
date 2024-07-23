import { useEffect, useState } from 'react'
import { BsHouse, BsFolderPlus, BsFileEarmarkCheck, BsListUl, BsPinMapFill, BsMap, BsBarChartLine, BsShieldLock, BsPerson } from "react-icons/bs";
import { MdOutlineArrowDropDown, MdOutlineArrowRight } from "react-icons/md";

const Aside = ({open}) => {

    const [openDenuncias, setOpenDenuncias] = useState(false)
    const [openGeolocalizacion, setOpenGeolocalizacion] = useState(false)
    const [openEstadisticas, setOpenEstadisticas] = useState(false)
    const [openConfiguracion, setOpenConfiguracion] = useState(false)

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

    useEffect(() => {
        console.log(open)
        if(!open){
            setOpenDenuncias(false)
            setOpenGeolocalizacion(false)
            setOpenEstadisticas(false)
            setOpenConfiguracion(false)
        }
    }, [open])

    return (
        <aside className={`bg-[#345071] h-heightfull transition-all duration-300 delay-100 flex flex-col ${open ? 'w-1/6' : 'w-0 overflow-hidden'}`}>
            <div className={`text-white flex flex-col pt-8 w-full h-5/6 transition-opacity duration-300 ease-in-out ${open ? 'opacity-100' : `opacity-0`}`}>
                <div className='flex flex-row items-center w-full pl-6 py-1 cursor-pointer hover:bg-[#4274e2] transition-colors'>
                    <BsHouse className='w-5 h-5' />
                    <p className='pl-2 text-md'>Inicio</p>
                </div>
                <div className='flex flex-row items-center w-full pl-6 py-1 cursor-pointer hover:bg-[#4274e2] transition-colors' onClick={() => handleOpenClose('denuncias')}>
                    {openDenuncias ? <MdOutlineArrowDropDown className='w-5 h-5' /> : <MdOutlineArrowRight className='w-5 h-5' />}
                    <p className='pl-2 text-md'>Denuncias</p>
                </div>
                <div className={`overflow-hidden transition-max-height duration-500 ${openDenuncias ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className='flex flex-col items-start w-full'>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <BsFolderPlus className='w-5 h-5' />
                            <p className='pl-2 text-md'>Cargar Denuncias</p>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <BsFileEarmarkCheck className='w-5 h-5' />
                            <p className='pl-2 text-md'>Clasificar denuncias</p>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <BsListUl className='w-5 h-5' />
                            <p className='pl-2 text-md'>Listado de denuncias</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row items-center w-full pl-6 py-1 cursor-pointer hover:bg-[#4274e2] transition-colors' onClick={() => handleOpenClose('geolocalizacion')}>
                    {openGeolocalizacion ? <MdOutlineArrowDropDown className='w-5 h-5' /> : <MdOutlineArrowRight className='w-5 h-5' />}
                    <p className='pl-2 text-md'>Geolocalización</p>
                </div>
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
                <div className='flex flex-row items-center w-full pl-6 py-1 cursor-pointer hover:bg-[#4274e2] transition-colors' onClick={() => handleOpenClose('estadisticas')}>
                    {openEstadisticas ? <MdOutlineArrowDropDown className='w-5 h-5' /> : <MdOutlineArrowRight className='w-5 h-5' />}
                    <p className='pl-2 text-md'>Estadisticas</p>
                </div>
                <div className={`overflow-hidden transition-max-height duration-500 ${openEstadisticas ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className='flex flex-col items-start w-full'>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <BsBarChartLine className='w-5 h-5' />
                            <p className='pl-2 text-md'>Ver estadisticas</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row items-center w-full pl-6 py-1 cursor-pointer hover:bg-[#4274e2] transition-colors' onClick={() => handleOpenClose('configuracion')}>
                    {openConfiguracion ? <MdOutlineArrowDropDown className='w-5 h-5' /> : <MdOutlineArrowRight className='w-5 h-5' />}
                    <p className='pl-2 text-md'>Configuración</p>
                </div>
                <div className={`overflow-hidden transition-max-height duration-500 ${openConfiguracion ? 'max-h-screen' : 'max-h-0'}`}>
                    <div className='flex flex-col items-start w-full'>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <BsShieldLock className='w-5 h-5' />
                            <p className='pl-2 text-md'>Auditoria</p>
                        </div>
                        <div className='flex flex-row items-center pl-12 py-1 hover:bg-[#4274e2] transition-colors w-full'>
                            <BsPerson className='w-5 h-5' />
                            <p className='pl-2 text-md'>Usuarios</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-end h-1/6 my-4'>
                <img src="/Minseg_white.png" alt="" className='h-8 w-auto' />
            </div>
        </aside>
    )
}

export default Aside