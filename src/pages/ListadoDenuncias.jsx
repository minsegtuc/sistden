import { useState, useEffect, useContext } from 'react'
import { BsSearch } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { ContextConfig } from '../context/ContextConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListadoDenuncias = () => {

    const [denuncias, setDenuncias] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [denunciaSearch, setDenunciaSearch] = useState('')
    const { handleSession, HOST, handleDenuncia } = useContext(ContextConfig)
    const navigate = useNavigate()

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
                console.log(data.denuncias)

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
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full text-sm'>
            <div className='flex flex-row gap-12'>
                <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Listado de denuncias</h2>
            </div>
            <div className='relative w-full mt-4 flex justify-start items-center'>
                <input className='w-full text-sm h-10 px-6 rounded-3xl border-[#757873] border-2' placeholder='Buscar N° de Denuncia' onChange={handleSearch} />
                <div className="absolute right-9 top-1/2 transform -translate-y-1/2">
                    <BsSearch className="text-[#757873]" />
                </div>
            </div>
            {
                isLoading ? (<span className="relative flex h-32 w-32 mx-auto mt-11">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#345071] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-32 w-32 bg-[#345071]"></span>
                </span>) :

                    <div className='md:h-3/4 pt-6'>
                        {
                            denuncias.length > 0 ?
                                (
                                    <table className='w-full'>
                                        <thead className='border-b-2 border-black w-full'>
                                            <tr className='w-full flex'>
                                                <th className='w-1/6 text-left'>N° Denuncia</th>
                                                <th className='w-2/6'>Delito</th>
                                                <th className='w-1/6'>Lugar del hecho</th>
                                                <th className='w-1/6'>Fecha del hecho</th>
                                                <th className='w-1/6'>Ver</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                denuncias.map(denuncia => (
                                                    <tr className='w-full flex'>
                                                        <td className='w-1/6 text-left'>{denuncia?.idDenuncia}</td>
                                                        <td className='w-2/6'>{denuncia?.submodalidad?.tipoDelito?.descripcion ? denuncia?.submodalidad?.tipoDelito?.descripcion : '-'}</td>
                                                        <td className='w-1/6 text-center'>{denuncia?.Ubicacion?.domicilio}</td>
                                                        <td className='w-1/6 text-center'>{denuncia?.fechaDelito}</td>
                                                        <th className='w-1/6'><BsEye className='m-auto cursor-pointer' onClick={() => sendDenuncia(denuncia?.idDenuncia)} /></th>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                )
                                :
                                (
                                    <div className='bg-[#345071] text-white rounded-md w-96 text-center py-16 mx-auto font-semibold shadow-md shadow-[#4274e2]/50'>La base de datos se encuentra sin denuncias</div>
                                )
                        }

                    </div>
            }
        </div>
    )
}

export default ListadoDenuncias