import { useEffect, useState, useContext } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { ContextConfig } from '../context/ContextConfig'
import Cookies from 'js-cookie';

const DenunciaDetalle = () => {

    const [denunciaDetalle, setDenunciaDetalle] = useState({})
    const [loadingDenucia, setLoadingDenucia] = useState(false)
    const { HOST, denuncia, setRelato, handleDenuncia } = useContext(ContextConfig)

    const denunciaCookie = encodeURIComponent(Cookies.get('denuncia'));
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${HOST}/api/denuncia/${denuncia != null ? denuncia : denunciaCookie}`, {
            method: 'GET',
            headers: {
                'Content-type': 'aplication/json'
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
            }
            )
            .then(data => {
                const newFechaDelito = (data.fechaDelito).split('-')
                const newFechaDenuncia = (data.fechaDenuncia).split('-')

                setDenunciaDetalle({
                    ...data,
                    fechaDenuncia: newFechaDenuncia[2] + '/' + newFechaDenuncia[1] + '/' + newFechaDenuncia[0],
                    fechaDelito: newFechaDelito[2] + '/' + newFechaDelito[1] + '/' + newFechaDelito[0]
                })
            })
            .catch(err => console.log(err))
    }, [])

    const handleClasificador = async (denuncia) => {
        try {
            setLoadingDenucia(true)
            setRelato(null)
            // console.log("DENUNCIA: ", denuncia)

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
            setLoadingDenucia(false)
        }
    }

    return (
        <div className='flex flex-col lg:h-heightfull w-full px-8 pt-8 pb-4 text-sm overflow-scroll'>
            <div className='p-4 border-2 border-black rounded-xl grid grid-cols-1 lg:grid-cols-3 uppercase gap-3'>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>N° de denuncia (sumario):</p>
                    <p className='pl-2'>{denunciaDetalle.idDenuncia}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>DNI denunciante:</p>
                    {
                        denunciaDetalle.dniDenunciante != null ?
                            <p className='pl-2'>{denunciaDetalle.dniDenunciante}</p>
                            :
                            <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Fecha denuncia:</p>
                    <p className='pl-2'>{denunciaDetalle.fechaDenuncia}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Delito: </p>
                    {
                        denunciaDetalle?.tipoDelito?.descripcion === null ?
                            <p className='pl-2'>No registrado en base de datos</p>
                            :
                            <p className='pl-2'>{denunciaDetalle?.tipoDelito?.descripcion}</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Fecha del hecho:</p>
                    <p className='pl-2'>{denunciaDetalle.fechaDelito}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Hora del hecho:</p>
                    <p className='pl-2'>{denunciaDetalle.horaDelito}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Lugar del hecho:</p>
                    <p className='pl-2'>{denunciaDetalle?.Ubicacion?.domicilio}</p>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <p className='font-bold'>Localidad:</p>
                    <p className='pl-2'>{denunciaDetalle?.Ubicacion?.Localidad?.descripcion}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Comisaria:</p>
                    <p className='pl-2'>{denunciaDetalle?.Comisarium?.descripcion ? denunciaDetalle?.Comisarium?.descripcion : '-'}</p>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <p className='font-bold'>Fiscalia:</p>
                    <p className='pl-2'>{denunciaDetalle.fiscalia}</p>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 uppercase p-4 gap-3 text-sm pt-5 mt-4 border-2 border-black rounded-xl'>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Submodalidad:</p>
                    {
                        denunciaDetalle?.submodalidad?.descripcion ?
                            <p className='pl-2'>{denunciaDetalle?.submodalidad?.descripcion}</p> :
                            <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Modalidad:</p>
                    {
                        denunciaDetalle?.submodalidad?.modalidad?.descripcion ?
                            <p className='pl-2'>{denunciaDetalle?.submodalidad?.modalidad?.descripcion}</p> :
                            <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Especialidad:</p>
                    {
                        denunciaDetalle?.especializacion?.descripcion ?
                            <p className='pl-2'>{denunciaDetalle?.especializacion?.descripcion}</p> :
                            <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Aprehendido:</p>
                    {
                        denunciaDetalle.aprehendido === 1 ?
                            <p className='pl-2'>SI</p> :
                            denunciaDetalle.aprehendido === 0 ?
                                <p className='pl-2'>NO</p> : <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Medida:</p>
                    {
                        denunciaDetalle.medida === 1 ?
                            <p className='pl-2'>SI</p> :
                            denunciaDetalle.medida === 0 ?
                                <p className='pl-2'>NO</p> : <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Movilidad:</p>
                    {
                        denunciaDetalle?.movilidad?.descripcion ?
                            <p className='pl-2'>{denunciaDetalle?.movilidad?.descripcion}</p> :
                            <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Autor:</p>
                    {
                        denunciaDetalle?.Autor?.descripcion ?
                            <p className='pl-2'>{denunciaDetalle?.Autor?.descripcion}</p> :
                            <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Para seguro:</p>
                    {
                        denunciaDetalle.seguro === 1 ?
                            <p className='pl-2'>SI</p> :
                            denunciaDetalle.seguro === 0 ?
                                <p className='pl-2'>NO</p> : <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p htmlFor="" className='font-bold'>Arma:</p>
                    {
                        denunciaDetalle?.tipoArma?.descripcion ?
                            <p className='pl-2'>{denunciaDetalle?.tipoArma?.descripcion}</p> :
                            <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <label className='font-bold'>Victima:</label>
                    {
                        denunciaDetalle.victima === 1 ?
                            <p className='pl-2'>SI</p> :
                            denunciaDetalle.victima === 0 ?
                                <p className='pl-2'>NO</p> : <p className='pl-2'>-</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Elementos sustraidos:</p>
                    {
                        denunciaDetalle.elementoSustraido ?
                            <p className='pl-2'>{denunciaDetalle.elementoSustraido}</p> :
                            <p className='pl-2'>-</p>
                    }
                </div>
            </div>
            <div className='flex flex-row justify-center lg:justify-end lg:flex-col lg:items-end py-4 gap-2'>
                <button className={`text-center px-4 py-1 bg-black rounded-2xl text-white w-32 ${loadingDenucia ? 'animate-pulse' : ''}`} onClick={() => handleClasificador(denunciaDetalle.idDenuncia)}>Modificar</button>
                <button className='px-4 py-1 bg-black/50 rounded-2xl text-white w-32' disabled>Imprimir</button>
                <NavLink to={'/sgd/denuncias/listado'} className='px-4 py-1 bg-black rounded-2xl text-white w-32'>Volver a listado</NavLink>
            </div>
        </div>
    )
}

export default DenunciaDetalle