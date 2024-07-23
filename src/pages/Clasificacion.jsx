import React from 'react'

const Clasificacion = () => {
    return (
        <div className='flex flex-col lg:h-heightfull w-full px-8 pt-8 pb-4'>
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
            <h2 className='text-[#345071] font-bold text-2xl lg:text-left text-center my-6 mx-8 uppercase'>Clasificación</h2>
            <div className='px-4 grid grid-cols-1 lg:grid-cols-3 uppercase pb-3 gap-3'>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Submodalidad:</label>
                    <select name="" id="" className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'></select>
                </div>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Modalidad:</label>
                    <input type="text" disabled className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Especialidad:</label>
                    <input type="text" disabled className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
            </div>
            <div className='px-4 grid grid-cols-1 lg:grid-cols-4 uppercase gap-3'>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Aprehendido:</label>
                    <select className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Medida:</label>
                    <select className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Movilidad:</label>
                    <select className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Autor:</label>
                    <select className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2 w-48'>Para seguro:</label>
                    <select className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
                <div className='flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Arma:</label>
                    <select className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <label htmlFor="" className='pr-2'>Victima:</label>
                    <select className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'/>
                </div>
                <div className='lg:col-span-4 flex flex-row items-center flex-nowrap'>
                    <label htmlFor="" className='pr-2 lg:w-60'>Elementos sustraidos:</label>
                    <input name="" id="" className='w-full h-6 border-2 rounded-xl pl-3 border-[#757873]'></input>
                </div>
            </div>
        </div>
    )
}

export default Clasificacion