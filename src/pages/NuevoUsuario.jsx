import React from 'react'
import Form from '../components/Form'

const NuevoUsuario = () => {
    return (
        <div className='px-6 pt-8 lg:h-heightfull'>
            <h2 className='text-[#345071] font-bold text-2xl lg:text-left text-center'>Nuevo usuario</h2>
            <Form/>
            <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-32 mt-8 lg:gap-0 gap-4 pb-4'>
                <button className='py-2 bg-[#757873] text-white rounded-3xl w-40'>Cancelar</button>
                <button className='py-2 bg-[#345071] text-white rounded-3xl w-40'>Crear usuario</button>
            </div>
        </div>
    )
}

export default NuevoUsuario