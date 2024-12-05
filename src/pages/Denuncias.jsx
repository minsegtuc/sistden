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

    const { handleSession, HOST, handleDenuncia, user, socket, handleRegionalGlobal, regional, cookie, setCookie, setRelato } = useContext(ContextConfig)
    const navigate = useNavigate();

    const fetchWorking = async () => {
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
            setRelato(null)

            const datosMPF = {
                url: `https://mpftucuman.com.ar/noteweb3.0/denview.php?id=${denuncia !== undefined ? (denuncia).match(/\d+/)[0] : ''}`,
                cookie: sessionStorage.getItem('cookiemp')
            }

            // try {
            //     const fetchScrapping = await fetch(`${HOST}/api/scrap/scrapping`, {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         credentials: 'include',
            //         body: JSON.stringify({ datosMPF })
            //     })

            //     const res = await fetchScrapping.json()

            //     // console.log(res)
            //     // const dataText = String(res[0] + "" + res[1]);

            //     // let inicio = "RELATO DEL HECHO";
            //     // let fin = "DATOS TESTIGO/S";

            //     // let inicioIndex = dataText.indexOf(inicio);
            //     // let finIndex = dataText.indexOf(fin);

            //     // if (inicioIndex !== -1 && finIndex !== -1) {
            //     //     const resultado = dataText.substring(inicioIndex + inicio.length, finIndex).trim();
            //     //     setRelato(resultado)
            //     // } else {
            //     //     console.log("No se encontró el texto entre los patrones.");
            //     // }

            //     setRelato(res.texto)
            // } catch (error) {
            //     console.log("Error en el scrapping: ", error)
            // }

            handleDenuncia(denuncia);

            //console.log("NAVEGANDO A CLASIFICACION")

            navigate(`/sgd/denuncias/clasificacion`);
        } catch (error) {
            console.log("Error handleClasificador: " , error)
        }
    }

    const handleRegional = (e) => {
        //console.log("Ingreso a regional")
        const reg = e.target.value;
        handleRegionalGlobal(reg)
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
                fetchWorking()
                setIsLoading(false)
            })
    }

    useEffect(() => {
        //console.log("Conecte el socket en denuncias")
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

        return () => {
            // socket.disconnect();
        };
    }, [denunciasSC])

    useEffect(() => {
        // setRelato(null)
        setIsLoading(true)
        if (regional) {
            handleRegional({ target: { value: regional } })
        } else {
            fetch(`${HOST}/api/denuncia/denuncia/0`, {
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
                    const denunciasFilter = data.filter(denuncia => denuncia.isClassificated === 0);
                    const formattedDenuncias = denunciasFilter.map(denuncia => {
                        const newFecha = denuncia.fechaDelito.split('-');
                        return { ...denuncia, fechaDelito: `${newFecha[2]}/${newFecha[1]}/${newFecha[0]}` };
                    });

                    fetchWorking()
                    setDenunciasSC(formattedDenuncias)
                    setIsLoading(false)
                })
        }
    }, [])

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
                    <button className='w-48 h-12 text-white rounded-md text-sm px-4 py-1 mt-3 md:mt-0 bg-[#005CA2] flex flex-row items-center justify-center md:justify-between md:ml-auto'>
                        <NavLink to={'/sgd/denuncias/cargar'} className='flex flex-row items-center justify-between w-full'>
                            <BiPlusCircle className='text-4xl' />
                            <span className='text-center'>Cargar Denuncias</span>
                        </NavLink>
                    </button>
                </div>
                <div className='flex flex-col lg:flex-row w-auto lg:mr-auto justify-start items-center'>
                    <div className='w-full flex flex-row justify-center items-center mb-2 lg:mb-0'>
                        <h2 className='lg:w-full lg:pr-2'>Filtros: </h2>
                        <select className='rounded-xl mr-2' name="regional" id="" onChange={handleRegional} value={regional || ''}>
                            <option value="">Seleccione una regional</option>
                            <option value="1">URC</option>
                            <option value="2">URN</option>
                            <option value="3">URS</option>
                            <option value="4">URO</option>
                            <option value="5">URE</option>
                        </select>
                    </div>
                    <div className='w-full flex flex-row justify-center items-center'>
                        <label htmlFor="" className='mr-2 pl-4 lg:border-l-2 border-black'>Cookie</label>
                        <input className='h-6 border-2 rounded-xl border-[#757873] px-2' onChange={(e) => setCookie(e.target.value)} value={cookie} />
                        <button className='ml-4 px-4 bg-[#005CA2] text-white rounded-3xl' onClick={handleCookie}>Guardar</button>
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
                                                    <tr className='w-full flex text-center justify-center border-b-2 items-center min-h-12 hover:bg-[#005cA2]/20' key={denuncia.idDenuncia}>
                                                        <td className='w-4/12 lg:w-2/12 text-center lg:text-left'>{denuncia.idDenuncia}</td>
                                                        <td className='w-3/12 lg:block hidden text-center'>{denuncia?.tipoDelito?.descripcion ? denuncia?.tipoDelito?.descripcion : 'No registrado en base de datos'}</td>
                                                        <td className='w-4/12 lg:w-3/12 text-center'>{denuncia?.Comisarium?.descripcion ? denuncia?.Comisarium?.descripcion : 'No registrada en base de datos'}</td>
                                                        <td className='w-2/12 text-center lg:block hidden'>{denuncia.fechaDelito}</td>
                                                        <td className={`w-4/12 lg:w-2/12 text-center font-bold ${denuncia.trabajando === null ? 'text-[#005CA2]' : 'text-slate-400'}`}><button onClick={() => handleClasificador(denuncia.idDenuncia)} disabled={denuncia.trabajando != null}>Clasificar</button></td>
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