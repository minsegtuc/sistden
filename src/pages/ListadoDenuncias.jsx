import React from 'react'

const ListadoDenuncias = () => {
    return (
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full'>
            <div className='flex flex-row gap-12'>
                <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Listado de denuncias</h2>
            </div>
            <div className='md:h-3/4 pt-6'>
                <table className='w-full'>
                    <thead className='border-b-2 border-black w-full'>
                        <tr className='w-full flex text-left'>
                            <th className='w-1/4'>N° Denuncia</th>
                            <th className='w-2/4'>Delito</th>
                            <th className='w-1/4'>Lugar del hecho</th>
                            <th className='w-1/4'>Fecha del hecho</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default ListadoDenuncias