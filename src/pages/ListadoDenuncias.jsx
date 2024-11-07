import { useState, useEffect, useContext } from 'react'
import { BsSearch } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { ContextConfig } from '../context/ContextConfig';
import { useNavigate } from 'react-router-dom';
import { BsCaretLeft, BsCaretRight, BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import Swal from 'sweetalert2';

const ListadoDenuncias = () => {

    const [denuncias, setDenuncias] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [denunciaSearch, setDenunciaSearch] = useState('')
    const { handleSession, HOST, handleDenuncia } = useContext(ContextConfig)
    const navigate = useNavigate()

    const denunciasPerPage = 25;
    const startIndex = currentPage * denunciasPerPage;
    const endIndex = startIndex + denunciasPerPage;

    const currentDenuncias = denuncias ? denuncias.slice(startIndex, endIndex) : []

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (endIndex < denuncias.length) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handleFirstPage = () => {
        setCurrentPage(0)
    }

    const handleLastPage = () => {
        const totalPages = denuncias ? Math.ceil(denuncias.length / denunciasPerPage) : 0;
        setCurrentPage(totalPages - 1)
    }

    const sendDenuncia = (denuncia) => {
        handleDenuncia(denuncia)
        navigate(`/sigs/denuncias/descripcion`)
    }

    const handleSearch = (e) => {
        setDenunciaSearch(e.target.value)
    }

    useEffect(() => {
        setIsLoading(true)
        fetch(`${HOST}/api/denuncia/denuncialike`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ denunciaSearch })
        })
            .then(res => {
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
            })
            .then(data => {
                const denunciasFilter = []
                data.denuncias.map(denuncia => {
                    if (denuncia.isClassificated === 1) {
                        const newFecha = (denuncia.fechaDelito).split('-')
                        denunciasFilter.push({ ...denuncia, fechaDelito: newFecha[2] + '/' + newFecha[1] + '/' + newFecha[0] })
                    }
                }
                )

                setDenuncias(denunciasFilter)
                setIsLoading(false)
            })
    }, [denunciaSearch])

    return (
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full text-xs lg:text-sm overflow-scroll'>
            <div className='flex flex-row gap-12'>
                <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Listado de denuncias</h2>
            </div>
            <div className='relative w-full mt-4 flex justify-start items-center'>
                <input className='w-full text-sm h-10 px-6 rounded-3xl border-[#757873] border-2' placeholder='Buscar N° de Denuncia' onChange={handleSearch} />
                <div className="absolute right-9 top-1/2 transform -translate-y-1/2">
                    <BsSearch className="text-[#757873]" />
                </div>
            </div>
            {
                isLoading ? (<span className="relative flex h-32 w-32 mx-auto mt-11">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005CA2] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-32 w-32 bg-[#005CA2]"></span>
                </span>) :

                    <div className='pt-6 mb-8'>
                        {
                            currentDenuncias.length > 0 ?
                                (
                                    <table className='w-full'>
                                        <thead className='border-b-2 border-black w-full'>
                                            <tr className='w-full flex items-center justify-center'>
                                                <th className='w-2/6 text-center lg:text-left lg:w-1/6'>N° Denuncia</th>
                                                <th className='w-2/6 text-center'>Delito</th>
                                                <th className='w-1/6 lg:block hidden text-center'>Lugar del hecho</th>
                                                <th className='w-1/6 text-center'>Fecha del hecho</th>
                                                <th className='w-1/6 text-center'>Ver</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                currentDenuncias.map(denuncia => (
                                                    <tr className='w-full flex border-b-2 items-center justify-center min-h-12'>
                                                        <td className='w-2/6 text-center lg:text-left lg:w-1/6'>{denuncia?.idDenuncia}</td>
                                                        <td className='w-2/6 text-center px-5'>{denuncia?.tipoDelito?.descripcion ? denuncia?.tipoDelito?.descripcion : 'No registrado en base de datos'}</td>
                                                        <td className='w-1/6 lg:block hidden'>{denuncia?.Ubicacion?.domicilio}</td>
                                                        <td className='text-center w-1/6'>{denuncia?.fechaDelito}</td>
                                                        <th className='w-1/6'><BsEye className='m-auto cursor-pointer' onClick={() => sendDenuncia(denuncia?.idDenuncia)} /></th>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                )
                                :
                                (
                                    <div className='bg-[#005CA2] text-white rounded-md md:w-96 text-center py-16 mx-auto font-semibold shadow-md shadow-[#4274e2]/50'>La base de datos se encuentra sin denuncias</div>
                                )
                        }

                    </div>
            }
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

export default ListadoDenuncias