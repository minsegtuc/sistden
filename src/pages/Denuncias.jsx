import { useState, useEffect, useContext } from 'react'

import { BiPlusCircle } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ContextConfig } from '../context/ContextConfig';
import Cookies from 'js-cookie';

const Denuncias = () => {

    const [denunciasSC, setDenunciasSC] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [denunciaEnVista, setDenunciaEnVista] = useState(null)
    const { handleSession, HOST, handleDenuncia, user, socket } = useContext(ContextConfig)
    const navigate = useNavigate();

    const handleClasificador = async (denuncia) => {
        socket.emit('view_denuncia', {
            denunciaId: denuncia.id,
            userId: user.nombre, 
        });

        handleDenuncia(denuncia);
        navigate(`/sigs/denuncias/clasificacion`);
    }

    const handleRegional = (e) => {
        const reg = e.target.value;
        setIsLoading(true)
        fetch(`${HOST}/api/denuncia/regional`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ reg })
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
                    if (denuncia.isClassificated === 0) {
                        const newFecha = (denuncia.fechaDelito).split('-')
                        denunciasFilter.push({ ...denuncia, fechaDelito: newFecha[2] + '/' + newFecha[1] + '/' + newFecha[0] })
                    }
                }
                )

                setDenunciasSC(denunciasFilter)
                setIsLoading(false)
            })
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

    useEffect(() => {
        socket.connect();

        socket.on('denuncia_en_vista', ({ denunciaId, userId }) => {
            setDenunciasSC((prevDenuncias) =>
                prevDenuncias.map((denuncia) =>
                    denuncia.idDenuncia === denunciaId
                        ? { ...denuncia, usuarioEnVista: userId }
                        : denuncia
                )
            );
        });

        return () => {
            socket.disconnect();
        };
    })

    useEffect(() => {
        console.log(denunciasSC)
    },[denunciasSC])

    return (
        <div className='flex flex-col md:h-heightfull w-full px-8 pt-8 text-sm overflow-scroll'>
            <div className='w-full flex items-center justify-center flex-col md:justify-between gap-4'>
                <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center'>
                    <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Gestion de denuncias</h2>
                    <button className='w-48 h-12 text-white rounded-md text-sm px-4 py-1 mt-3 md:mt-0 bg-[#005CA2] flex flex-row items-center justify-center md:justify-between md:ml-auto'>
                        <NavLink to={'/sigs/denuncias/cargar'} className='flex flex-row items-center justify-between w-full'>
                            <BiPlusCircle className='text-4xl' />
                            <span className='text-center'>Cargar Denuncias</span>
                        </NavLink>
                    </button>
                </div>
                <div className='flex flex-row w-auto mr-auto justify-start items-center'>
                    <h2 className='w-full pr-2'>Filtros: </h2>
                    <select name="regional" id="" onChange={handleRegional}>
                        <option value="">Seleccione una regional</option>
                        <option value="1">URC</option>
                        <option value="2">URN</option>
                        <option value="3">URS</option>
                        <option value="4">URO</option>
                        <option value="5">URE</option>
                    </select>
                </div>
            </div>
            {
                isLoading ? (<span className="relative flex h-32 w-32 mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005CA2] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-32 w-32 bg-[#005CA2]"></span>
                </span>) :

                    <div className='md:h-full py-4'>
                        {
                            denunciasSC.length > 0 ?
                                (
                                    <table className='w-full'>
                                        <thead className='w-full'>
                                            <tr className='w-full flex text-center justify-center border-b-2 border-black'>
                                                <th className='w-4/12 lg:w-2/12 text-center lg:text-left'>N° DENUNCIA</th>
                                                <th className='w-3/12 lg:block text-center hidden'>Delito</th>
                                                <th className='w-4/12 lg:w-3/12 text-center'>Comisaria</th>
                                                <th className='w-2/12 lg:block hidden text-center'>Fecha</th>
                                                <th className='w-4/12 lg:w-2/12 text-center'>Acciones</th>
                                                <th className='w-4/12 lg:w-2/12 text-center'>Usuario</th>
                                            </tr>
                                        </thead>
                                        <tbody className='w-full'>
                                            {
                                                denunciasSC.map(denuncia => (
                                                    <tr className='w-full flex text-center justify-center border-b-2 items-center min-h-12' key={denuncia.idDenuncia}>
                                                        <td className='w-4/12 lg:w-2/12 text-center lg:text-left'>{denuncia.idDenuncia}</td>
                                                        <td className='w-3/12 lg:block hidden text-center'>{denuncia?.tipoDelito?.descripcion ? denuncia?.tipoDelito?.descripcion : 'No registrado en base de datos'}</td>
                                                        <td className='w-4/12 lg:w-3/12 text-center'>{denuncia?.Comisarium?.descripcion ? denuncia?.Comisarium?.descripcion : 'No registrada en base de datos'}</td>
                                                        <td className='w-2/12 text-center lg:block hidden'>{denuncia.fechaDelito}</td>
                                                        <td className='w-4/12 lg:w-2/12 text-center'><button onClick={() => handleClasificador(denuncia.idDenuncia)}>Clasificar</button></td>
                                                        <td className='w-2/12 text-center lg:block hidden'>{denuncia.usuarioEnVista || '-'}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                )
                                :
                                (
                                    <div className='bg-[#005CA2] text-white rounded-md md:w-96 text-center py-16 mx-auto font-semibold shadow-md shadow-[#4274e2]/50'>La base de datos se encuentra sin denuncias para clasificar</div>
                                )
                        }

                    </div>
            }
        </div>
    )
}

export default Denuncias