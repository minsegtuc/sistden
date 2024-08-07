import React from 'react'

const CargarDenuncia = () => {
    return (
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full text-sm'>
            <div className='flex flex-row lg:gap-12 justify-between lg:justify-normal items-center'>
                <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Cargar denuncias</h2>
                <button className='py-2 bg-[#345071] text-white rounded-3xl w-40'>Subir archivos</button>
            </div>
            <p className='pt-8'>Denuncias encontradas: X</p>
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

export default CargarDenuncia