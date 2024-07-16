import React from 'react'
import { BsPlusCircleFill, BsXCircleFill, BsSearch } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";

const Usuarios = () => {
    return (
        <div className='flex flex-col h-heightfull w-full px-16'>
            <div className='h-1/4 w-full flex flex-row justify-between py-8'>
                <div className='relative w-3/5 px-4 flex justify-start items-center'>
                    <input className='w-full text-sm h-10 px-6 rounded-3xl border-[#757873] border-2' placeholder='Buscar por dni, nombre o apellido...' />
                    <div className="absolute right-9 top-1/2 transform -translate-y-1/2">
                        <BsSearch className="text-[#757873]" />
                    </div>
                </div>
                <div className='w-2/5 flex justify-around items-center'>
                    <button className='w-32 h-12 text-white rounded-md text-sm px-4 py-1 bg-[#2ca900] flex flex-row items-center'>
                        <BsPlusCircleFill className='text-4xl' />
                        Nuevo usuario
                    </button>
                    <button className='w-32 h-12 text-white rounded-md text-sm px-4 py-1 bg-[#002649] flex flex-row items-center'>
                        <BiSolidEdit className='text-4xl' />
                        Modificar usuario
                    </button>
                    <button className='w-32 h-12 text-white rounded-md text-sm px-4 py-1 bg-[#f60021] flex flex-row items-center'>
                        <BsXCircleFill className='text-4xl' />
                        Eliminar usuario
                    </button>
                </div>
            </div>
            <div className='h-3/4 px-4'>
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