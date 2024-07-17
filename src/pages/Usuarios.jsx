import React from 'react'
import { BsPlusCircleFill, BsXCircleFill, BsSearch } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";

const Usuarios = () => {
    return (
        <div className='flex flex-col md:h-heightfull w-4/5 px-8 pt-8'>
            <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Usuarios</h2>
            <div className='md:h-1/4 w-full flex flex-col items-center md:flex-row md:justify-between py-8 md:gap-0 gap-4'>
                <div className='relative w-full md:w-3/5 px-4 flex justify-start items-center'>
                    <input className='w-full text-sm h-10 px-6 rounded-3xl border-[#757873] border-2' placeholder='Buscar por dni, nombre o apellido...' />
                    <div className="absolute right-9 top-1/2 transform -translate-y-1/2">
                        <BsSearch className="text-[#757873]" />
                    </div>
                </div>
                <div className='md:w-2/5 flex justify-around items-center gap-20 md:gap-0'>
                    <button className='md:w-32 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#2ca900] flex flex-row items-center'>
                        <BsPlusCircleFill className='text-4xl' />
                        <span className='md:block hidden'>Nuevo usuario</span>
                    </button>
                    <button className='md:w-32 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#002649] flex flex-row items-center'>
                        <BiSolidEdit className='text-4xl' />
                        <span className='md:block hidden'>Modificar usuario</span>
                    </button>
                    <button className='md:w-32 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#f60021] flex flex-row items-center'>
                        <BsXCircleFill className='text-4xl' />
                        <span className='md:block hidden'>Eliminar usuario</span>
                    </button>
                </div>
            </div>
            <div className='md:h-3/4 px-4'>
                <table className='w-full'>
                    <thead className='border-b-2 border-black w-full'>
                        <tr className='w-full flex text-left'>
                            <th className='w-1/4'>DNI</th>
                            <th className='w-2/4'>Apellido y nombre</th>
                            <th className='w-1/4'>Email</th>
                            <th className='w-1/4'>Rol</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default Usuarios