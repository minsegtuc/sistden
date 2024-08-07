import React from 'react'
import { NavLink } from 'react-router-dom'

const Clasificacion = () => {
    return (
        <div className='flex flex-col lg:h-heightfull w-full px-8 pt-8 pb-4 text-sm'>
            <div className='p-4 border-2 border-black rounded-xl grid grid-cols-1 lg:grid-cols-3 uppercase gap-3'>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>N° de denuncia (sumario):</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>DNI denunciante:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Fecha denuncia:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Delito:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Fecha del hecho:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Hora del hecho:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Lugar del hecho:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <p className='font-bold'>Localidad:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Comisaria:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <p className='font-bold'>Fiscalia:</p>
                    <p className='pl-2'>{'XXXXXXXXXXXXXX'}</p>
                </div>
            </div>
            <h2 className='text-[#345071] font-bold text-2xl lg:text-left text-center my-6 uppercase'>Clasificación</h2>
            <div className='px-4 grid lg:grid-cols-6 uppercase pb-3 gap-4 mr-12 text-sm'>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Submodalidad:</label>
                    <select name="" id="" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2'></select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Modalidad:</label>
                    <input type="text" disabled className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Especialidad:</label>
                    <input type="text" disabled className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Aprehendido:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Medida:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Movilidad:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Autor:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Para seguro:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Arma:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Victima:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' />
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Elementos sustraidos:</label>
                    <input name="" id="" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2'></input>
                </div>
            </div>
            <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-16 lg:gap-0 gap-4 pb-4 text-sm'>
                <NavLink to={'/denuncias'} className='text-center py-2 bg-[#757873] text-white rounded-3xl w-40'>Cancelar</NavLink>
                <button className='py-2 bg-[#345071] text-white rounded-3xl w-40'>Guardar Clasificación</button>
            </div>
        </div>
    )
}

export default Clasificacion