import React from 'react'
import Form from '../components/Form'
import { BsXCircleFill } from "react-icons/bs";

const ModificarUsuario = () => {
    return (
        <div className='w-full px-6 pt-4 md:h-heightfull'>
            <div className='flex flex-row justify-between'>
                <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Detalles del usuario</h2>
                <button className='md:w-32 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#f60021] flex flex-row items-center'>
                    <BsXCircleFill className='text-4xl' />
                    <span className='md:block hidden'>Eliminar usuario</span>
                </button>
            </div>
            <Form />
            <div className='flex flex-col md:flex-row justify-around items-center md:mt-32 mt-8 md:gap-0 gap-4'>
                <button className='py-2 bg-[#757873] text-white rounded-3xl w-40'>Cancelar</button>
                <button className='py-2 bg-[#345071] text-white rounded-3xl w-40'>Guardar Cambios</button>
            </div>
        </div>
    )
}

export default ModificarUsuario