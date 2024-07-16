import React from 'react'

const Form = () => {
    return (
        <div className='w-full py-8'>
            <form className='flex flex-col md:flex-row justify-center w-full gap-8 md:gap-0'>
                <div className='flex flex-col gap-8 md:w-1/2 items-start'>
                    <div className='grid grid-cols-2'>
                        <label htmlFor="" className='ml-auto pr-8'>DNI:</label>
                        <input type="text" className='w-56 border-2 rounded-xl pl-3 border-[#757873]' />
                    </div>
                    <div className='grid grid-cols-2'>
                        <label htmlFor="" className='ml-auto pr-8'>Nombre:</label>
                        <input type="text" className='w-56 border-2 rounded-xl pl-3 border-[#757873]' />
                    </div>
                    <div className='grid grid-cols-2'>
                        <label htmlFor="" className='ml-auto pr-8'>Apellido/s:</label>
                        <input type="text" className='w-56 border-2 rounded-xl pl-3 border-[#757873]' />
                    </div>
                    <div className='grid grid-cols-2'>
                        <label htmlFor='' className='ml-auto pr-8'>Email:</label>
                        <input type="email" className='w-56 border-2 rounded-xl pl-3 border-[#757873]' />
                    </div>
                </div>
                <div className='flex flex-col gap-8 md:w-1/2 items-start'>
                    <div className='grid grid-cols-2'>
                        <label htmlFor="" className='ml-auto pr-8'>Teléfono:</label>
                        <input type="tel" className='w-56 border-2 rounded-xl pl-3 border-[#757873]' />
                    </div>
                    <div className='grid grid-cols-2'>
                        <label htmlFor='' className='ml-auto pr-8'>Puesto:</label>
                        <input type="text" className='w-56 border-2 rounded-xl pl-3 border-[#757873]' />
                    </div>
                    <div className='grid grid-cols-2'>
                        <label htmlFor="" className='ml-auto pr-8'>Contraseña:</label>
                        <input type="password" className='w-56 border-2 rounded-xl pl-3 border-[#757873]' />
                    </div>
                    <div className='grid grid-cols-2'>
                        <label htmlFor='' className='ml-auto pr-8'>Rol:</label>
                        <select name="" id="" className='w-56 border-2 rounded-xl pl-3 border-[#757873]'>
                            <option value="" selected disabled>Seleccione un rol</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Form