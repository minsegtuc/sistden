import React from 'react'
import Form_signin from '../components/Form_signin'
const IniciarSesion = () => {
    return (
    <div className='flex h-screen '>
            <div className=' w-1/2 bg-[#345071] flex flex-col justify-center items-center'>
                <div className=''>
                    <h1 className='text-6xl text-white font-bold ml-10 mb-5'>SGD</h1>
                    <h2 className='text-4xl text-white ml-10'>Sistema de Gestión
                        <br/>de Denuncias</h2>
                </div>
                
            </div>
            <div className='w-1/2 flex flex-col'>
                <div className='bg-blue-500 flex-grow h-5/6 p-20 '>
                    <div className='flex flex-col items-center justify-center'>
                        <h2>Iniciar sesión</h2>
                        <Form_signin/>
                        <button className='bg-[#345071] w-72 p-2 text-white '>Ingresar</button>
                    </div>
                </div>
                <div className='flex-grow h-1/6 flex items-center justify-center'>
                    <img src="/public/Minseg_black.png" alt="" className='w-60' />
                </div>
            </div>
    </div>
    )
}

export default IniciarSesion