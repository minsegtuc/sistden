import React from 'react'

const Form = () => {
    return (
        <div className='w-full py-8 pr-12'>
            <form className='grid grid-cols-3 gap-4 lg:grid-cols-8 w-full'>
                <label htmlFor="" className='text-right pr-4'>DNI:</label>
                <input type="text" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' />
                <label htmlFor="" className='text-right pr-4'>Nombre:</label>
                <input type="text" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' />
                <label htmlFor="" className='text-right pr-4'>Apellido/s:</label>
                <input type="text" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' />
                <label htmlFor='' className='text-right pr-4'>Email:</label>
                <input type="email" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' />
                <label htmlFor="" className='text-right pr-4'>Teléfono:</label>
                <input type="tel" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' />
                <label htmlFor='' className='text-right pr-4'>Puesto:</label>
                <input type="text" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' />
                <label htmlFor="" className='text-right pr-4'>Contraseña:</label>
                <input type="password" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' />
                <label htmlFor='' className='text-right pr-4'>Rol:</label>
                <select name="" id="" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3'>
                    <option value="" selected disabled>Seleccione un rol</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </form>
        </div>
    )
}

export default Form