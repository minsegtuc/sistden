import React from 'react'
import Form from '../components/Form'
import { BsXCircleFill } from "react-icons/bs";

const ModificarUsuario = () => {
    return (
        <div className='px-6 pt-8 lg:h-heightfull'>
            <div className='flex flex-row justify-between'>
                <h2 className='text-[#345071] font-bold text-2xl lg:text-left text-center'>Detalles del usuario</h2>
                <button className='lg:w-32 h-12 w-12 text-white lg:rounded-lg rounded-full text-sm lg:px-4 lg:py-1 px-2 bg-[#f60021] flex flex-row items-center'>
                    <BsXCircleFill className='text-4xl' />
                    <span className='lg:block hidden'>Eliminar usuario</span>
                </button>
            </div>
            <Form />
            <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-32 mt-8 lg:gap-0 gap-4 pb-4'>
                <button className='py-2 bg-[#757873] text-white rounded-3xl w-40'>Cancelar</button>
                <button className='py-2 bg-[#345071] text-white rounded-3xl w-40'>Guardar Cambios</button>
            </div>
        </div>
    )
}

export default ModificarUsuario