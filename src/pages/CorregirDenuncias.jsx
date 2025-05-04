import {useState} from 'react'

const CorregirDenuncias = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [delito, setDelito] = useState('')
    const [submodalidad, setSubmodalidad] = useState('')
    const [denuncias, setDenuncias] = useState([])

    return (
        <div className='flex flex-col md:h-heightfull px-8 pt-8 overflow-scroll'>
            <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Corregir denuncias</h2>
            <div className='flex flex-col lg:flex-row gap-2 mt-2 bg-gray-300 p-2 rounded-lg'>
                <div className='flex flex-col lg:flex-row w-full justify-center border-r-[1px] items-center gap-2'>
                    <label className='text-xs font-semibold whitespace-nowrap text-left'>Fecha de inicio:</label>
                    <input type="date" className='border border-gray-400 rounded-lg p-2 h-7 text-xs' />
                    <label className='text-xs font-semibold whitespace-nowrap'>Fecha de fin:</label>
                    <input type="date" className='border border-gray-400 rounded-lg p-2 h-7 text-xs' />
                </div>
                <div className='flex flex-col lg:flex-row w-full justify-center items-center gap-2 max-w-36 border-r-[1px]'>
                    <label htmlFor="" className='text-xs font-semibold'>Delito:</label>
                    <select name="" id="" className='border border-gray-400 rounded-lg h-7 text-xs'>
                        <option value="">Delito 1</option>
                        <option value="">Delito 2</option>
                        <option value="">Delito 3</option>
                    </select>
                </div>
                <div className='flex flex-col lg:flex-row w-full justify-center items-center gap-2 max-w-48 border-r-[1px]'>
                    <label htmlFor="" className='text-xs font-semibold'>Submodalidad</label>
                    <select name="" id="" className='border border-gray-400 rounded-lg h-7 text-xs'>
                        <option value="">Delito 1</option>
                        <option value="">Delito 2</option>
                        <option value="">Delito 3</option>
                    </select>
                </div>
                <div className='flex flex-col lg:flex-row w-full justify-end items-center gap-2'>
                    <button className={`font-semibold text-center px-4 py-1  rounded-2xl w-36 text-white disabled:bg-opacity-55 transition-colors ${isLoading ? 'bg-[#005CA2] ' : 'bg-black '}`}>Solicitar</button>
                </div>
            </div>
        </div>
    )
}

export default CorregirDenuncias