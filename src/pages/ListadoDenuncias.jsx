import { useState, useEffect, useContext } from 'react'
import { BsEye } from "react-icons/bs";
import { ContextConfig } from '../context/ContextConfig';
import { useNavigate } from 'react-router-dom';

const ListadoDenuncias = () => {

    const [denuncias, setDenuncias] = useState([])
    const { handleSession } = useContext(ContextConfig)
    const navigate = useNavigate()

    const handleDenuncia = (denuncia) => {
        navigate(`/sigs/denuncias/descripcion/${denuncia}`)
    }

    useEffect(() => {
        fetch('http://srv555183.hstgr.cloud:3005/api/denuncia/denuncia', {
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
                const denunciasFilter = []

                data.map(denuncia => {
                    if (denuncia.isClassificated === 1) {
                        const newFecha = (denuncia.fechaDelito).split('-')
                        denunciasFilter.push({ ...denuncia, fechaDelito: newFecha[2] + '/' + newFecha[1] + '/' + newFecha[0] })
                    }
                }
                )

                setDenuncias(denunciasFilter)
            })
    }, [])

    return (
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full text-sm'>
            <div className='flex flex-row gap-12'>
                <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Listado de denuncias</h2>
            </div>
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
                                                <td className='w-1/6 text-left'>{denuncia.idDenuncia}</td>
                                                <td className='w-2/6'>{denuncia.submodalidad.tipoDelito.descripcion}</td>
                                                <td className='w-1/6 text-center'>{denuncia.Ubicacion.domicilio}</td>
                                                <td className='w-1/6 text-center'>{denuncia.fechaDelito}</td>
                                                <th className='w-1/6'><BsEye className='m-auto cursor-pointer' onClick={() => handleDenuncia(denuncia.idDenuncia)}/></th>
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
        </div>
    )
}

export default ListadoDenuncias