import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';
import { BsCaretLeft, BsCaretRight, BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

const CargarDenuncia = () => {

    const [denunciasFile, setDenunciasFile] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })

    const denunciasPerPage = 9;

    const excelDateToJSDate = (excelDate) => {
        const date = new Date((excelDate - (25567 + 2 - 1)) * 86400 * 1000);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const handleFileUpload = (e) => {
        setIsLoading(true)
        const file = e.target.files[0]
        const reader = new FileReader()
        setDenunciasFile(null)

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const formattedData = jsonData.map((denuncia) => {
                if (denuncia['FECHA']) {
                    denuncia['FECHA'] = excelDateToJSDate(denuncia['FECHA']);
                }
                return denuncia;
            });

            setDenunciasFile(formattedData);
            setIsLoading(false)
        };

        reader.readAsArrayBuffer(file);
    }

    const startIndex = currentPage * denunciasPerPage;
    const endIndex = startIndex + denunciasPerPage;

    const currentDenuncias = denunciasFile ? denunciasFile.slice(startIndex, endIndex) : []

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (endIndex < denunciasFile.length) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handleFirstPage = () => {
        setCurrentPage(0)
    }

    const handleLastPage = () => {
        const totalPages = denunciasFile ? Math.ceil(denunciasFile.length / denunciasPerPage) : 0;
        setCurrentPage(totalPages - 1)
    }

    useEffect(() => {
        console.log(denunciasFile)
    }, [denunciasFile])

    return (
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full text-sm overflow-scroll'>
            <div className='flex flex-row lg:gap-12 justify-between lg:justify-normal items-center'>
                <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Cargar denuncias</h2>
            </div>
            <div className='flex flex-row items-center pt-4'>
                {
                    isLoading ? <svg className="animate-spin h-6 w-6 mr-4 text-[#345071]" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg> : ''
                }
                <input type="file" name="" id="" accept='.xlsx' className='' onChange={handleFileUpload} />
            </div>

            {
                denunciasFile != null ?
                    <div className='pt-4 min-h-3/4'>
                        {
                            currentDenuncias != null ?
                                <table className='w-full'>
                                    <thead className='border-b-2 border-black w-full'>
                                        <tr className='w-full flex lg:text-left'>
                                            <th className='w-1/4'>N° Denuncia</th>
                                            <th className='w-1/4'>Fecha del hecho</th>
                                            <th className='w-2/4'>Delito</th>
                                            <th className='w-1/4'>Localidad</th>
                                            <th className='w-1/4'>Comisaria</th>
                                            <th className='w-1/4'>Especializacion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentDenuncias.map((denuncia, index) => (
                                                <tr key={index} className='w-full flex md:text-left border-b-2'>
                                                    <td className='w-1/4'>{denuncia['NRO DENUNCIA']}</td>
                                                    <td className='w-1/4 text-left'>{denuncia['FECHA']}</td>
                                                    <td className='w-2/4 text-left'>{denuncia['DELITO']}</td>
                                                    <td className='w-1/4 text-left'>{denuncia['LOCALIDAD']}</td>
                                                    <td className='w-1/4 text-left'>{denuncia['COMISARIA']}</td>
                                                    <td className='w-1/4 text-left'>{denuncia['ESPECIALIZACION']}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                :
                                ''
                        }
                        <p className='font-bold text-xs pt-2'>Cantidad de denuncias: {denunciasFile != null ? denunciasFile.length : ''}</p>
                    </div>
                    :
                    <div className='bg-[#345071] text-white rounded-md w-auto text-center lg:py-16 py-8 px-4 mx-auto font-semibold shadow-md shadow-[#4274e2]/50 lg:my-16 my-4'>La base de datos se encuentra sin denuncias para clasificar</div>
            }
            <div className='flex flex-col justify-between lg:items-start items-center min-h-24 my-2 p-4'>
                <button className='font-semibold text-center px-4 py-1 bg-black rounded-2xl text-white w-48 disabled:bg-opacity-55' disabled={denunciasFile === null}>Comprobar duplicados</button>
                <button className='font-semibold text-center px-4 py-1 bg-black rounded-2xl text-white w-48 disabled:bg-opacity-55' disabled={denunciasFile === null}>Cargar denuncias</button>
            </div>
            <div className='flex justify-center items-center pt-2 pb-4'>
                <BsCaretLeftFill className='text-2xl cursor-pointer' onClick={handleFirstPage} />
                <BsCaretLeft className='text-2xl cursor-pointer' onClick={handlePrevPage} />
                <p className='font-semibold'>Página {currentPage + 1}</p>
                <BsCaretRight className='text-2xl cursor-pointer' onClick={handleNextPage} />
                <BsCaretRightFill className='text-2xl cursor-pointer' onClick={handleLastPage} />
            </div>
        </div>
    )
}

export default CargarDenuncia