import {useEffect, useState} from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'

const DenunciaDetalle = () => {

    const [denunciaDetalle, setDenunciaDetalle] = useState({})    
    const [delito, setDelito] = useState()
    const { idDenuncia } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        fetch(`https://srv555183.hstgr.cloud:3005/api/denuncia/denuncia/${idDenuncia}`, {
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



    return (
        <div className='flex flex-col lg:h-heightfull w-full px-8 pt-8 pb-4 text-sm'>
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
                        delito ?
                            <p className='pl-2'></p>
                            :
                            <p className='pl-2'>{denunciaDetalle?.submodalidad?.tipoDelito?.descripcion}</p>
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
                    <p className='pl-2'>{denunciaDetalle.comisariaId}</p>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <p className='font-bold'>Fiscalia:</p>
                    <p className='pl-2'>{denunciaDetalle.fiscalia}</p>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 uppercase p-4 gap-3 text-sm pt-5 mt-4 border-2 border-black rounded-xl'>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Submodalidad:</p>
                    <p className='pl-2'>{denunciaDetalle?.submodalidad?.descripcion}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <label className='font-bold'>Modalidad:</label>
                    <p className='pl-2'>{denunciaDetalle?.submodalidad?.modalidad?.descripcion}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <label className='font-bold'>Especialidad:</label>
                    <p className='pl-2'>{denunciaDetalle?.especializacion?.descripcion}</p>

                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Aprehendido:</p>
                    {
                        denunciaDetalle.aprehendido === 1 ? 
                        <p className='pl-2'>SI</p> : 
                        <p className='pl-2'>NO</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Medida:</p>
                    {
                        denunciaDetalle.medida === 1 ? 
                        <p className='pl-2'>SI</p> : 
                        <p className='pl-2'>NO</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Movilidad:</p>
                    <p className='pl-2'>{denunciaDetalle?.movilidad?.descripcion}</p>                    
                </div>
                <div className='flex flex-row items-center'>
                    <label className='font-bold'>Autor:</label>
                    <p className='pl-2'>{denunciaDetalle?.Autor?.descripcion}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Para seguro:</p>
                    {
                        denunciaDetalle.seguro === 1 ? 
                        <p className='pl-2'>SI</p> : 
                        <p className='pl-2'>NO</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p htmlFor="" className='font-bold'>Arma:</p>
                    <p className='pl-2'>{denunciaDetalle?.tipoArma?.descripcion}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <label className='font-bold'>Victima:</label>
                    {
                        denunciaDetalle.victima === 1 ? 
                        <p className='pl-2'>SI</p> : 
                        <p className='pl-2'>NO</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Elementos sustraidos:</p>
                    <p className='pl-2'>{denunciaDetalle.elementoSustraido}</p>
                </div>
            </div>
            <div className='flex flex-row justify-center lg:justify-end lg:flex-col lg:items-end py-4 gap-2'>
                <NavLink to={`/sigs/denuncias/clasificacion/${denunciaDetalle.idDenuncia}`} className='text-center px-4 py-1 bg-black rounded-2xl text-white w-32'>Modificar</NavLink>
                <button className='px-4 py-1 bg-black/50 rounded-2xl text-white w-32' disabled>Imprimir</button>
                <NavLink to={'/sigs/denuncias/listado'} className='px-4 py-1 bg-black rounded-2xl text-white w-32'>Volver a listado</NavLink>
            </div>
        </div>
    )
}

export default DenunciaDetalle