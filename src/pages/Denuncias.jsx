import React from 'react'
import { BsSearch } from "react-icons/bs";
import { BiPlusCircle } from "react-icons/bi";

const Denuncias = () => {
    return (
        <div className='flex flex-col md:h-heightfull w-full md:w-4/5 px-8 pt-8'>
            <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Gestion de denuncias</h2>
            <div className='md:h-1/4 w-full flex items-center flex-row md:justify-between pt-8 md:gap-0 gap-4'>
                <div className='relative w-4/5 px-4 flex justify-start items-center'>
                    <input className='w-full text-sm h-10 px-6 rounded-3xl border-[#757873] border-2' placeholder='Buscar N° de Denuncia' />
                    <div className="absolute right-9 top-1/2 transform -translate-y-1/2">
                        <BsSearch className="text-[#757873]" />
                    </div>
                </div>
                <div className='w-1/5 flex justify-center md:justify-start items-center gap-20 md:gap-0'>
                    <button className='md:w-48 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#002649] flex flex-row items-center justify-between'>
                        <BiPlusCircle className='text-4xl' />
                        <span className='md:block hidden'>Cargar Denuncias</span>
                    </button>
                </div>
            </div>
            <p className='text-sm px-4 py-4'>Restan clasificar x denuncias</p>
            <div className='md:h-full px-4'>
                <table className='w-full'>
                    <thead className='border-b-2 border-black w-full'>
                        <tr className='w-full flex text-center'>
                            <th className='w-2/6'>N° DENUNCIA</th>
                            <th className='w-1/6'>Delito</th>
                            <th className='w-1/6'>Comisaria</th>
                            <th className='w-1/6'>Fecha</th>
                            <th className='w-1/6 bg-slate-400'></th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default Denuncias