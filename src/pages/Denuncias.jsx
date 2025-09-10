import { useState, useEffect, useContext } from 'react'

import { BiPlusCircle } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ContextConfig } from '../context/ContextConfig';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { RiRobot2Line } from "react-icons/ri";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import Cookies from 'js-cookie';
import { IoReload } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion"

const Denuncias = () => {

    const [denunciasSC, setDenunciasSC] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadingRow, setLoadingRow] = useState(null);
    const [comisarias, setComisarias] = useState([])
    const [regionales, setRegionales] = useState([])
    const [viewFiltros, setViewFiltros] = useState(true)


    const { handleSession, HOST, handleDenuncia, user, socket, handleRegionalGlobal, regional, cookie, setCookie, setRelato, propiedad, interes, handlePropiedadGlobal, handleInteresGlobal, handleComisariaGlobal, comisaria, handleDenunciasIds, handleIAGlobal, handleObservadaGlobal, IA, observada } = useContext(ContextConfig)
    const navigate = useNavigate();
    const mesActual = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const anioActual = new Date().getFullYear()
    const currentMonth = `${anioActual}-${mesActual}`;
    const [mesDenuncia, setMesDenuncia] = useState(currentMonth)

    const fetchWorking = async () => {
        // console.log("Ingreso a fetchWorking")
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

            setLoadingRow(denuncia);
            setRelato(null)

            handleDenuncia(denuncia);

            navigate(`/sgd/denuncias/clasificacion`);
        } catch (error) {
            console.log("Error handleClasificador: ", error)
        } finally {
            setLoadingRow(null);
        }
    }

    const handleFiltros = () => {
        const int = interes ? 1 : 0;
        const prop = propiedad ? 1 : 0;
        const obs = observada ? 1 : 0;
        const ia = IA ? 1 : 0;

        handleRegionalGlobal(regional)
        handlePropiedadGlobal(propiedad)
        handleInteresGlobal(interes)
        handleComisariaGlobal(comisaria)
        handleObservadaGlobal(observada)
        handleIAGlobal(IA)

        console.log("Filtros: " , regional, prop, int, comisaria, obs, ia)
        setIsLoading(true)
        fetch(`${HOST}/api/denuncia/regional`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ regional, interes: int, propiedad: prop, comisaria, mesDenuncia, IA: ia, observada: obs })
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

                console.log(data.denuncias)

                if ((data.comisarias.length === 0 || data.regionales.length === 0) && (data.denuncias.length > 0)) {
                    handleComisariaGlobal(null)
                    handleRegionalGlobal(null)
                }

                setComisarias(
                    data.comisarias.sort((a, b) => a.descripcion.localeCompare(b.descripcion))
                );

                setRegionales(
                    data.regionales.sort((a, b) => a.descripcion.localeCompare(b.descripcion))
                );

                const denunciasFilter = []
                const denunciasIds = []
                data.denuncias.map(denuncia => {
                    if (denuncia.isClassificated === 0 || denuncia.isClassificated === 2 || denuncia.isClassificated === 3) {
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

    const handlePropiedad = (checked) => {
        handlePropiedadGlobal(checked)
    }

    const handleIA = (checked) => {
        handleIAGlobal(checked)
    }

    const handleObservada = (checked) => {
        handleObservadaGlobal(checked)
    }

    const handleInteres = (checked) => {
        handleInteresGlobal(checked)
    }

    const handleRegional = (value) => {
        handleRegionalGlobal(value)
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
            handleFiltros()
        });

        return () => {
            socket.off('denuncia_en_vista');
            socket.off('denuncias_actualizadas');
        };
    }, [denunciasSC])

    useEffect(() => {
        handleFiltros();
    }, [regional, propiedad, interes, comisaria, mesDenuncia, IA, observada]);

    const handleCookie = () => {
        sessionStorage.setItem('cookiemp', cookie)
        Swal.fire({
            title: 'Cookie MPF cargado',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        })
        setCookie('')
    }

    const handleViewFiltros = (estado) => {
        console.log("Estado: ", estado)
        setViewFiltros(estado)
    }

    // useEffect(() => {
    //     console.log(mesDenuncia)
    // }, [mesDenuncia])

    return (
        <div className='flex flex-col md:h-heightfull w-full px-8 pt-8 text-sm overflow-scroll'>
            <div className='w-full flex items-center justify-center flex-col md:justify-between gap-4'>
                <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center'>
                    <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Gestion de denuncias</h2>
                    <p className='text-xs text-left font-semibold pt-2 pl-4'>Cantidad de denuncias: {denunciasSC.length}</p>
                    <button className='w-44 h-8 text-white rounded-md text-sm px-4 py-1 mt-3 md:mt-0 bg-[#005CA2] flex flex-row items-center justify-center md:justify-between md:ml-auto'>
                        <NavLink to={'/sgd/denuncias/cargar'} className='flex flex-row items-center justify-between w-full'>
                            <BiPlusCircle className='text-2xl' />
                            <span className='text-center font-semibold'>Cargar Denuncias</span>
                        </NavLink>
                    </button>
                    <div className='flex flex-row justify-center items-center p-2'>
                        <button className='px-4 bg-[#005CA2] text-white rounded-md w-44 h-8 flex flex-row items-center justify-center' onClick={() => handleFiltros()}>
                            <IoReload className='text-xl' />
                            <span className='text-center font-semibold pl-2'>Recargar</span>
                        </button>
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row items-center md:min-w-[620px] min-w-[350px] bg-gray-200 rounded-lg'>
                    <div className='flex flex-col w-full'>
                        <div className={`flex justify-center items-center bg-gray-400 ${viewFiltros ? 'rounded-t-lg': 'rounded-lg'}`}>
                            <p className='font-semibold uppercase p-1'>Filtros</p>
                            {
                                viewFiltros ?
                                    <IoIosArrowUp onClick={() => handleViewFiltros(false)}></IoIosArrowUp>
                                    :
                                    <IoIosArrowDown onClick={() => handleViewFiltros(true)}></IoIosArrowDown>
                            }
                        </div>
                        <AnimatePresence>
                            {
                                viewFiltros && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="overflow-hidden"
                                    >
                                        <div className='flex flex-col md:flex-row justify-center items-center gap-2 p-2'>
                                            <select className='rounded-xl mr-2 min-w-[185px] max-w-[185px] px-1' name="regional" id="" onChange={(e) => handleRegional(e.target.value)} value={regional || ''}>
                                                <option value="">Seleccione una regional</option>
                                                {
                                                    regionales.map(regional => (
                                                        <option key={regional.idUnidadRegional} value={regional.idUnidadRegional}>{regional.descripcion}</option>
                                                    ))
                                                }
                                            </select>
                                            <select className='rounded-xl mr-2 min-w-[185px] max-w-[185px] px-1' name="comisaria" id="" onChange={(e) => handleComisaria(e.target.value)} value={comisaria || ''}>
                                                <option value="">Seleccione una comisaría</option>
                                                {
                                                    comisarias.map(comisaria => (
                                                        <option key={comisaria.idComisaria} value={comisaria.idComisaria}>{comisaria.descripcion}</option>
                                                    ))
                                                }
                                            </select>
                                            <input type="month" name="mesDenuncia" id="" className='rounded-xl mr-2 min-w-[185px] max-w-[185px] px-2' value={mesDenuncia} onChange={(e) => setMesDenuncia(e.target.value)} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-4 p-2 flex-wrap md:flex-nowrap'>
                                            <div className='flex flex-row justify-center items-center gap-2 md:p-2'>
                                                <p className='border-black'>IA</p>
                                                <input type="checkbox" name="ia" id="" onChange={(e) => handleIA(e.target.checked)} checked={!!IA} />
                                            </div>
                                            <div className='flex flex-row justify-center items-center gap-2 md:p-2'>
                                                <p className='border-black'>Observada</p>
                                                <input type="checkbox" name="observada" id="" onChange={(e) => handleObservada(e.target.checked)} checked={!!observada} />
                                            </div>
                                            <div className='flex flex-row justify-center items-center gap-2 md:p-2'>
                                                <p className='border-black text-center'>Delito contra la propiedad</p>
                                                <input type="checkbox" name="propiedad" id="" onChange={(e) => handlePropiedad(e.target.checked)} checked={!!propiedad} />
                                            </div>
                                            <div className='flex flex-row justify-center items-center gap-2'>
                                                <p className=' border-black'>Interes</p>
                                                <input type="checkbox" name="interes" id="" onChange={(e) => handleInteres(e.target.checked)} checked={!!interes} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            }
                        </AnimatePresence>
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
                                                <th className='w-4/12 lg:w-1/12 text-center lg:text-left hidden md:flex'>ID</th>
                                                <th className='w-4/12 lg:w-1/12 text-center lg:text-left'>Tipo</th>
                                                <th className='w-4/12 lg:w-3/12 text-center lg:text-left md:flex hidden'>N° DENUNCIA</th>
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
                                                        <td className='w-4/12 lg:w-1/12 text-center lg:text-left hidden md:flex'>{index + 1}</td>
                                                        <td className='w-4/12 lg:w-1/12 lg:block text-center justify-center flex'>
                                                            {
                                                                denuncia.isClassificated === 1 ? (<CiCircleCheck className='text-3xl pt-1 text-green-900' />)
                                                                    : denuncia.isClassificated === 2 ? <RiRobot2Line className='text-3xl pt-1 text-blue-900 ml-2' />
                                                                        : denuncia.isClassificated === 0 ? (<CiCircleRemove className='text-3xl pt-1 text-red-900 ml-1' />)
                                                                            : (<FaMagnifyingGlass className='text-2xl pt-1 text-yellow-500 ml-2' />)
                                                            }
                                                        </td>
                                                        <td className='w-4/12 lg:w-3/12 text-center lg:text-left md:flex hidden'>{denuncia.idDenuncia}</td>
                                                        <td className='w-3/12 lg:block hidden text-center'>{denuncia?.tipoDelito?.descripcion ? denuncia?.tipoDelito?.descripcion : 'No registrado en base de datos'}</td>
                                                        <td className='w-4/12 lg:w-3/12 text-center text-xs md:text-md'>{denuncia?.Comisarium?.descripcion ? denuncia?.Comisarium?.descripcion : 'No registrada en base de datos'}</td>
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