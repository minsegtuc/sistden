import { useEffect, useState, useContext } from 'react'
import * as XLSX from 'xlsx';
import { BsCaretLeft, BsCaretRight, BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { ContextConfig } from '../context/ContextConfig';

const CargarDenuncia = () => {

    const [denunciasFile, setDenunciasFile] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [duplicadas, setDuplicadas] = useState(null)
    const [cantDuplicadas, setCantDuplicadas] = useState(null)

    const denunciasPerPage = 9;

    const { HOST, handleSession } = useContext(ContextConfig)

    const excelDateToJSDate = (excelDate) => {
        const millisecondsInDay = 86400 * 1000;
        const excelEpochDays = 25567 + 2 - 1;

        const days = Math.floor(excelDate);
        const jsTimestamp = (days - excelEpochDays) * millisecondsInDay;

        const date = new Date(jsTimestamp - (4 * 3600 * 1000)); 

        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    };

    const excelHourToJSDate = (excelHour) => {
        const totalHours = excelHour * 24;
        let hours = Math.floor(totalHours);
        let minutes = Math.floor((totalHours - hours) * 60);
        let seconds = Math.round((((totalHours - hours) * 60) - minutes) * 60);

        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }

        if (minutes === 60) {
            hours++;
            minutes = 0;
        }

        const hh = hours.toString().padStart(2, '0');
        const mm = minutes.toString().padStart(2, '0');
        const ss = seconds.toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    }

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

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const bodyData = jsonData.slice(1);

            const fixCorruptedCharacters = (text) => {
                if (typeof text !== 'string') return text; // Si no es cadena, devolver el valor original
                return text
                    .replace(/�/g, 'ñ')  // Reemplazar � con ñ
                    .replace(/�/g, 'á') // Reemplazar codificaciones corruptas comunes con sus correspondientes letras
                    .replace(/\xC3\xA9/g, 'é')
                    .replace(/\xC3\xAD/g, 'í')
                    .replace(/\xC3\xB3/g, 'ó')
                    .replace(/\xC3\xBA/g, 'ú')
                    .replace(/\xC3\x91/g, 'Ñ');
            };

            console.log("Data: ", bodyData)

            const formattedData = bodyData.map((denuncia) => {
                return {
                    'NRO DENUNCIA': fixCorruptedCharacters(denuncia[0] || ''),
                    'FECHA': denuncia[1] ? excelDateToJSDate(denuncia[1]) : null,
                    'DELITO': fixCorruptedCharacters(denuncia[2] || ''),
                    'LOCALIDAD': fixCorruptedCharacters(denuncia[3] || ''),
                    'COMISARIA': fixCorruptedCharacters(denuncia[4] || ''),
                    'FISCALIA': fixCorruptedCharacters(denuncia[5] || ''),
                    'FECHA CONFIRMACION': denuncia[6] ? excelDateToJSDate(denuncia[6]) : null,
                    'EXPEDIENTE': fixCorruptedCharacters(denuncia[7] || ''),
                    'FECHA HECHO': denuncia[8] ? excelDateToJSDate(denuncia[8]) : null,
                    'HORA HECHO': denuncia[9] ? excelHourToJSDate(denuncia[9]) : null,
                    'LUGAR DEL HECHO': fixCorruptedCharacters(denuncia[10] || ''),
                };
            });

            setDenunciasFile(formattedData);
            setIsLoading(false)
        };

        reader.readAsArrayBuffer(file);
    }

    const cantDuplicados = () => {
        setCantDuplicadas(null)
        const denunciasVerificar = denunciasFile != null ? (
            denunciasFile.map(denuncia => {
                return denuncia['NRO DENUNCIA']
            })
        ) : []

        fetch(`${HOST}/api/denuncia/duplicadas`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ denunciasVerificar })
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else if (res.status === 403) {
                Swal.fire({
                    title: 'Credenciales caducadas',
                    icon: 'info',
                    text: 'Credenciales de seguridad caducadas. Vuelva a iniciar sesion',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleSession()
                    }
                })
            }
        }).then(data => {
            setDuplicadas(data.duplicadas)
            setCantDuplicadas(data.duplicadas.length)
        }).catch(err => console.log(err))
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
        cantDuplicados()
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
                            currentDenuncias != null && cantDuplicadas != null ?
                                <table className='w-full'>
                                    <thead className='border-b-2 border-black w-full'>
                                        <tr className='w-full flex justify-center items-center'>
                                            <th className='w-1/12 text-center'>NRO DENUNCIA</th>
                                            <th className='w-1/12 text-center'>FECHA</th>
                                            <th className='w-1/12 text-center'>DELITO</th>
                                            <th className='w-2/12 text-center'>LOCALIDAD</th>
                                            <th className='w-1/12 text-center'>COMISARIA</th>
                                            <th className='w-1/12 text-center'>FISCALIA</th>
                                            <th className='w-1/12 text-center'>FECHA CONFIRMACION</th>
                                            <th className='w-1/12 text-center'>EXPEDIENTE</th>
                                            <th className='w-1/12 text-center'>FECHA HECHO</th>
                                            <th className='w-1/12 text-center'>HORA HECHO</th>
                                            <th className='w-1/12 text-center'>LUGAR DEL HECHO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentDenuncias.map((denuncia, index) => {
                                                const isDuplicada = duplicadas.some(dup => dup.idDenuncia === denuncia['NRO DENUNCIA']);

                                                return (
                                                    <tr key={index} className={`w-full flex items-center border-b-2 ${isDuplicada ? 'bg-yellow-100' : ''}`}>
                                                        <td className='w-1/12 text-center'>{denuncia["NRO DENUNCIA"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["FECHA"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["DELITO"]}</td>
                                                        <td className='w-2/12 text-center'>{denuncia["LOCALIDAD"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["COMISARIA"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["FISCALIA"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["FECHA CONFIRMACION"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["EXPEDIENTE"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["FECHA HECHO"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["HORA HECHO"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["LUGAR DEL HECHO"]}</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                                :
                                <div className='min-h-3/4'>
                                    <span className="relative flex h-32 w-32 mx-auto">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#345071] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-32 w-32 bg-[#345071]"></span>
                                    </span>
                                </div>

                        }
                        {
                            currentDenuncias != null && cantDuplicadas != null ? (
                                <div>
                                    <p className='font-bold text-xs pt-2'>Cantidad de denuncias: {denunciasFile != null ? denunciasFile.length : ''}</p>
                                    <p className='font-bold text-xs pt-2'>Cantidad de denuncias duplicadas: {cantDuplicadas != null ? cantDuplicadas : ''}</p>
                                </div>
                            ) : ''
                        }

                    </div>
                    :
                    <div className='bg-[#345071] text-white rounded-md w-auto text-center lg:py-16 py-8 px-4 mx-auto font-semibold shadow-md shadow-[#4274e2]/50 lg:my-16 my-4'>La base de datos se encuentra sin denuncias para clasificar</div>
            }
            <div className='flex flex-col justify-between lg:items-start items-center min-h-24 my-2 p-4'>
                {/* <button className='font-semibold text-center px-4 py-1 bg-black rounded-2xl text-white w-48 disabled:bg-opacity-55' disabled={denunciasFile === null}>Comprobar duplicados</button> */}
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