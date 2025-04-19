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
    const [loadingRow, setLoadingRow] = useState(null);
    const [comisarias, setComisarias] = useState([])

    const { handleSession, HOST, handleDenuncia, user, socket, handleRegionalGlobal, regional, cookie, setCookie, setRelato, propiedad, interes, handlePropiedadGlobal, handleInteresGlobal, handleComisariaGlobal, comisaria, handleDenunciasIds } = useContext(ContextConfig)
    const navigate = useNavigate();

    const fetchWorking = async () => {
        //console.log("Ingreso al fetchWorking")
        try {
            const response = await fetch(`${HOST}/api/working/workings`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            })

            const denunciasOcupadas = await response.json()

            setDenunciasSC((prevDenuncias) =>
                prevDenuncias.map((denuncia) => {
                    const ocupada = denunciasOcupadas.find(
                        (occupied) => occupied.idDenunciaWork === denuncia.idDenuncia
                    );

                    return ocupada
                        ? { ...denuncia, trabajando: ocupada.usuario }
                        : denuncia;
                })
            );
        } catch (error) {
            console.log(error)
        }
    }

    const handleClasificador = async (denuncia) => {
        try {
            socket.emit('view_denuncia', {
                denunciaId: denuncia,
                userId: user.nombre,
            });

            //console.log('Denuncia desde denuncias:', denuncia)
            setLoadingRow(denuncia);
            setRelato(null)

            const datosMPF = {
                url: `https://noteweb.mpftucuman.gob.ar/noteweb3.0/denview.php?id=${denuncia !== undefined ? (denuncia).match(/\d+/)[0] : ''}`,
                cookie: sessionStorage.getItem('cookiemp')
            }

            try {
                const fetchScrapping = await fetch(`${HOST}/api/scrap/scrapping`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ datosMPF })
                })

                const res = await fetchScrapping.json()

                const inicio = "RELATO DEL HECHO";
                let relatoLimpio = res.texto.startsWith(inicio)
                    ? res.texto.substring(inicio.length).trim()
                    : res.texto;

                setRelato(relatoLimpio);
            } catch (error) {
                console.log("Error en el scrapping: ", error)
            }

            handleDenuncia(denuncia);

            //console.log("NAVEGANDO A CLASIFICACION")

            navigate(`/sgd/denuncias/clasificacion`);
        } catch (error) {
            console.log("Error handleClasificador: ", error)
        } finally {
            setLoadingRow(null); // Desactiva la animación solo para esa fila
        }
    }

    const handleFiltros = () => {
        const int = interes ? 1 : 0;
        const prop = propiedad ? 1 : 0;

        handleRegionalGlobal(regional)
        handlePropiedadGlobal(propiedad)
        handleInteresGlobal(interes)
        handleComisariaGlobal(comisaria)

        setIsLoading(true)
        fetch(`${HOST}/api/denuncia/regional`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ regional, interes: int, propiedad: prop, comisaria })
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
                const denunciasIds = []
                data.denuncias.map(denuncia => {
                    if (denuncia.isClassificated === 0 || denuncia.isClassificated === 2) {
                        denunciasIds.push(denuncia.idDenuncia)
                        const newFecha = (denuncia.fechaDelito).split('-')
                        denunciasFilter.push({ ...denuncia, fechaDelito: newFecha[2] + '/' + newFecha[1] + '/' + newFecha[0] })
                    }
                }
                )

                setDenunciasSC(denunciasFilter)
                handleDenunciasIds(denunciasIds)
                fetchWorking()
                setIsLoading(false)
            })
    }

    const handleRegional = (value) => {
        handleRegionalGlobal(value)
    }

    const handlePropiedad = (checked) => {
        handlePropiedadGlobal(checked)
    }

    const handleInteres = (checked) => {
        handleInteresGlobal(checked)
    }

    const handleComisaria = (comisaria) => {
        //console.log(comisaria)
        handleComisariaGlobal(comisaria)
    }

    useEffect(() => {
        socket.connect();

        socket.on('denuncia_en_vista', ({ denunciaId, userId }) => {

            const denunciaComparar = decodeURIComponent(denunciaId)
            setDenunciasSC((prevDenuncias) => {
                const denunciaActualizada = prevDenuncias.map((denuncia) =>
                    denuncia.idDenuncia === denunciaComparar
                        ? { ...denuncia, trabajando: userId }
                        : denuncia
                );
                return denunciaActualizada;
            });
        });

        socket.on('denuncias_actualizadas', () => {
            const delay = Math.random() * 1000; // Genera un número aleatorio entre 1000 y 2000 ms
            setTimeout(() => {
                handleFiltros();
            }, delay);
        });

        return () => {
            socket.off('denuncia_en_vista');
            //socket.off('denuncias_actualizadas');
        };
    }, [denunciasSC])

    useEffect(() => {
        fetch(`${HOST}/api/comisaria/comisaria`, {
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
                setComisarias(data)
            })
    }, [])

    useEffect(() => {
        handleFiltros();
    }, [regional, propiedad, interes, comisaria]);

    const handleCookie = () => {
        sessionStorage.setItem('cookiemp', cookie)
        Swal.fire({
            title: 'Cookie MPF cargado',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        setCookie('')
    }

    return (
        <div className='flex flex-col md:h-heightfull w-full px-8 pt-8 text-sm overflow-scroll'>
            <div className='w-full flex items-center justify-center flex-col md:justify-between gap-4'>
                <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center'>
                    <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Gestion de denuncias</h2>
                    <p className='text-xs text-left font-semibold pt-2 pl-4'>Cantidad de denuncias: {denunciasSC.length}</p>
                    <button className='w-48 h-12 text-white rounded-md text-sm px-4 py-1 mt-3 md:mt-0 bg-[#005CA2] flex flex-row items-center justify-center md:justify-between md:ml-auto'>
                        <NavLink to={'/sgd/denuncias/cargar'} className='flex flex-row items-center justify-between w-full'>
                            <BiPlusCircle className='text-4xl' />
                            <span className='text-center'>Cargar Denuncias</span>
                        </NavLink>
                    </button>
                </div>
                <div className='flex flex-col lg:flex-row w-auto justify-start items-center gap-2 mt-2 bg-gray-300 p-2 rounded-lg'>
                    <h2 className='font-semibold'>Filtros: </h2>
                    <div className='flex flex-row justify-center items-center mb-2 lg:mb-0'>
                        <select className='rounded-xl mr-2' name="regional" id="" onChange={(e) => handleRegional(e.target.value)} value={regional || ''}>
                            <option value="">Seleccione una regional</option>
                            <option value="1">URC</option>
                            <option value="2">URN</option>
                            <option value="3">URS</option>
                            <option value="4">URO</option>
                            <option value="5">URE</option>
                        </select>
                        <select className='rounded-xl mr-2 max-w-40' name="comisaria" id="" onChange={(e) => handleComisaria(e.target.value)} value={comisaria || ''}>
                            <option value="">Seleccione una comisaría</option>
                            {
                                comisarias.map(comisaria => (
                                    <option key={comisaria.idComisaria} value={comisaria.idComisaria}>{comisaria.descripcion}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='flex flex-row justify-center items-center'>
                        <label htmlFor="" className='mr-2 pl-4 lg:border-l-2 border-black'>Cookie</label>
                        <input className='h-6 border-2 rounded-xl border-[#757873] px-2' onChange={(e) => setCookie(e.target.value)} value={cookie} />
                        <button className='ml-4 px-4 bg-[#005CA2] text-white rounded-3xl' onClick={handleCookie}>Guardar</button>
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
            </div>
            {
                isLoading ? (<span className="relative flex h-32 w-32 mx-auto pt-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005CA2] opacity-75 pt-8"></span>
                    <span className="relative inline-flex rounded-full h-32 w-32 bg-[#005CA2] pt-8"></span>
                </span>) :

                    <div className='md:h-full py-4'>
                        {
                            denunciasSC.length > 0 ?
                                (
                                    <table className='w-full'>
                                        <thead className='w-full'>
                                            <tr className='w-full flex text-center justify-center border-b-2 border-black'>
                                                <th className='w-4/12 lg:w-1/12 text-center lg:text-left'>ID</th>
                                                <th className='w-4/12 lg:w-3/12 text-center lg:text-left'>N° DENUNCIA</th>
                                                <th className='w-3/12 lg:block text-center hidden'>Delito</th>
                                                <th className='w-4/12 lg:w-3/12 text-center'>Comisaria</th>
                                                <th className='w-2/12 lg:block hidden text-center'>Fecha</th>
                                                <th className='w-4/12 lg:w-2/12 text-center'>Acciones</th>
                                                <th className='w-4/12 lg:w-2/12 text-center'>Usuario</th>
                                            </tr>
                                        </thead>
                                        <tbody className='w-full'>
                                            {
                                                denunciasSC.map((denuncia, index) => (
                                                    <tr className={`w-full flex text-center justify-center border-b-2 items-center min-h-12 hover:bg-[#005cA2]/20 ${loadingRow === denuncia.idDenuncia ? 'animate-pulse' : ''}`} key={denuncia.idDenuncia}>
                                                        <td className='w-4/12 lg:w-1/12 text-center lg:text-left'>{index + 1}</td>
                                                        <td className='w-4/12 lg:w-3/12 text-center lg:text-left'>{denuncia.idDenuncia}</td>
                                                        <td className='w-3/12 lg:block hidden text-center'>{denuncia?.tipoDelito?.descripcion ? denuncia?.tipoDelito?.descripcion : 'No registrado en base de datos'}</td>
                                                        <td className='w-4/12 lg:w-3/12 text-center'>{denuncia?.Comisarium?.descripcion ? denuncia?.Comisarium?.descripcion : 'No registrada en base de datos'}</td>
                                                        <td className='w-2/12 text-center lg:block hidden'>{denuncia.fechaDelito}</td>
                                                        <td className={`w-4/12 lg:w-2/12 text-center font-bold ${denuncia.trabajando === null ? 'text-[#005CA2]' : 'text-slate-400'}`}><button onClick={() => handleClasificador(denuncia.idDenuncia)} disabled={denuncia.trabajando != null} >Clasificar</button></td>
                                                        <td className='w-4/12 lg:w-2/12 text-center'>{denuncia.trabajando || '-'}</td>
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