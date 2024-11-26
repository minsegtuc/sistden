import { useEffect, useState, useContext } from 'react'
import { NavLink, useParams, useNavigate, json } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ContextConfig } from '../context/ContextConfig';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Clasificacion = () => {

    const navigate = useNavigate()

    const { handleSession, HOST, denuncia, socket, relato, setRelato } = useContext(ContextConfig)

    const denunciaCookie = encodeURIComponent(Cookies.get('denuncia'));
    const decoded = jwtDecode(Cookies.get('auth_token'));

    //OPTIONS
    const [autor, setAutor] = useState([])
    const [subModalidad, setSubModalidad] = useState([])
    const [tipoDelito, setTipoDelito] = useState([])
    const [delitoCorregido, setDelitoCorregido] = useState(null)
    const [especializacion, setEspecializacion] = useState([])
    const [movilidad, setMovilidad] = useState([])
    const [tipoArma, setTipoArma] = useState([])
    const [modalidad, setModalidad] = useState([])
    const [modalidadId, setModalidadId] = useState(null)
    const [denunciaInfo, setDenunciaInfo] = useState({})
    const [denunciaInicial, setDenunciaInicial] = useState({})
    const [arma, setArma] = useState(null)


    const [formValues, setFormValues] = useState({
        especializacionId: denunciaInfo?.especializacionId || '',
        submodalidadId: denunciaInfo?.submodalidadId || '',
        autorId: denunciaInfo?.autorId || '',
        modalidadId: denunciaInfo?.submodalidad?.modalidad?.idModalidad || '',
        movilidadId: denunciaInfo?.movilidad?.idMovilidad || '',
        aprehendido: denunciaInfo?.aprehendido !== undefined ? String(denunciaInfo?.aprehendido) : '',
        medida: denunciaInfo?.medida !== undefined ? String(denunciaInfo.medida) : '',
        seguro: denunciaInfo?.seguro !== undefined ? String(denunciaInfo.seguro) : '',
        elementoSustraido: denunciaInfo?.elementoSustraido || '',
        tipoArmaId: denunciaInfo?.tipoArmaId || '',
        victima: denunciaInfo?.victima !== undefined ? String(denunciaInfo?.victima) : '',
        interes: denunciaInfo?.interes || (denuncia?.charAt(0) === 'A' ? "0" : "1") || '',
        tipoDelitoId: delitoCorregido === null ? denunciaInfo?.tipoDelito?.descripcion : delitoCorregido,
        // latitud: denunciaInfo?.Ubicacion?.latitud || '',
        // longitud: denunciaInfo?.Ubicacion?.longitud || '',
        estado: denunciaInfo?.Ubicacion?.estado || '',
        coordenadas: denunciaInfo?.Ubicacion?.latitud + ', ' + denunciaInfo?.Ubicacion?.longitud || ''
    });

    useEffect(() => {
        fetch(`${HOST}/api/denuncia/denuncia/${denuncia != null ? denuncia : denunciaCookie}`, {
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
                setDenunciaInicial({
                    ...data,
                    fechaDenuncia: newFechaDenuncia[2] + '/' + newFechaDenuncia[1] + '/' + newFechaDenuncia[0],
                    fechaDelito: newFechaDelito[2] + '/' + newFechaDelito[1] + '/' + newFechaDelito[0]
                })
            })
            .catch(err => console.log(err))
    }, [denuncia])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [autor, subModalidad, tipoDelito, especializacion, movilidad, tipoArma, modalidad] = await Promise.all([
                    fetch(`${HOST}/api/autor/autor`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch(`${HOST}/api/submodalidad/submodalidad`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch(`${HOST}/api/tipoDelito/tipoDelito`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch(`${HOST}/api/especializacion/especializacion`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch(`${HOST}/api/movilidad/movilidad`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch(`${HOST}/api/tipoArma/tipoArma`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    }),
                    fetch(`${HOST}/api/modalidad/modalidad`, {
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

    const handleModalidad = (e, value) => {
        console.log("Arma: " , value)
        const armaUsada = value ? value : formValues.tipoArmaId
        // console.log("Tipo de arma: " , formValues.tipoArmaId)
        // console.log("Modalidad: " , e)
        if (e != null) {
            console.log("INGRESO AL HANDLEMODALIDAD")
            fetch(`${HOST}/api/modalidad/modalidad/${e}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).then(res => res.json())
                .then(data => {
                    if (armaUsada === "1") {
                        console.log("Ingreso porque el arma es de fuego")
                        setFormValues(prevFormValues => ({
                            ...prevFormValues,
                            modalidadId: data.idModalidad,
                            tipoDelitoId: 51
                        }))
                        setDelitoCorregido('ROBO CON ARMA DE FUEGO')
                    } else if (e === "6" || e === "19" || e === "20" || e === "22") {
                        console.log("Ingreso porque el arma no es de fuego")
                        setFormValues(prevFormValues => ({
                            ...prevFormValues,
                            modalidadId: data.idModalidad,
                            tipoDelitoId: 52
                        }))
                        setDelitoCorregido('ROBO')
                    } else {
                        console.log("Ingreso porque ingreso")
                        setFormValues(prevFormValues => ({
                            ...prevFormValues,
                            modalidadId: data.idModalidad,
                            tipoDelitoId: data.tipoDelitoId
                        }))
                        const delitoEncontrado = tipoDelito.find(td => td["idTipoDelito"] === data.tipoDelitoId);
                        const delito = delitoEncontrado ? delitoEncontrado["descripcion"] : null;
                        // console.log(delito)                    
                        setDelitoCorregido(delito)
                    }
                })
        } else {
            // if (armaUsada === "1") {
            //     console.log("Ingreso porque el arma es de fuego")
            //     setFormValues(prevFormValues => ({
            //         ...prevFormValues,
            //         tipoDelitoId: 51
            //     }))
            //     setDelitoCorregido('ROBO CON ARMA DE FUEGO')
            // } else if (e === "6" || e === "19" || e === "20" || e === "22") {
            //     console.log("Ingreso porque el arma no es de fuego")
            //     setFormValues(prevFormValues => ({
            //         ...prevFormValues,
            //         tipoDelitoId: 52
            //     }))
            //     setDelitoCorregido('ROBO')
            // } else {
            //     console.log("Ingreso porque ingreso")
            //     setFormValues(prevFormValues => ({
            //         ...prevFormValues,
            //         tipoDelitoId: data.tipoDelitoId
            //     }))
            //     const delitoEncontrado = tipoDelito.find(td => td["idTipoDelito"] === data.tipoDelitoId);
            //     const delito = delitoEncontrado ? delitoEncontrado["descripcion"] : null;
            //     // console.log(delito)                    
            //     setDelitoCorregido(delito)
            // }
            setFormValues(prevFormValues => ({
                ...prevFormValues,
                modalidadId: null,
            }))
            setDelitoCorregido(null)
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        console.log("Value del select: ", value);

        if (name === 'seguro') {
            setFormValues(prevFormValues => ({
                ...prevFormValues,
                seguro: value,
                interes: value === "1" || denuncia?.charAt(0) === 'A' ? "0" : "1"
            }));
        } else if (name === 'tipoArmaId') {
            if (value === "1") {
                setFormValues(prevFormValues => ({
                    ...prevFormValues,
                    tipoArmaId: value,
                    tipoDelitoId: 51
                }));
                setDelitoCorregido("ROBO CON ARMA DE FUEGO")
            } else {
                console.log("Modalidad en el formualario: ", formValues?.submodalidadId)
                if (formValues?.submodalidadId === '') {
                    setFormValues(prevFormValues => ({
                        ...prevFormValues,
                        tipoArmaId: value,
                        tipoDelitoId: denunciaInicial?.tipoDelito?.idTipoDelito
                    }));
                    setDelitoCorregido(denunciaInicial?.tipoDelito?.descripcion)
                } else {
                    setFormValues(prevFormValues => ({
                        ...prevFormValues,
                        tipoArmaId: value,
                    }));
                    console.log("Valor del value: " , e.target.value)
                    handleModalidad(formValues.modalidadId, value)
                }
            }
        } else {
            setFormValues(prevFormValues => ({
                ...prevFormValues,
                [name]: value
            }));
        }
    };

    const saveDenuncia = () => {

        const denunciaEnviar = {
            submodalidadId: parseInt(formValues.submodalidadId),
            modalidadId: parseInt(formValues.modalidadId),
            especializacionId: parseInt(formValues.especializacionId),
            aprehendido: parseInt(formValues.aprehendido),
            medida: parseInt(formValues.medida),
            movilidadId: parseInt(formValues.movilidadId),
            autorId: parseInt(formValues.autorId),
            seguro: parseInt(formValues.seguro),
            tipoArmaId: parseInt(formValues.tipoArmaId),
            tipoDelitoId: formValues.tipoDelitoId,
            victima: parseInt(formValues.victima),
            elementoSustraido: formValues.elementoSustraido,
            interes: parseInt(formValues.interes),
            dniDenunciante: null,
            isClassificated: 1
        }

        const ubicacionEnviar = {
            latitud: parseFloat((formValues.coordenadas).split(', ')[0]),
            longitud: parseFloat((formValues.coordenadas).split(', ')[1]),
            estado: parseInt(formValues.estado)
        }

        const propiedadesConValorInvalido = Object.entries(denunciaEnviar).filter(
            ([key, valor]) => {
                const esNumerico = typeof valor === 'number';
                return (esNumerico && isNaN(valor)) || valor === null;
            }
        );

        // console.log("Ubicacion a enviar: ", ubicacionEnviar)
        // console.log("Denuncia a enviar: ", denunciaEnviar)
        // console.log(propiedadesConValorInvalido)

        if (propiedadesConValorInvalido.length > 1) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Complete todos los campos para clasificar la denuncia"
            });
        } else {
            fetch(`${HOST}/api/ubicacion/ubicacion/${denunciaInfo?.Ubicacion?.idUbicacion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(ubicacionEnviar)
            }).then(res => {
                if (res.status === 200) {
                    fetch(`${HOST}/api/denuncia/denuncia/${denuncia}`, {
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
                                    navigate('/sgd/denuncias')
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
            aprehendido: denunciaInfo?.aprehendido !== undefined ? String(denunciaInfo?.aprehendido) : '',
            medida: denunciaInfo?.medida !== undefined ? String(denunciaInfo.medida) : '',
            seguro: denunciaInfo?.seguro !== undefined ? String(denunciaInfo.seguro) : '',
            elementoSustraido: denunciaInfo?.elementoSustraido || '',
            tipoArmaId: denunciaInfo?.tipoArmaId || '',
            victima: denunciaInfo?.victima !== undefined ? String(denunciaInfo?.victima) : '',
            interes: denunciaInfo?.interes || (denuncia?.charAt(0) === 'A' ? "0" : "1") || '',
            tipoDelitoId: delitoCorregido === null ? denunciaInfo?.tipoDelito?.descripcion : delitoCorregido,
            // latitud: denunciaInfo?.Ubicacion?.latitud || '',
            // longitud: denunciaInfo?.Ubicacion?.longitud || '',
            estado: denunciaInfo?.Ubicacion?.estado || '',
            coordenadas: denunciaInfo?.Ubicacion?.latitud + ', ' + denunciaInfo?.Ubicacion?.longitud || ''
        }));
    }, [denunciaInfo])

    useEffect(() => {
        if (!socket.connected) {
            socket.connect()

            const denunciaAEnviar = denuncia != null ? denuncia : decodeURIComponent(denunciaCookie)
            const userCookie = decoded.nombre

            socket.emit('view_denuncia', {
                denunciaId: denunciaAEnviar,
                userId: userCookie,
            });
        }

        return () => {
            const denunciaActualizar = decodeURIComponent(denuncia)
            socket.emit('leave_denuncia', { denunciaId: denunciaActualizar });
            socket.disconnect();
        };
    }, [])

    useEffect(() => {
        console.log(formValues)
    }, [formValues])


    return (
        <div className='flex flex-col lg:h-heightfull w-full px-8 pt-8 pb-4 text-sm overflow-scroll'>
            <div className='p-4 border-2 border-black rounded-xl grid grid-cols-1 lg:grid-cols-3 uppercase gap-3'>
                <div className='flex flex-row items-center'>
                    <p className='font-bold'>N° de denuncia (sumario):</p>
                    <a href={`https://mpftucuman.com.ar/noteweb3.0/denview.php?id=${denunciaInfo.idDenuncia !== undefined ? (denunciaInfo.idDenuncia).match(/\d+/)[0] : ''}`} target="_blank" className='pl-2 text-[#005CA2] underline'>{denunciaInfo.idDenuncia}</a>
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
                    <a className='font-bold'>Delito: </a>
                    {
                        delitoCorregido === null ?
                            denunciaInfo?.tipoDelito?.descripcion === null ?
                                <p className='pl-2'>No registrado en base de datos</p>
                                :
                                <p className='pl-2'>{denunciaInfo?.tipoDelito?.descripcion}</p>
                            :
                            <p className='pl-2'>{delitoCorregido}</p>
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
                    <p className='pl-2'>{denunciaInfo?.Comisarium?.descripcion ? denunciaInfo?.Comisarium?.descripcion : 'No registrada en base de datos'}</p>
                </div>
                <div className='lg:col-span-2 flex flex-row items-center'>
                    <p className='font-bold'>Fiscalia:</p>
                    <p className='pl-2'>{denunciaInfo.fiscalia}</p>
                </div>
            </div>
            <div className='p-4 border-2 border-black rounded-xl uppercase gap-3 mt-4'>
                <div className='flex flex-col items-start gap-4 w-full'>
                    <p className='font-bold'>Relato del hecho</p>
                    <textarea className='w-full px-6' name="" id="" rows={8}>{relato ? relato : "NO SE ENCONTRO RELATO"}</textarea>
                </div>
            </div>
            <h2 className='text-[#005CA2] font-bold text-2xl lg:text-left text-center my-6 uppercase'>Clasificación</h2>
            <div className='px-4 grid lg:grid-cols-6 uppercase pb-3 gap-4 mr-12 text-sm'>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Submodalidad:</label>
                    <select name="submodalidadId" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={(e) => { handleFormChange(e); handleModalidad(e.target.selectedOptions[0].getAttribute('dataModalidadId'), null); }} value={formValues.submodalidadId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            subModalidad.map(sm => (
                                <option value={sm.idSubmodalidad} dataModalidadId={sm.modalidadId}>{sm.descripcion}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Modalidad:</label>
                    <select name="modalidadId" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' value={formValues.modalidadId || ''} disabled>
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
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Latitud y longitud:</label>
                    <input name="coordenadas" className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} value={formValues.coordenadas || ''} type='text'></input>
                </div>
                <div className='flex flex-row items-center col-span-2'>
                    <label htmlFor="" className='pr-4 w-1/2 text-right'>Estado GEO:</label>
                    <select className='h-6 border-2 rounded-xl pl-3 border-[#757873] w-1/2' onChange={handleFormChange} name='estado' value={formValues.estado || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">CORRECTA</option>
                        <option value="2">INCORRECTA</option>
                        <option value="3">APROXIMADA</option>
                        <option value="5">NULA</option>
                        <option value="6">DESCARTADA</option>
                    </select>
                </div>
            </div>
            <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-6 lg:gap-0 gap-4 pb-4 text-sm'>
                <NavLink to={'/sgd/denuncias'} className='text-center py-2 bg-[#757873] text-white rounded-3xl w-40'>Cancelar</NavLink>
                <button className='py-2 bg-[#005CA2] text-white rounded-3xl w-40' onClick={saveDenuncia}>Guardar Clasificación</button>
                {/* <button className='py-2 bg-[#005CA2] text-white rounded-3xl w-40' onClick={obtenerData}>Obtener data</button> */}
            </div>
        </div>
    )
}

export default Clasificacion