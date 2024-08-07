import React from 'react'
import { NavLink } from 'react-router-dom'

const Inicio = () => {
    return (
        <div className='flex flex-col h-heightfull px-8 pt-8'>
            <h2 className='text-[#345071] font-bold text-3xl lg:text-left text-center'>¡Hola {(JSON.parse(sessionStorage.getItem('user'))).nombre} {(JSON.parse(sessionStorage.getItem('user'))).apellido}!</h2>
            <div className='border-2 rounded-lg border-[#345071] h-auto w-full mt-8 bg-[#345071]/20'>
                <p className='text-xl lg:pl-12 pt-12 font-semibold text-center lg:text-left'>Faltan x denuncias por clasificar</p>
                <div className='flex flex-col justify-center md:flex-row lg:justify-end items-center my-8 lg:mr-8 md:gap-8 gap-4'>
                    <NavLink to={'/denuncias/cargar'} className='text-center py-2 bg-[#345071] text-white rounded-3xl w-44 text-md'>Cargar mas denuncias</NavLink>
                    <NavLink to={'/denuncias'} className='text-center py-2 bg-[#345071] text-white rounded-3xl w-44 text-md'>Clasificar faltantes</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Inicio