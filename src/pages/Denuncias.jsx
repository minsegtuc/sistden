import { useState, useEffect, useContext } from 'react'

import { BiPlusCircle } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ContextConfig } from '../context/ContextConfig';

const Denuncias = () => {

    const [denunciasSC, setDenunciasSC] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { handleSession, HOST, handleDenuncia } = useContext(ContextConfig)
    const navigate = useNavigate();

    const handleClasificador = (denuncia) => {
        handleDenuncia(denuncia)
        navigate(`/sigs/denuncias/clasificacion`);
    }

    useEffect(() => {
        setIsLoading(true)
        fetch(`${HOST}/api/denuncia/denuncia`, {
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
                    if (denuncia.isClassificated === 0) {
                        const newFecha = (denuncia.fechaDelito).split('-')
                        denunciasFilter.push({ ...denuncia, fechaDelito: newFecha[2] + '/' + newFecha[1] + '/' + newFecha[0] })
                    }
                }
                )

                setDenunciasSC(denunciasFilter)
                setIsLoading(false)
            })
    }, [])


    return (
        <div className='flex flex-col md:h-heightfull w-full px-8 pt-8 text-sm'>
            <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Gestion de denuncias</h2>
            <div className='md:h-1/4 w-full flex items-center flex-row md:justify-between pt-2 gap-4'>
                <div className='w-1/6 flex justify-center md:justify-start items-center gap-20 md:gap-0'>
                    <button className='md:w-48 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#002649] flex flex-row items-center justify-between'>
                        <NavLink to={'/sigs/denuncias/cargar'} className='flex flex-row items-center justify-between w-full'>
                            <BiPlusCircle className='text-4xl' />
                            <span className='md:block text-center hidden'>Cargar Denuncias</span>
                        </NavLink>
                    </button>
                </div>
            </div>
            {
                isLoading ? (<span className="relative flex h-32 w-32 mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#345071] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-32 w-32 bg-[#345071]"></span>
                </span>) :

                    <div className='md:h-full py-4'>
                        {
                            denunciasSC.length > 0 ?
                                (
                                    <table className='w-full'>
                                        <thead className='border-b-2 border-black w-full'>
                                            <tr className='w-full flex text-center'>
                                                <th className='w-2/12 text-left'>N° DENUNCIA</th>
                                                <th className='w-3/12'>Delito</th>
                                                <th className='w-3/12'>Comisaria</th>
                                                <th className='w-2/12'>Fecha</th>
                                                <th className='w-2/12'>Acciones</th>
                                            </tr>
                                        </thead>
                                        {
                                            denunciasSC.map(denuncia => (
                                                <tr className='w-full flex text-center' key={denuncia.idDenuncia}>
                                                    <td className='w-2/12 text-left'>{denuncia.idDenuncia}</td>
                                                    <td className='w-3/12'>{denuncia?.submodalidad?.tipoDelito?.descripcion ? denuncia?.submodalidad?.tipoDelito?.descripcion : '-'}</td>
                                                    <td className='w-3/12'>{denuncia?.Comisarium?.descripcion ? denuncia?.Comisarium?.descripcion : 'No registrada en base de datos'}</td>
                                                    <td className='w-2/12'>{denuncia.fechaDelito}</td>
                                                    <td className='w-2/12'><button onClick={() => handleClasificador(denuncia.idDenuncia)}>Clasificar</button></td>
                                                </tr>
                                            ))
                                        }
                                    </table>
                                )
                                :
                                (
                                    <div className='bg-[#345071] text-white rounded-md w-96 text-center py-16 mx-auto font-semibold shadow-md shadow-[#4274e2]/50'>La base de datos se encuentra sin denuncias para clasificar</div>
                                )
                        }

                    </div>
            }
        </div>
    )
}

export default Denuncias