import { useEffect, useState, useContext } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ContextConfig } from '../context/ContextConfig';

const Clasificacion = () => {

    const navigate = useNavigate()

    const { handleSession } = useContext(ContextConfig)

    //OPTIONS
    const [autor, setAutor] = useState([])
    const [subModalidad, setSubModalidad] = useState([])
    const [tipoDelito, setTipoDelito] = useState([])
    const [especializacion, setEspecializacion] = useState([])
    const [movilidad, setMovilidad] = useState([])
    const [tipoArma, setTipoArma] = useState([])
    const [modalidad, setModalidad] = useState([])
    const [modalidadId, setModalidadId] = useState(null)


    const [delito, setDelito] = useState()
    const [denunciaInfo, setDenunciaInfo] = useState({})
    const { idDenuncia } = useParams()

    const [formValues, setFormValues] = useState({
        especializacionId: denunciaInfo?.especializacionId || '',
        submodalidadId: denunciaInfo?.submodalidadId || '',
        autorId: denunciaInfo?.autorId || '',
        modalidadId: denunciaInfo?.submodalidad?.modalidad?.idModalidad || '',
        movilidadId: denunciaInfo?.movilidad?.idMovilidad || '',
        aprehendido: denunciaInfo?.aprehendido || '',
        medida: denunciaInfo?.medida || '',
        seguro: denunciaInfo?.seguro !== undefined ? String(denunciaInfo.seguro) : '',
        elementoSustraido: denunciaInfo?.elementoSustraido || '',
        tipoArmaId: denunciaInfo?.tipoArmaId || '',
        victima: denunciaInfo?.victima || '',
        interes: denunciaInfo?.interes || (idDenuncia.charAt(0) === 'A' ? "0" : "1") || '',
        latitud: denunciaInfo?.Ubicacion?.latitud || '',
        longitud: denunciaInfo?.Ubicacion?.longitud || ''
    });

    useEffect(() => {
        fetch(`https://srv555183.hstgr.cloud:3005/api/denuncia/denuncia/${idDenuncia}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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

                setDenunciaInfo({
                    ...data,
                    fechaDenuncia: newFechaDenuncia[2] + '/' + newFechaDenuncia[1] + '/' + newFechaDenuncia[0],
                    fechaDelito: newFechaDelito[2] + '/' + newFechaDelito[1] + '/' + newFechaDelito[0]
                })
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [autor, subModalidad, tipoDelito, especializacion, movilidad, tipoArma, modalidad] = await Promise.all([
                    fetch('https://srv555183.hstgr.cloud:3005/api/autor/autor', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch('https://srv555183.hstgr.cloud:3005/api/submodalidad/submodalidad', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch('https://srv555183.hstgr.cloud:3005/api/tipoDelito/tipoDelito', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch('https://srv555183.hstgr.cloud:3005/api/especializacion/especializacion', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch('https://srv555183.hstgr.cloud:3005/api/movilidad/movilidad', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch('https://srv555183.hstgr.cloud:3005/api/tipoArma/tipoArma', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch('https://srv555183.hstgr.cloud:3005/api/modalidad/modalidad', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                ])

                const data1 = await autor.json()
                const data2 = await subModalidad.json()
                const data3 = await tipoDelito.json()
                const data4 = await especializacion.json()
                const data5 = await movilidad.json()
                const data6 = await tipoArma.json()
                const data7 = await modalidad.json()

                setAutor(data1)
                setSubModalidad(data2)
                setTipoDelito(data3)
                setEspecializacion(data4)
                setMovilidad(data5)
                setTipoArma(data6)
                setModalidad(data7)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        if (name === 'seguro') {
            if (value === "1") {
                setFormValues(prevFormValues => ({
                    ...prevFormValues,
                    seguro: value,
                    interes: "0"
                }));
            } else {
                if (idDenuncia.charAt(0) === 'A') {
                    setFormValues(prevFormValues => ({
                        ...prevFormValues,
                        seguro: value,
                        interes: "0"
                    }));
                } else {
                    setFormValues(prevFormValues => ({
                        ...prevFormValues,
                        seguro: value,
                        interes: "1"
                    }));
                }
            }
        } else {
            setFormValues(prevFormValues => ({
                ...prevFormValues,
                [name]: value
            }));
        }
    }

    const handleModalidad = (e) => {
        if (e != null) {
            fetch(`https://srv555183.hstgr.cloud:3005/api/modalidad/modalidad/${e}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).then(res => res.json())
                .then(data => {
                    setFormValues(prevFormValues => ({
                        ...prevFormValues,
                        modalidadId: data.idModalidad
                    }))
                    setModalidadId(data.idModalidad)
                })
        }
    }

    const saveDenuncia = () => {

        const denunciaEnviar = {
            submodalidadId: parseInt(formValues.submodalidadId),
            modalidadId: parseInt(formValues.modalidadId),
            especializacionId: parseInt(formValues.especializacionId),
            movilidadId: parseInt(formValues.movilidadId),
            autorId: parseInt(formValues.autorId),
            seguro: parseInt(formValues.seguro),
            tipoArmaId: parseInt(formValues.tipoArmaId),
            victima: parseInt(formValues.victima),
            elementoSustraido: formValues.elementoSustraido,
            interes: parseInt(formValues.interes),
            dniDenunciante: null,
            isClassificated: 1
        }

        const ubicacionEnviar = {
            latitud: parseInt(formValues.latitud),
            longitud: parseInt(formValues.longitud)
        }

        console.log(denunciaEnviar)

        const propiedadesConValorInvalido = Object.entries(denunciaEnviar).filter(
            ([key, valor]) => {
                const esNumerico = typeof valor === 'number';
                return (esNumerico && isNaN(valor)) || valor === null;
            }
        );

        if (propiedadesConValorInvalido.length > 1) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Complete todos los campos para clasificar la denuncia"
            });
        } else {
            fetch(`https://srv555183.hstgr.cloud:3005/api/ubicacion/ubicacion/${denunciaInfo?.Ubicacion?.idUbicacion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(ubicacionEnviar)
            }).then(res => {
                if (res.status === 200) {
                    fetch(`https://srv555183.hstgr.cloud:3005/api/denuncia/denuncia/${idDenuncia}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(denunciaEnviar)
                    }).then(res => {
                        if (res.status === 200) {
                            Swal.fire({
                                icon: "success",
                                title: "Denuncia clasificada",
                                text: "La denuncia se clasifico y se encuentra en la base de datos",
                                confirmButtonText: 'Aceptar'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate('/sigs/denuncias/listado')
                                }
                            })
                            return res.json();
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
                    }).catch(err => console.log(err))
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
            }).catch(err => console.log(err))

        }

    }

    useEffect(() => {
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            especializacionId: denunciaInfo?.especializacionId || '',
            submodalidadId: denunciaInfo?.submodalidadId || '',
            modalidadId: denunciaInfo?.submodalidad?.modalidad?.idModalidad || '',
            autorId: denunciaInfo?.autorId || '',
            movilidadId: denunciaInfo?.movilidad?.idMovilidad || '',
            aprehendido: denunciaInfo?.aprehendido || '',
            medida: denunciaInfo?.medida || '',
            seguro: denunciaInfo?.seguro !== undefined ? String(denunciaInfo.seguro) : '',
            elementoSustraido: denunciaInfo?.elementoSustraido || '',
            tipoArmaId: denunciaInfo?.tipoArmaId || '',
            victima: denunciaInfo?.victima || '',
            interes: denunciaInfo?.interes || (idDenuncia.charAt(0) === 'A' ? "0" : "1") || '',
            latitud: denunciaInfo?.Ubicacion?.latitud || '',
            longitud: denunciaInfo?.Ubicacion?.longitud || ''
        }));
    }, [denunciaInfo])


    return (
        <div className='flex flex-col lg:h-heightfull w-full px-8 pt-8 pb-4 text-sm'>
            <div className='p-4 border-2 border-black rounded-xl grid grid-cols-1 lg:grid-cols-3 uppercase gap-3'>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>N° de denuncia (sumario):</p>
                    <p className='pl-2'>{denunciaInfo.idDenuncia}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>DNI denunciante:</p>
                    {
                        denunciaInfo.dniDenunciante != null ?
                            <p className='pl-2'>{denunciaInfo.dniDenunciante}</p>
                            :
                            <p className='pl-2'>-</p>

                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Fecha denuncia:</p>
                    <p className='pl-2'>{denunciaInfo.fechaDenuncia}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Delito: </p>
                    {
                        delito ?
                            <p className='pl-2'></p>
                            :
                            <p className='pl-2'>{denunciaInfo?.submodalidad?.tipoDelito?.descripcion || '-'}</p>
                    }
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Fecha del hecho:</p>
                    <p className='pl-2'>{denunciaInfo.fechaDelito}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Hora del hecho:</p>
                    <p className='pl-2'>{denunciaInfo.horaDelito}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Lugar del hecho:</p>
                    <p className='pl-2'>{denunciaInfo?.Ubicacion?.domicilio}</p>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <p className='font-bold'>Localidad:</p>
                    <p className='pl-2'>{denunciaInfo?.Ubicacion?.Localidad?.descripcion}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>Comisaria:</p>
                    <p className='pl-2'>{denunciaInfo.comisariaId}</p>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <p className='font-bold'>Fiscalia:</p>
                    <p className='pl-2'>{denunciaInfo.fiscalia}</p>
                </div>
            </div>
            <h2 className='text-[#345071] font-bold text-2xl lg:text-left text-center my-6 uppercase'>Clasificación</h2>
            <div className='px-4 grid lg:grid-cols-6 uppercase pb-3 gap-4 mr-12 text-sm'>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Submodalidad:</label>
                    <select name="submodalidadId" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={(e) => { handleFormChange(e); handleModalidad(e.target.selectedOptions[0].getAttribute('data-modalidadId')); }} value={formValues.submodalidadId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            subModalidad.map(sm => (
                                <option value={sm.idSubmodalidad} data-modalidadId={sm.modalidadId}>{sm.descripcion}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Modalidad:</label>
                    <select name="submodalidadId" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' value={formValues.modalidadId || ''} disabled>
                        <option value="">Seleccione una opción</option>
                        {
                            modalidad.map(mo => (
                                <option value={mo.idModalidad}>{mo.descripcion}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Especialidad:</label>
                    <select name="especializacionId" type="text" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} value={formValues.especializacionId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            especializacion.map(es => (
                                <option key={es.idEspecializacion} value={es.idEspecializacion}>{es.descripcion}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Aprehendido:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='aprehendido' value={formValues.aprehendido || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Medida:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='medida' value={formValues.medida || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Movilidad:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='movilidadId' value={formValues.movilidadId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            movilidad.map(mo => (
                                <option value={mo.idMovilidad}>{mo.descripcion}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Autor:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='autorId' value={formValues.autorId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            autor.map(au => (
                                <option value={au.idAutor}>{au.descripcion}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Para seguro:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='seguro' value={formValues.seguro || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Arma:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='tipoArmaId' value={formValues.tipoArmaId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            tipoArma.map(ta => (
                                <option value={ta.idTipoArma}>{ta.descripcion}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Victima:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='victima' value={formValues.victima || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Elementos sustraidos:</label>
                    <input name="elementoSustraido" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} value={formValues.elementoSustraido || ''}></input>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Interes:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='interes' value={formValues.interes || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Latitud:</label>
                    <input name="latitud" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} value={formValues.latitud || ''} type='number'></input>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Longitud:</label>
                    <input name="longitud" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} value={formValues.longitud || ''} type='number'></input>
                </div>
            </div>
            <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-6 lg:gap-0 gap-4 pb-4 text-sm'>
                <NavLink to={'/denuncias'} className='text-center py-2 bg-[#757873] text-white rounded-3xl w-40'>Cancelar</NavLink>
                <button className='py-2 bg-[#345071] text-white rounded-3xl w-40' onClick={saveDenuncia}>Guardar Clasificación</button>
            </div>
        </div>
    )
}

export default Clasificacion