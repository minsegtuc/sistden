import { useEffect, useState } from 'react'

const Form = ({handleChange, form, tipo}) => {    

    return (
        <div className='w-full py-8 pr-12 text-sm'>
            <form className='grid grid-cols-3 gap-4 lg:grid-cols-8 w-full'>
                <label htmlFor="" className='text-right pr-4'>DNI:</label>
                <input type="text" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' name='dni' onChange={handleChange} value={form.dni}/>
                <label htmlFor="" className='text-right pr-4'>Nombre:</label>
                <input type="text" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' name='nombre' onChange={handleChange} value={form.nombre}/>
                <label htmlFor="" className='text-right pr-4'>Apellido/s:</label>
                <input type="text" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' name='apellido' onChange={handleChange} value={form.apellido}/>
                <label htmlFor='' className='text-right pr-4'>Email:</label>
                <input type="email" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' name='email' onChange={handleChange} value={form.email}/>
                <label htmlFor="" className='text-right pr-4'>Teléfono:</label>
                <input type="tel" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' name='telefono' onChange={handleChange} value={form.telefono}/>
                <label htmlFor='' className='text-right pr-4'>Puesto:</label>
                <input type="text" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' name='puesto' onChange={handleChange} value={form.puesto}/>
                {/* {
                    tipo === 'new' && ( */}
                        <>
                            <label htmlFor="" className='text-right pr-4'>Contraseña:</label>
                            <input type="password" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' name='contraseña' onChange={handleChange} value={form.contraseña}/>
                        </>
                    {/* )
                }                 */}
                <label htmlFor='' className='text-right pr-4'>Rol:</label>
                <select name="rolId" id="" className='border-2 rounded-xl pl-3 border-[#757873] col-span-2 lg:col-span-3' onChange={handleChange} value={form.rolId || ''}>
                    <option value="" selected disabled>Seleccione un rol</option>
                    <option value='1'>Admin</option>
                    <option value='2'>Visor</option>
                    <option value='3'>Lector</option>
                </select>
            </form>
        </div>
    )
}

export default Form