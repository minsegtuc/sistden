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
    const [totalDenuncias, setTotalDenuncias] = useState(null)
    const [totalPages, setTotalPages] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [denunciaSearch, setDenunciaSearch] = useState('')
    const [años, setAños] = useState([])
    const { handleSession, HOST, handleDenuncia, handleRegionalGlobal, handlePropiedadGlobal, handleInteresGlobal, regional, propiedad, interes, año, handleAñoGlobal } = useContext(ContextConfig)
    const navigate = useNavigate()

    const denunciasPerPage = 10;
    const startIndex = currentPage * denunciasPerPage;
    const endIndex = startIndex + denunciasPerPage;

    //const currentDenuncias = denuncias ? denuncias.slice(startIndex, endIndex) : []

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const handleFirstPage = () => {
        setCurrentPage(0)
    }

    const handleLastPage = () => {
        setCurrentPage(totalPages - 1)
    }

    const sendDenuncia = (denuncia) => {
        handleDenuncia(denuncia)
        navigate(`/sgd/denuncias/descripcion`)
    }

    const handleSearch = (e) => {
        setDenunciaSearch(e.target.value)
    }

    const handleRegional = (value) => {
        handleRegionalGlobal(value)
    }

    const handleAño = (value) => {
        handleAñoGlobal(value)
    }

    const handlePropiedad = (checked) => {
        handlePropiedadGlobal(checked)
    }

    const handleInteres = (checked) => {
        handleInteresGlobal(checked)
    }

    useEffect(() => {
        setIsLoading(true)
        const int = interes ? 1 : 0;
        const prop = propiedad ? 1 : 0;

        // handleRegionalGlobal(regional)
        // handlePropiedadGlobal(propiedad)
        // handleInteresGlobal(interes)

        fetch(`${HOST}/api/denuncia/denuncialike?page=${currentPage}&limit=50`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ denunciaSearch, regional, interes: int, propiedad: prop, año })
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
                // console.log("Data actual: ", data.denuncias)
                // console.log("Total de denuncias: ", data.total)
                setTotalDenuncias(data.total)
                setTotalPages(data.totalPages - 1)
                const denunciasFilter = []
                data.denuncias.map(denuncia => {
                    const newFecha = (denuncia.fechaDelito).split('-')
                    denunciasFilter.push({ ...denuncia, fechaDelito: newFecha[2] + '/' + newFecha[1] + '/' + newFecha[0] })
                }
                )

                setDenuncias(denunciasFilter)
                setIsLoading(false)
            })
    }, [denunciaSearch, currentPage, regional, propiedad, interes, año])

    useEffect(() => {
        fetch(`${HOST}/api/denuncia/anio`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
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
                setAños(data)
            })
    }, [])

    return (
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full text-xs lg:text-sm overflow-scroll'>
            <div className='flex flex-row items-center'>
                <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Listado de denuncias</h2>
                <p className='text-xs text-left font-semibold pt-2 pl-4'>Cantidad de denuncias: {totalDenuncias}</p>
            </div>
            <div className='flex flex-col lg:flex-row w-auto justify-start items-center gap-2 mt-2 bg-gray-300 p-2 rounded-lg'>
                <h2 className='font-semibold'>Filtros: </h2>
                <div className='flex flex-row justify-center items-center mb-2 lg:mb-0'>
                    <select className='rounded-xl mr-2' name="año" id="" onChange={(e) => handleAño(e.target.value)} value={año || ''}>
                        <option value="">Año</option>
                        {
                            años.map(año => (
                                <option key={año.year} value={año.year}>{año.year}</option>
                            ))
                        }
                    </select>
                    <select className='rounded-xl mr-2' name="regional" id="" onChange={(e) => handleRegional(e.target.value)} value={regional || ''}>
                        <option value="">Seleccione una regional</option>
                        <option value="1">URC</option>
                        <option value="2">URN</option>
                        <option value="3">URS</option>
                        <option value="4">URO</option>
                        <option value="5">URE</option>
                    </select>
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <p className='mr-2 ml-3 pl-4 lg:border-l-2 border-black'>Delito contra la propiedad</p>
                    <input type="checkbox" name="propiedad" id="" onChange={(e) => handlePropiedad(e.target.checked)} checked={!!propiedad} />
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <p className='mr-2 ml-3 pl-4 lg:border-l-2 border-black'>Interes</p>
                    <input type="checkbox" name="interes" id="" onChange={(e) => handleInteres(e.target.checked)} checked={!!interes} />
                </div>
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
                            denuncias.length > 0 ?
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
                                                denuncias.map(denuncia => (
                                                    <tr className='w-full flex border-b-2 items-center justify-center min-h-12 hover:bg-[#005cA2]/20' key={denuncia?.idDenuncia}>
                                                        <td className='w-2/6 text-center lg:text-left lg:w-1/6'>{denuncia?.idDenuncia}</td>
                                                        <td className='w-2/6 text-center px-5'>{denuncia?.submodalidad?.modalidad?.tipoDelito?.descripcion ? denuncia?.submodalidad?.modalidad?.tipoDelito?.descripcion : 'No registrado en base de datos'}</td>
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