import { useEffect, useState, useContext, useRef } from 'react'
import { NavLink, useParams, useNavigate, json } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ContextConfig } from '../context/ContextConfig';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { FaRegCopy } from "react-icons/fa6";
import { CiCircleCheck, CiCircleRemove, CiCircleInfo } from "react-icons/ci";
import { RiRobot2Line } from "react-icons/ri";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import { getIconByPrecision } from '../config/leafletFix.js'
import parse from "html-react-parser";
import { Tooltip } from 'react-tooltip';

const Clasificacion = () => {

    const navigate = useNavigate()

    const { handleSession, HOST, denuncia, socket, relato, setRelato, denunciasIds, handleDenuncia } = useContext(ContextConfig)

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
    const [denunciaInfo, setDenunciaInfo] = useState({})
    const [denunciaInicial, setDenunciaInicial] = useState({})
    const [datosIA, setDatosIA] = useState({
        especializacion: null,
        submodalidad: null,
        autor: null,
        modalidad: null,
        movilidad: null,
        tipoArma: null,
        tipoDelito: null,
        aprehendido: null,
        medida: null,
        seguro: null,
        elementoSustraido: null,
        victima: null,
        interes: null,
        latitud: null,
        longitud: null,
        estado: null
    })
    const [idsDetectados, setIdsDetectados] = useState([])
    const [contenidoParseado, setContenidoParseado] = useState(null);
    const [mostrarUbicacionManual, setMostrarUbicacionManual] = useState()
    const [ubicacionesAuxiliares, setUbicacionesAuxiliares] = useState([])
    const [loadingCarga, setLoadingCarga] = useState(false)
    const [infoSubmodalidad, setInfosubmodalidad] = useState(null)

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
        tipoDelitoId: denunciaInfo?.tipoDelito?.idTipoDelito || '',
        latitud: denunciaInfo?.Ubicacion?.latitud || '',
        longitud: denunciaInfo?.Ubicacion?.longitud || '',
        domicilio: denunciaInfo?.Ubicacion?.domicilio || '',
        domicilio_ia: denunciaInfo?.Ubicacion?.domicilio_ia || '',
        estado: denunciaInfo?.Ubicacion?.estado || '',
        estado_ia: denunciaInfo?.Ubicacion?.estado_ia || '',
        coordenadas: denunciaInfo?.Ubicacion?.latitud + ', ' + denunciaInfo?.Ubicacion?.longitud || '',
        relato: denunciaInfo?.relato || "",
        isClassificated: denunciaInfo?.isClassificated || -1,
        ubicacionesAuxiliares: denunciaInfo?.ubicacionesAuxiliares || [],
        tipoDelitoClasificador: denunciaInfo?.submodalidad?.modalidad?.tipoDelito?.descripcion || null,
        lugar_del_hecho: denunciaInfo?.lugar_del_hecho || null,
        cantidad_victimario: denunciaInfo?.cantidad_victimario || null,
    });
    const [camposVacios, setCamposVacios] = useState(false)

    const submodalidadesDef = [
        {
            "tipo": "ABIGEATO & CAMPO",
            "descripcion": "Robo de ganado, animales de campo, no animales domésticos.",
            "ejemplo": "Me robaron el caballo que tenía atado en el patio."
        },
        {
            "tipo": "ARREBATO",
            "descripcion": "Cuando sustraen a la fuerza y repentinamente un objeto, usualmente a pie.",
            "ejemplo": "Se bajó de la moto y me quitó el celular."
        },
        {
            "tipo": "ASALTO",
            "descripcion": "Cuando ejercen violencia contra la persona para cometer el hecho y hay uso de armas.",
            "ejemplo": "Me amenazaron con un revólver y me quitó la cartera."
        },
        {
            "tipo": "DESCUIDISTA",
            "descripcion": "Aprovechamiento de la distracción o descuido momentáneo de la víctima, basándose en la oportunidad y rapidez para cometer el hurto.",
            "ejemplo": "Dejé el celular apoyado en el mostrador del local, al querer hacer uso del mismo, me di cuenta que no estaba."
        },
        {
            "tipo": "VIOLENCIA A LA PROPIEDAD",
            "descripcion": "Cuando rompen algo para robar en una propiedad (con moradores presentes en el acto) (Aplica a inmuebles de viviendas. NO a vehículos).",
            "ejemplo": "El delincuente rompió una puerta de mi vivienda, entró y me sustrajo el televisor mientras yo me encontraba durmiendo."
        },
        {
            "tipo": "ENTRADERA",
            "descripcion": "Cuando la víctima se encuentra entrando o saliendo de la vivienda y el delincuente lo obliga a la fuerza a ingresar a la vivienda para robar.",
            "ejemplo": "Mientras abría el portón, me sorprendieron dos individuos armados que me empujaron hacia dentro de mi propiedad."
        },
        {
            "tipo": "ESCALAMIENTO",
            "descripcion": "Trepar o subir por una pared o estructura para acceder a un lugar donde normalmente no puede entrar. Superar una barrera vertical.",
            "ejemplo": "El ladrón ingresó a la vivienda saltando la tapia."
        },
        {
            "tipo": "ESCRUCHE",
            "descripcion": "Cuando el ladrón ingresa a un inmueble familiar sin moradores presentes y ejerciendo violencia sobre el inmueble para ingresar.",
            "ejemplo": "Me fui de mi domicilio y cuando regresé encontré la cerradura de la puerta rota. Al regresar me di con la novedad que me faltaban pertenencias."
        },
        {
            "tipo": "HURTO EN CASA CON MORADORES",
            "descripcion": "Cuando no hay señales de forzamiento para entrar en viviendas familiares con moradores presentes.",
            "ejemplo": "Escuché un ruido y me levanté de la cama, revisé la entrada del garage y noté que no se encontraba la bicicleta."
        },
        {
            "tipo": "HURTO EN CASA SIN MORADORES",
            "descripcion": "Cuando no hay señales de forzamiento para entrar en viviendas familiares sin moradores presentes.",
            "ejemplo": "Cuando llegué a mi casa, me di cuenta que la puerta de entrada se encontraba abierta ya que la dejé sin llave, y al revisar me di con la novedad que no se encontraba la bicicleta."
        },
        {
            "tipo": "INHIBIDOR DE ALARMA",
            "descripcion": "Cuando menciona en la denuncia que utilizó un inhibidor de alarma.",
            "ejemplo": "La alarma del auto no sonó por lo que usaron un bloqueador de alarma."
        },
        {
            "tipo": "CONFLICTO FAMILIAR",
            "descripcion": "Cuando el que comete el hecho tiene un vínculo familiar directo (hijo, padre, madre, hermano, cónyuge, abuelos).",
            "ejemplo": "Mi hijo robó mi celular y lo vendió para comprar drogas."
        },
        {
            "tipo": "INTENTO DE HURTO",
            "descripcion": "Ejecución iniciada de hurto interrumpida por causas ajenas.",
            "ejemplo": "Un sujeto estaba intentando ingresar a mi casa pero mi vecina lo ahuyentó a los gritos."
        },
        {
            "tipo": "INTENTO DE ROBO",
            "descripcion": "Ejecución iniciada de robo (fuerza o violencia) interrumpida por causas ajenas.",
            "ejemplo": "Quiso robarme la bicicleta estacionada pero no pudo cortar la cadena de seguridad."
        },
        {
            "tipo": "PUNGA",
            "descripcion": "Carterista o sustracción sigilosa de bolsillos/bolsos.",
            "ejemplo": "Después de bajar del colectivo me di con la novedad de que no tenía el celular en mi bolsillo."
        },
        {
            "tipo": "MECHERA",
            "descripcion": "Hurto en comercios ocultando productos.",
            "ejemplo": "La mujer entró a la tienda de ropa y agarró dos camisetas y las metió en su bolso, luego salió de la tienda sin pagar."
        },
        {
            "tipo": "ROBO EN INMUEBLE NO RESIDENCIAL",
            "descripcion": "Robo a inmueble no residencial (escuela, comercio, etc.) sin ocupantes en el acto.",
            "ejemplo": "Se robaron computadoras de la escuela."
        },
        {
            "tipo": "MOTOARREBATO",
            "descripcion": "Tironeo o arrebato desde una moto en movimiento.",
            "ejemplo": "Tironeo de un bolso desde la moto."
        },
        {
            "tipo": "ROBO A VEHICULOS / OTROS",
            "descripcion": "Robo de elementos propios del vehículo (estéreo, gato).",
            "ejemplo": "Robaron el estéreo del auto y el gato hidráulico."
        },
        {
            "tipo": "ROBO A VEHICULOS / PERTENENCIAS",
            "descripcion": "Robo de pertenencias dentro del vehículo.",
            "ejemplo": "Robaron mi bolso del baúl que contenía una notebook."
        },
        {
            "tipo": "HURTO A VEHICULOS / RUEDA",
            "descripcion": "Hurto de ruedas en uso del vehículo.",
            "ejemplo": "Me di con la novedad que el auto estaba sujetado por ladrillos y me sustrajeron las dos ruedas del lado derecho."
        },
        {
            "tipo": "ROBO A VEHICULOS / RUEDA AUXILIO",
            "descripcion": "Robo únicamente de la rueda de auxilio.",
            "ejemplo": "Noté que el seguro de la rueda de auxilio se encontraba colgando en el piso y que habían robado la rueda de auxilio."
        },
        {
            "tipo": "ROBO AGRAVADO POR LESIONES",
            "descripcion": "Robo con violencia física/verbal SIN arma.",
            "ejemplo": "Me golpearon brutalmente y me robaron el celular."
        },
        {
            "tipo": "ROBO DE AUTO/CAMIONETA",
            "descripcion": "Robo de automóvil, SUV, pickup, furgón.",
            "ejemplo": "Dejé estacionado el auto y cuando regresé no se encontraba en el lugar."
        },
        {
            "tipo": "HURTO DE AUTO/CAMIONETA",
            "descripcion": "Hurto de automóvil, SUV, pickup, furgón.",
            "ejemplo": "Me bajé del auto a comprar en un kiosko dejando el auto prendido, pasó una persona y se fue en el auto."
        },
        {
            "tipo": "ROBO DE BICICLETA",
            "descripcion": "Robo de bicicleta con fuerza (romper candado, etc.).",
            "ejemplo": "Me di con la novedad que rompieron el candado de seguridad de mi bicicleta y me la robaron."
        },
        {
            "tipo": "HURTO DE BICICLETA",
            "descripcion": "Hurto de bicicleta sin fuerza.",
            "ejemplo": "Dejé la bici apoyada en la vereda, y cuando volví ya no estaba."
        },
        {
            "tipo": "ROBO DE MOTO",
            "descripcion": "Robo de motocicleta con fuerza (romper traba, etc.).",
            "ejemplo": "Rompieron la traba de la moto y se la llevaron."
        },
        {
            "tipo": "HURTO DE MOTO",
            "descripcion": "Hurto de motocicleta sin fuerza.",
            "ejemplo": "Me bajé de la moto a entregar el pedido dejando la moto prendida, pasó una persona y se la llevó."
        },
        {
            "tipo": "ROBO DE OTROS VEHICULOS",
            "descripcion": "Robo de cuatriciclos, carros, lanchas con fuerza.",
            "ejemplo": "Me robaron el sulky."
        },
        {
            "tipo": "HURTO DE OTROS VEHICULOS",
            "descripcion": "Hurto de cuatriciclos, carros, lanchas sin fuerza.",
            "ejemplo": "Presté el cuatriciclo y no me lo devolvieron."
        },
        {
            "tipo": "ROBO EN BANDA",
            "descripcion": "Robo cometido por varias personas coordinadas.",
            "ejemplo": "Entraron al local comercial e intimidaron al personal, sustrajeron el dinero de las cajas registradoras y se dieron a la fuga rápidamente."
        },
        {
            "tipo": "ROBO SIMPLE",
            "descripcion": "Robo con fuerza sobre objetos externos o accesorios que NO impliquen el ingreso a un domicilio, comercio o vehículo mediante rotura de sus cerramientos principales (puertas, ventanas, techos). No encaja en otros robos específicos.",
            "ejemplo": "Robaron el medidor de gas."
        },
        {
            "tipo": "ROMPEVIDRIOS",
            "descripcion": "Rompen ventana de vehículo para robar (usualmente con víctima dentro).",
            "ejemplo": "Me detuve en el semáforo y se acercó un sujeto, el cual rompe la ventanilla del acompañante y arrebata un bolso que estaba en el asiento."
        },
        {
            "tipo": "SALIDERA BANCARIA",
            "descripcion": "Robo post-retiro bancario.",
            "ejemplo": "Cuando volvía del banco me interceptaron dos delincuentes en la vía pública y me amenazaron que entregue el dinero"
        },
        {
            "tipo": "HURTO SIMPLE",
            "descripcion": "Sustracción sin violencia/intimidación, victimario conocido, no encaja en otros hurtos.",
            "ejemplo": "Un sujeto me pidió prestado el celular y se retiró sin devolvérmelo"
        },
        {
            "tipo": "OTRO",
            "descripcion": "No comprende ninguno de los modus operandi anteriores ( Incluir como “OTRO” las Amenazas, violencia doméstica/género, estafas, homicidios, agresiones, daños). Si el relato describe principalmente una agresión física (lesiones) y la sustracción es secundaria o inexistente, o si es un conflicto que resulta en lesiones, clasifica como “OTRO”.",
            "ejemplo": "-"
        }
    ]


    const estilosPorId = {
        autor: "text-violet-600 font-bold",
        modus_operandi: "text-blue-600 font-bold",
        para_seguro: "text-yellow-600 font-bold",
        arma_utilizada: "text-red-600 font-bold",
        movilidad: "text-green-600 font-bold",
        elementos_sustraidos: "font-bold",
    };

    const scrollContainerRef = useRef();
    const sectorMPF = useRef(null);
    const sectorRelato = useRef(null);
    const sectorClasificacion = useRef(null);
    const sectorUbicacion = useRef(null);
    const sectorGuargar = useRef(null);
    const sectorCancelar = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === '1') {
                sectorMPF.current?.scrollIntoView({ behavior: 'smooth' });
            }
            if (event.key === '2') {
                sectorRelato.current?.scrollIntoView({ behavior: 'smooth' });
            }
            if (event.key === '3') {
                sectorClasificacion.current?.scrollIntoView({ behavior: 'smooth' });
            }
            if (event.key === '4') {
                sectorUbicacion.current?.scrollIntoView({ behavior: 'smooth' });
            }
            if (event.key === 'G' || event.key === 'g') {
                sectorGuargar.current?.focus();
            }
            if (event.key === 'C' || event.key === 'c') {
                sectorCancelar.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown); // Limpia cuando el componente se desmonta
        };
    }, [])

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

            if (!socket.connected) socket.connect()
            socket.emit('leave_denuncia', { denunciaId: denunciaActualizar });
            socket.emit('leave_denuncia', { denunciaId: denuncia });
            // socket.emit('actualizar_denuncias');
            socket.disconnect();
        };
    }, [])

    useEffect(() => {
        fetch(`${HOST}/api/denuncia/${denuncia != null ? denuncia : denunciaCookie}`, {
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
                // console.log(data)
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
        const armaUsada = value ? value : formValues.tipoArmaId
        if (e != null) {
            fetch(`${HOST}/api/modalidad/modalidad/${e}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).then(res => res.json())
                .then(data => {
                    if (armaUsada === "1") {
                        setFormValues(prevFormValues => ({
                            ...prevFormValues,
                            modalidadId: data.idModalidad,
                        }))
                    } else if (e === "6" || e === "19" || e === "20" || e === "22") {
                        setFormValues(prevFormValues => ({
                            ...prevFormValues,
                            modalidadId: data.idModalidad,
                        }))
                    } else {
                        setFormValues(prevFormValues => ({
                            ...prevFormValues,
                            modalidadId: data.idModalidad,
                        }))
                    }

                    if (data.idModalidad === 33) {
                        setFormValues(prevFormValues => ({
                            ...prevFormValues,
                            interes: "0",
                        }))
                    }
                })
        } else {
            setFormValues(prevFormValues => ({
                ...prevFormValues,
                modalidadId: null,
            }))
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setFormValues(prevFormValues => {
            let newValues = { ...prevFormValues, [name]: value };

            if (name === 'seguro') {
                newValues.interes =
                    value === "1" || denuncia?.charAt(0) === 'A' ? "0" : "1";
            }

            if (name === 'coordenadas' && value === '') {
                newValues.coordenadas = "null, null";
            }

            return newValues;
        });
    };

    const handleCopyPaste = (latlng) => {
        console.log("copio: ", latlng)
        const fakeEvent = {
            target: {
                value: latlng,
                name: "coordenadas"
            }
        }
        handleFormChange(fakeEvent);
    }

    const gestionarSocket = (denunciaRandom, denunciaEnviar) => {
        if (!socket.connected) socket.connect();
        const idDenunciaCodec = encodeURIComponent(denunciaEnviar.idDenuncia);
        //console.log("Denuncia con codec: ", idDenunciaCodec)

        socket.emit('leave_denuncia', { denunciaId: denunciaEnviar.idDenuncia });
        socket.emit('leave_denuncia', { denunciaId: idDenunciaCodec });
        socket.emit('view_denuncia', { denunciaId: denunciaRandom, userId: decoded.nombre });

        setTimeout(() => {
            socket.emit('actualizar_denuncias');
        }, 2000);
    };

    const manejarNuevaDenuncia = async (denunciaEnviar) => {
        try {
            const response = await fetch(`${HOST}/api/working/workings`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const denunciasOcupadas = await response.json();

            const denunciasDisponibles = denunciasIds.filter(id =>
                !denunciasOcupadas.some(ocupada => ocupada.idDenunciaWork === id)
            );

            if (denunciasDisponibles.length > 0) {
                const denunciaRandom = denunciasDisponibles[Math.floor(Math.random() * denunciasDisponibles.length)];

                console.log("Denuncia random: ", denunciaRandom)
                const denunciaEnviar = encodeURIComponent(denunciaRandom)
                //CONSULTAR SI YA SE CLASIFICO LA DENUNCIA
                const responseDenuncia = await fetch(`${HOST}/api/denuncia/${denunciaEnviar}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })

                const dataDenuncia = await responseDenuncia.json()

                console.log(dataDenuncia)

                if (dataDenuncia.isClassificated !== 1) {
                    gestionarSocket(denunciaRandom, denunciaEnviar);
                    handleDenuncia(denunciaRandom);
                    navigate(`/sgd/denuncias/clasificacion`);
                } else {
                    navigate(`/sgd/denuncias`);
                }
            } else {
                navigate(`/sgd/denuncias`);
            }
        } catch (error) {
            console.error("Error al obtener denuncias ocupadas:", error);
        }
    };

    const handleMarkerDrag = (index, newLat, newLng) => {
        const updatedUbicaciones = [...formValues.ubicacionesAuxiliares];
        updatedUbicaciones[index] = {
            ...updatedUbicaciones[index],
            latitudAuxiliar: newLat,
            longitudAuxiliar: newLng
        };

        setFormValues((prev) => ({
            ...prev,
            ubicacionesAuxiliares: updatedUbicaciones
        }));
    };

    const saveDenuncia = async () => {

        setCamposVacios(false)

        const propiedadesRequeridasDenuncia = ['submodalidadId', 'modalidadId', 'especializacionId', 'movilidadId', 'seguro', 'victima', 'dniDenunciante', 'tipoArmaId']
        const propiedadesRequeridasUbicacion = ['latitud', 'longitud', 'estado']

        let idDenunciaOk = ''
        const idDenunciaVerificar = denuncia != null ? denuncia : denunciaCookie
        if (idDenunciaVerificar.includes("%2F")) {
            idDenunciaOk = decodeURIComponent(idDenunciaVerificar);
        }

        const denunciaEnviar = {
            idDenuncia: idDenunciaOk,
            submodalidadId: parseInt(formValues.submodalidadId),
            modalidadId: parseInt(formValues.modalidadId),
            especializacionId: parseInt(formValues.especializacionId),
            aprehendido: parseInt(formValues.aprehendido),
            movilidadId: parseInt(formValues.movilidadId),
            autorId: parseInt(formValues.autorId),
            seguro: parseInt(formValues.seguro),
            tipoArmaId: parseInt(formValues.tipoArmaId),
            tipoDelitoId: formValues.tipoDelitoId,
            victima: parseInt(formValues.victima),
            elementoSustraido: formValues.elementoSustraido,
            interes: parseInt(formValues.interes),
            dniDenunciante: null,
            cantidad_victimario: formValues.cantidad_victimario,
            lugar_del_hecho: formValues.lugar_del_hecho,
            isClassificated: 1
        }

        const [latitud, longitud] = (formValues.coordenadas || '').split(', ').map(coord => parseFloat(coord) || null);

        const ubicacionEnviar = {
            latitud,
            longitud,
            estado: parseInt(formValues.estado)
        }

        const propiedadesDenunciaConValorInvalido = Object.entries(denunciaEnviar).filter(
            ([key, valor]) => {
                const esNumerico = typeof valor === 'number';
                return (esNumerico && isNaN(valor)) || valor === null;
            }
        );

        const propiedadesUbicacionConValorInvalido = Object.entries(ubicacionEnviar).filter(
            ([key, valor]) => {
                const esNumerico = typeof valor === 'number';
                return (esNumerico && isNaN(valor)) || valor === null;
            }
        );

        const isValidDenuncia = propiedadesDenunciaConValorInvalido.every(([key, value]) => {
            if (propiedadesRequeridasDenuncia.includes(key)) {
                return !isNaN(value);
            }
            return true;
        });

        const isValidUbicacion = propiedadesUbicacionConValorInvalido.every(([key, value]) => {
            if (propiedadesRequeridasUbicacion.includes(key)) {
                return !isNaN(value);
            }
            return true;
        });

        if (!isValidDenuncia || !isValidUbicacion) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Complete todos los campos para clasificar la denuncia"
            });
            setCamposVacios(true)
        } else {
            try {
                setLoadingCarga(true)
                const ubicacionResponse = await fetch(`${HOST}/api/ubicacion/ubicacion/${denunciaInfo?.Ubicacion?.idUbicacion}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(ubicacionEnviar)
                })

                if (ubicacionResponse.status === 200) {
                    const denuncias = [denunciaEnviar];
                    const denunciaResponse = await fetch(`${HOST}/api/denuncia/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ denuncias })
                    })

                    //console.log("Respuesta: " , denunciaResponse)

                    if (denunciaResponse.status === 200) {
                        setLoadingCarga(false)
                        Swal.fire({
                            icon: "success",
                            title: "Denuncia clasificada",
                            text: "La denuncia se clasificó y se encuentra en la base de datos",
                            confirmButtonText: 'Aceptar'
                        })
                            .then(async (result) => {
                                if (result.isConfirmed) {
                                    setCamposVacios(false)
                                    await manejarNuevaDenuncia(denunciaEnviar);
                                }
                            })
                    } else if (denunciaResponse.status === 403) {
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
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No se pudo clasificar la denuncia. Intente nuevamente"
                        })
                        setLoadingCarga(false)
                    }
                } else if (ubicacionResponse.status === 403) {
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
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No se pudo clasificar la denuncia. Intente nuevamente"
                    })
                    setLoadingCarga(false)
                }
            } catch (error) {
                console.log(error)
            }
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
            tipoDelitoId: denunciaInfo?.tipoDelito?.idTipoDelito || '',
            latitud: denunciaInfo?.Ubicacion?.latitud || '',
            longitud: denunciaInfo?.Ubicacion?.longitud || '',
            domicilio: denunciaInfo?.Ubicacion?.domicilio || '',
            domicilio_ia: denunciaInfo?.Ubicacion?.domicilio_ia || '',
            estado: denunciaInfo?.Ubicacion?.estado || '',
            estado_ia: denunciaInfo?.Ubicacion?.estado_ia || '',
            coordenadas: denunciaInfo?.Ubicacion?.latitud + ', ' + denunciaInfo?.Ubicacion?.longitud || '',
            relato: denunciaInfo?.relato || '',
            isClassificated: denunciaInfo?.isClassificated || -1,
            ubicacionesAuxiliares: denunciaInfo?.ubicacionesAuxiliares || [],
            tipoDelitoClasificador: denunciaInfo?.submodalidad?.modalidad?.tipoDelito?.descripcion || null,
            lugar_del_hecho: denunciaInfo?.lugar_del_hecho || null,
            cantidad_victimario: denunciaInfo?.cantidad_victimario || null,
        }));
    }, [denunciaInfo])

    function dom2text(node) {
        if (node.type === 'text') {
            return node.data;
        }
        if (node.children) {
            return node.children.map(dom2text).join('');
        }
        return '';
    }

    useEffect(() => {
        setContenidoParseado(null);
        setIdsDetectados([]);

        if (typeof formValues?.relato !== "string" || formValues?.relato.trim() === "") {
            setContenidoParseado(null);
            setIdsDetectados([]);
            return;
        }

        const relatoLimpio = formValues.relato.replace(/<span[^>]*>(?:\s*)<\/span>/g, "");

        const encontrados = new Set();

        const relatoKey = relatoLimpio.slice(0, 20) || "";

        let counter = 0;

        const contenido = parse(relatoLimpio, {
            replace: (domNode) => {
                if (domNode.name === "span" && domNode.attribs?.id) {
                    const id = domNode.attribs.id;
                    encontrados.add(id);

                    const texto = dom2text(domNode);;

                    const uniqueKey = `${relatoKey}-${id}-${texto}-${counter++}`;

                    if (formValues?.isClassificated === 2) {
                        return (
                            <span key={uniqueKey} id={id} className={estilosPorId[id] || "text-black"}>
                                {texto}
                            </span>
                        );
                    }
                    return (
                        <span key={uniqueKey} id={id}>
                            {texto}
                        </span>
                    );
                }

                if (domNode.type === 'tag') {
                    return <>{domToReact(domNode.children)}</>;
                }
            },
        });

        setContenidoParseado(contenido);
        setIdsDetectados([...encontrados]);

    }, [formValues]);

    const handleCopy = (atributo) => {
        if (atributo === 'denuncia') {
            navigator.clipboard.writeText(denunciaInfo.idDenuncia)
                .then(() => {
                    alert('Texto copiado al portapapeles');
                })
                .catch((error) => {
                    console.error('Error al copiar texto: ', error);
                });
        } else if (atributo === 'domicilio') {
            navigator.clipboard.writeText(formValues?.domicilio)
                .then(() => {
                    alert('Texto copiado al portapapeles');
                })
                .catch((error) => {
                    console.error('Error al copiar texto: ', error);
                });
        } else if (atributo === 'domicilio_ia') {
            navigator.clipboard.writeText(formValues?.domicilio_ia)
                .then(() => {
                    alert('Texto copiado al portapapeles');
                })
                .catch((error) => {
                    console.error('Error al copiar texto: ', error);
                });
        }

    }

    const comprobarPrecision = (precision) => {
        switch (precision) {
            case 'ROOFTOP':
                return 'Muy precisa';
            case 'RANGE_INTERPOLATED':
                return 'Precisa';
            case 'GEOMETRIC_CENTER':
                return 'Media';
            case 'APPROXIMATE':
                return 'Baja';
            default:
                return null;
        }
    }

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [denunciaInfo]);

    useEffect(() => {
        if (formValues.coordenadas !== 'null, null') {
            setMostrarUbicacionManual(true)

        } else {
            setMostrarUbicacionManual(false)
        }
    }, [formValues.coordenadas])

    const coordsValidas = formValues?.coordenadas?.includes(', ');
    const [lat, lng] = coordsValidas
        ? formValues.coordenadas.split(', ').map(coord => parseFloat(coord))
        : [null, null];

    useEffect(() => {
        const modalidad = formValues?.modalidadId?.toString().trim()
        const tipoArma = formValues?.tipoArmaId?.toString().trim()
        const especializacion = formValues?.especializacionId?.toString().trim()

        if (modalidad === '33') {
            setDelitoCorregido('CONFLICTO FAMILIAR')
        } else if (tipoArma === '1' && modalidad !== '15') {
            setDelitoCorregido('ROBO CON ARMA DE FUEGO')
        } else if (especializacion === '1') {
            comprobarDelitoClasificador(parseInt(modalidad))
        } else {
            setDelitoCorregido(denunciaInfo?.tipoDelito?.descripcion)
        }
    }, [formValues.modalidadId])

    const comprobarDelitoClasificador = (modalidad) => {
        //console.log("ingreso aqui")
        fetch(`${HOST}/api/modalidad/modalidad/${modalidad}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
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
                // console.log("data: ", data)
                setDelitoCorregido(data?.tipoDelito?.descripcion)
            })
    }

    useEffect(() => {
        console.log("Ingreso a ver definiciones")
        const buscarSubmodalidad = subModalidad.find((submodalidad) => submodalidad.idSubmodalidad === parseInt(formValues?.submodalidadId))
        const buscarCoincidencia = buscarSubmodalidad ? submodalidadesDef.find((definicion) => definicion.tipo === buscarSubmodalidad.descripcion) : null
        setInfosubmodalidad(buscarCoincidencia
            ? `
            <p><strong>${buscarCoincidencia.tipo}</strong></p>
            <p style="padding-top: 4px; padding-bottom: 4px; width: 205px">${buscarCoincidencia.descripcion}</p>
            <p style="padding-top: 4px; padding-bottom: 4px; width: 205px"><em>Ejemplo: ${buscarCoincidencia.ejemplo}</em></p>
          `
            : null);
    }, [formValues?.submodalidadId, subModalidad, submodalidadesDef])

    return (
        <div ref={scrollContainerRef} className='flex flex-col lg:h-heightfull w-full px-8 pt-8 pb-4 text-sm overflow-scroll'>
            <div className='p-4 rounded-xl grid grid-cols-1 lg:grid-cols-3 uppercase gap-3 bg-[#d9d9d9] scroll-mt-2' ref={sectorMPF}>
                <div className='grid grid-rows-3 gap-3'>
                    <div className='flex flex-row items-center'>
                        <p className='font-bold'>N° de denuncia:</p>
                        <a href={`https://noteweb.mpftucuman.gob.ar/noteweb3.0/denview.php?id=${denunciaInfo.idDenuncia !== undefined ? (denunciaInfo.idDenuncia).match(/\d+/)[0] : ''}`} target="_blank" className='pl-2 text-[#005CA2] underline'>{denunciaInfo.idDenuncia}</a>
                        <FaRegCopy className='ml-1 cursor-pointer' onClick={() => handleCopy('denuncia')} />
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='font-bold w-fit'>Fecha denuncia:</p>
                        <p className='pl-2'>{denunciaInfo.fechaDenuncia}</p>
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='font-bold min-w-fit'>Fecha y hora del hecho:</p>
                        <p className='pl-2 whitespace-nowrap overflow-hidden text-ellipsis'>{denunciaInfo.fechaDelito} {denunciaInfo.horaDelito}</p>
                    </div>
                </div>
                <div className='grid grid-rows-3 gap-3'>
                    <div className='flex flex-row items-center'>
                        <a className='font-bold min-w-fit'>Delito MPF: </a>
                        {
                            denunciaInfo?.tipoDelito?.descripcion === null ?
                                <p className='pl-2'>No registrado en base de datos</p>
                                :
                                <p className='pl-2 max-w-80 whitespace-nowrap overflow-hidden text-ellipsis'>{denunciaInfo?.tipoDelito?.descripcion}</p>

                        }
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='font-bold min-w-fit'>Delito Clasificador: </p>
                        <p className='pl-2  max-w-72 whitespace-nowrap overflow-hidden text-ellipsis'>{delitoCorregido ? delitoCorregido : '-'}</p>
                    </div>
                    <div className='flex flex-row items-center'>
                        <p className='font-bold'>Comisaria:</p>
                        <p className='pl-2'>{denunciaInfo?.Comisarium?.descripcion ? denunciaInfo?.Comisarium?.descripcion : 'No registrada en base de datos'}</p>
                    </div>
                </div>
                <div className='grid grid-rows-3 gap-3'>

                </div>
            </div>
            <div className='p-4 border-2 border-[#d9d9d9] rounded-xl uppercase gap-3 mt-4 scroll-mt-2' ref={sectorRelato}>
                <div className='flex flex-col items-start gap-4 w-full'>
                    <p className='font-bold'>Relato del hecho</p>
                    <p className='w-full px-2' name="" id="" rows={5}>{contenidoParseado ? contenidoParseado : "NO SE ENCONTRO RELATO"}</p>
                </div>
            </div>
            <div className='flex flex-row items-center scroll-mt-2' ref={sectorClasificacion}>
                <h2 className='text-[#005CA2] font-bold text-2xl lg:text-left text-center my-6 uppercase'>Clasificación</h2>
                {
                    denunciaInfo.isClassificated === 1 ? (<CiCircleCheck className='text-2xl pt-1 text-green-900' />) : denunciaInfo.isClassificated === 2 ? <RiRobot2Line className='text-2xl pt-1 text-blue-900 ml-2' /> : (<CiCircleRemove className='text-2xl pt-1 text-red-900 ml-1' />)
                }
                {/* <button className='py-1 bg-[#0f0f0f]/50 text-white rounded-3xl w-48 ml-auto'>Clasificacion Automática</button> */}
            </div>
            <div className='md:px-4 px-2 grid lg:grid-cols-9 uppercase pb-3 gap-4 text-sm'>
                <div className='flex flex-row items-center col-span-3 w-full'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Submodalidad:</label>
                    <div className='flex flex-row items-center md:min-w-[50%] w-3/5 rounded-xl border border-black/25 ml-[8px]'>
                        <select key={formValues.submodalidadId} name="submodalidadId" className={`h-6 border-none rounded-xl w-[90%] pl-[11px] focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("modus_operandi") && formValues?.isClassificated === 2) ? 'bg-blue-300' : ''} ${!formValues?.submodalidadId && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={(e) => { handleFormChange(e); handleModalidad(e.target.selectedOptions[0].getAttribute('dataModalidadId'), null); }} value={formValues.submodalidadId || ''}>
                            <option value="">Seleccione una opción</option>
                            {
                                subModalidad.map(sm => (
                                    <option value={sm.idSubmodalidad} dataModalidadId={sm.modalidadId} key={sm.idSubmodalidad}>{sm.descripcion}</option>
                                ))
                            }
                        </select>
                        <CiCircleInfo className='text-[#005CA2] w-[10%] h-6' data-tooltip-id="tooltip1" data-tooltip-html={`<div style='min-width: 210px; text-align: center; background-color: #005CA2; color: white; border-radius: 8px; padding: 8px; z-index: 100'>${infoSubmodalidad || ''}</div>`}>
                        </CiCircleInfo>
                        <Tooltip
                            id="tooltip1"
                            events={['click']}
                            place='right'
                            style={{ backgroundColor: "#005CA2", zIndex: 1 }}
                        />
                    </div>
                    <p className='pl-2'>{datosIA.submodalidad ? datosIA.submodalidad : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Modalidad:</label>
                    <select name="modalidadId" className='h-6 border-[1px] rounded-xl pl-3 ml-2 border-black/25 md:min-w-[50%] w-3/5 focus:outline focus:outline-[#005CA2] focus:outline-2' onChange={handleFormChange} value={formValues.modalidadId || ''} disabled>
                        <option value="">Seleccione una opción</option>
                        {
                            modalidad.map(mo => (
                                <option value={mo.idModalidad} key={mo.idModalidad}>{mo.descripcion}</option>
                            ))
                        }
                    </select>
                    <p className='pl-2'>{datosIA.modalidad ? datosIA.modalidad : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Especialidad:</label>
                    <select name="especializacionId" type="text" className={`h-6  rounded-xl pl-3  md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${!formValues?.especializacionId && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} value={formValues.especializacionId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            especializacion.map(es => (
                                <option key={es.idEspecializacion} value={es.idEspecializacion}>{es.descripcion}</option>
                            ))
                        }
                    </select>
                    <p className='pl-2'>{datosIA.especializacion ? datosIA.especializacion : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Aprehendido:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(!formValues?.aprehendido || formValues?.aprehendido === '') && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='aprehendido' value={formValues.aprehendido || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                    <p className='pl-2'>{datosIA.aprehendido ? datosIA.aprehendido : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Movilidad:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("movilidad") && formValues?.isClassificated === 2) ? 'bg-green-300' : ''} ${!formValues?.movilidadId && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='movilidadId' value={formValues.movilidadId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            movilidad.map(mo => (
                                <option value={mo.idMovilidad} key={mo.idMovilidad}>{mo.descripcion}</option>
                            ))
                        }
                    </select>
                    <p className='pl-2'>{datosIA.movilidad ? datosIA.movilidad : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Autor:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("autor") && formValues?.isClassificated === 2) ? 'bg-violet-300' : ''} ${!formValues?.autorId && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='autorId' value={formValues.autorId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            autor.map(au => (
                                <option value={au.idAutor} key={au.idAutor}>{au.descripcion}</option>
                            ))
                        }
                    </select>
                    <p className='pl-2'>{datosIA.autor ? datosIA.autor : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Para seguro:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("para_seguro") && formValues?.isClassificated === 2) ? 'bg-yellow-300' : ''} ${(!formValues?.seguro || formValues?.seguro === '') && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='seguro' value={formValues.seguro || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                    <p className='pl-2'>{datosIA.seguro ? datosIA.seguro : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Arma:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("arma_utilizada") && formValues?.isClassificated === 2) ? 'bg-red-300' : ''} ${!formValues?.tipoArmaId && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='tipoArmaId' value={formValues.tipoArmaId || ''}>
                        <option value="">Seleccione una opción</option>
                        {
                            tipoArma.map(ta => (
                                <option value={ta.idTipoArma} key={ta.idTipoArma}>{ta.descripcion}</option>
                            ))
                        }
                    </select>
                    <p className='pl-2'>{datosIA.arma ? datosIA.arma : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Con riesgo:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(!formValues?.victima || formValues?.victima === '') && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='victima' value={formValues.victima || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                    <p className='pl-2'>{datosIA.victima ? datosIA.victima : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right whitespace-nowrap overflow-hidden text-ellipsis'>Elementos sustraidos:</label>
                    <input name="elementoSustraido" className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("elementos_sustraidos") && formValues?.isClassificated === 2) ? 'bg-gray-300' : ''} ${!formValues?.elementoSustraido && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} value={formValues.elementoSustraido || ''} autoComplete='off'></input>
                    <p className='pl-2'>{datosIA.elementoSustraido ? datosIA.elementoSustraido : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Lugar del hecho:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(!formValues?.lugar_del_hecho || formValues?.lugar_del_hecho === '') && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='lugar_del_hecho' value={formValues.lugar_del_hecho || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="via_publica">Via publica</option>
                        <option value="transporte_publico">Transporte publico</option>
                        <option value="comercio">Comercio</option>
                        <option value="vivienda">Vivienda</option>
                        <option value="establecimiento_publico">Establecimiento publico</option>
                        <option value="establecimiento_privado">Establecimiento privado</option>
                        <option value="establecimiento_educativo">Establecimiento educativo</option>
                        <option value="banco_cajero">Banco cajero</option>
                        <option value="campo_finca">Campo / Finca</option>
                        <option value="parada_colectivo">Parada colectivo</option>
                        <option value="evento_masivo">Evento masivo</option>
                        <option value="plaza_parque">Plaza / Parque</option>
                        <option value="desconocido">Desconocido</option>
                    </select>
                    <p className='pl-2'>{datosIA.victima ? datosIA.victima : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Interes:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${!formValues?.interes && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='interes' value={formValues.interes || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="1">SI</option>
                        <option value="0">NO</option>
                    </select>
                    <p className='pl-2'>{datosIA.interes ? datosIA.interes : ''}</p>
                </div>
                <div className='flex flex-row items-center col-span-3'>
                    <label htmlFor="" className='md:w-1/2 w-2/5 text-right'>Cantidad victimario:</label>
                    <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-3/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${!formValues?.cantidad_victimario && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='cantidad_victimario' value={formValues.cantidad_victimario || ''}>
                        <option value="">Seleccione una opción</option>
                        <option value="solo">SOLO</option>
                        <option value="pareja">PAREJA</option>
                        <option value="grupo">GRUPO</option>
                        <option value="desconocido">DESCONOCIDO</option>
                    </select>
                    <p className='pl-2'>{datosIA.interes ? datosIA.interes : ''}</p>
                </div>
            </div>
            <div ref={sectorUbicacion} className='scroll-mt-2 uppercase pb-3 text-sm'>
                <h3 className='text-[#005CA2] font-bold text-2xl text-left my-6 uppercase'>Ubicaciones</h3>
                <div className='flex flex-col lg:flex-row items-center justify-start pb-2 w-full'>
                    <div className={`flex flex-row items-center w-full lg:w-[260px]`}>
                        <label htmlFor="" className='w-1/3 lg:w-full'>Lat y long:</label>
                        <input name="coordenadas" className={`w-2/3 lg:w-96 h-6 rounded-xl pl-3 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(!formValues?.coordenadas || formValues.coordenadas === "null, null") && camposVacios ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} value={formValues.coordenadas || ''} type='text'></input>
                    </div>
                    <div className={`flex lg:flex-row items-center justify-start pt-4 lg:pt-0 w-full`}>
                        <label htmlFor="" className='lg:pl-8 w-1/3 lg:w-auto pr-4'>Estado GEO:</label>
                        <div className="flex flex-col lg:flex-row w-2/3 lg:w-auto">
                            {[
                                { label: 'SD', value: '2' },
                                { label: 'DESCARTADA', value: '5' },
                                { label: 'APROXIMADA', value: '3' },
                                { label: 'EXACTA', value: '1' },
                            ].map((opcion) => (
                                <button
                                    key={opcion.value}
                                    type="button"
                                    name="estado"
                                    onClick={() => handleFormChange({ target: { name: 'estado', value: opcion.value } })}
                                    className={`h-6 w-full px-3 text-sm border
                                    ${formValues.estado === opcion.value
                                            ? 'bg-[#005CA2] text-white border-[#005CA2]'
                                            : 'bg-white text-black border-black/25'} 
                                    ${!formValues?.estado && camposVacios ? 'border-red-600' : ''}
                                    ${opcion.value === '2' ? 'rounded-tl-xl lg:rounded-bl-xl rounded-bl-none rounded-tr-xl lg:rounded-tr-none' : opcion.value === '1' ? 'rounded-br-xl lg:rounded-tr-xl rounded-bl-xl lg:rounded-bl-none lg:rounded-tl-none' : ''}`}
                                >
                                    {opcion.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-row items-center pb-2 w-fit'>
                    <p className='font-bold min-w-fit'>DIRECCION MPF:</p>
                    <a href={`https://www.google.com/maps/place/${denunciaInfo?.Ubicacion?.domicilio
                        ?.replace(/B° /g, 'barrio').replace(/ /g, '+')
                        }+${denunciaInfo?.Ubicacion?.Localidad?.descripcion
                            ?.replace(/ /g, '+') || ''
                        }/`} className='pl-2 text-[#005CA2] underline w-full whitespace-nowrap' target="_blank">{denunciaInfo?.Ubicacion?.domicilio}</a>
                    <FaRegCopy className='ml-1 cursor-pointer' onClick={() => handleCopy('domicilio')} />
                </div>
                <div className='flex flex-row items-center pb-2 w-fit'>
                    <p className='font-bold min-w-fit'>DIRECCION IA:</p>
                    <a href={`https://www.google.com/maps/place/${formValues?.domicilio_ia
                        ?.replace(/B° /g, 'barrio').replace(/ /g, '+')
                        }+${denunciaInfo?.Ubicacion?.Localidad?.descripcion
                            ?.replace(/ /g, '+') || ''
                        }/`} className='pl-2 text-[#005CA2] underline w-full whitespace-nowrap' target="_blank">{formValues?.domicilio_ia}</a>
                    <FaRegCopy className='ml-1 cursor-pointer' onClick={() => handleCopy('domicilio_ia')} />
                </div>
                <div className='flex flex-row items-center pb-2'>
                    <p className='font-bold'>Localidad:</p>
                    <p className='pl-2 w-full'>{denunciaInfo?.Ubicacion?.Localidad?.descripcion}</p>
                </div>
                {
                    (formValues.isClassificated === 2) ?
                        (
                            !mostrarUbicacionManual ?
                                (
                                    (formValues.ubicacionesAuxiliares.length > 0 ?
                                        (<div className='flex flex-col lg:flex-row gap-4 justify-center items-center'>
                                            {
                                                formValues.ubicacionesAuxiliares.map((m, index) => <MapContainer center={{ lat: m.latitudAuxiliar ? m.latitudAuxiliar : 0, lng: m.longitudAuxiliar ? m.longitudAuxiliar : 0 }} zoom={15} scrollWheelZoom={true} className={`h-96 ${(formValues.ubicacionesAuxiliares).length === 1 ? 'w-3/4' : 'w-1/2'}`} key={m.idUbicacionAuxiliar}>
                                                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <Marker position={[m.latitudAuxiliar ? m.latitudAuxiliar : 0, m.longitudAuxiliar ? m.longitudAuxiliar : 0]} draggable={true} icon={getIconByPrecision(m.tipo_precision)} eventHandlers={{
                                                        dragend: (e) => {
                                                            const marker = e.target;
                                                            const { lat, lng } = marker.getLatLng();
                                                            handleMarkerDrag(index, lat, lng);
                                                        }
                                                    }}>
                                                        <Popup>
                                                            <p>Latitud: {m.latitudAuxiliar}</p>
                                                            <p>Longitud: {m.longitudAuxiliar}</p>
                                                            <p>Dirección formateada: {m.domicilioAuxiliar}</p>
                                                            <p>Precision geocoding: {m.tipo_precision ? comprobarPrecision(m.tipo_precision) : "no proporcionada"}</p>
                                                            <button className='bg-[#005CA2]/75 text-white py-2 px-2 rounded-md' onClick={() => handleCopyPaste(`${m.latitudAuxiliar}, ${m.longitudAuxiliar}`)}>Agregar ubicacion</button>
                                                        </Popup>
                                                    </Marker>
                                                </MapContainer>)
                                            }
                                        </div>) :
                                        (<div>
                                            <p className='text-center text-lg font-bold'>No se encontraron ubicaciones</p>
                                        </div>))
                                )
                                :
                                (
                                    (lat && lng) &&
                                    <MapContainer center={{ lat, lng }} zoom={15} scrollWheelZoom={true} className='h-96 w-3/4 mx-auto'>
                                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[((formValues?.coordenadas).split(', ')[0]), ((formValues?.coordenadas).split(', ')[1])]} draggable={true} icon={getIconByPrecision('USUARIO')} eventHandlers={{
                                            dragend: (e) => {
                                                const marker = e.target;
                                                const { lat, lng } = marker.getLatLng();
                                                handleMarkerDrag(index, lat, lng);
                                            }
                                        }}>
                                            <Popup>
                                                <p>Latitud: {lat}</p>
                                                <p>Longitud: {lng}</p>
                                                {/* <p>Dirección: {formValues?.domicilio}</p> */}
                                                {/* <button className='bg-[#005CA2]/75 text-white py-2 px-2 rounded-md' onClick={() => handleCopyPaste(`${m.latitudAuxiliar}, ${m.longitudAuxiliar}`)}>Agregar ubicacion</button> */}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                )
                        )
                        :
                        (
                            (formValues?.latitud && formValues?.longitud) &&
                            <MapContainer center={{ lat: formValues?.latitud, lng: formValues?.longitud }} zoom={15} scrollWheelZoom={true} className='h-96 w-full'>
                                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[formValues?.latitud, formValues?.longitud]} draggable={true} icon={getIconByPrecision('USUARIO')} eventHandlers={{
                                    dragend: (e) => {
                                        const marker = e.target;
                                        const { lat, lng } = marker.getLatLng();
                                        handleMarkerDrag(index, lat, lng);
                                    }
                                }}>
                                    <Popup>
                                        <p>Latitud: {formValues?.latitud}</p>
                                        <p>Longitud: {formValues?.longitud}</p>
                                        <p>Dirección: {formValues?.domicilio}</p>
                                        {/* <button className='bg-[#005CA2]/75 text-white py-2 px-2 rounded-md' onClick={() => handleCopyPaste(`${m.latitudAuxiliar}, ${m.longitudAuxiliar}`)}>Agregar ubicacion</button> */}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        )
                }
            </div>
            <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-6 lg:gap-0 gap-4 py-4 text-sm'>
                <NavLink to={'/sgd/denuncias'} className='text-center py-2 bg-[#757873] text-white rounded-3xl w-40 focus:outline focus:outline-black focus:outline-4' ref={sectorCancelar}>Cancelar</NavLink>
                <button className={`py-2 bg-[#005CA2] text-white rounded-3xl w-40 focus:outline focus:outline-cyan-500 focus:outline-4 ${loadingCarga ? 'animate-pulse' : ''}`} onClick={saveDenuncia} ref={sectorGuargar}>Guardar Clasificación</button>
                {/* <button className='py-2 bg-[#005CA2] text-white rounded-3xl w-40' onClick={obtenerData}>Obtener data</button> */}
            </div>
        </div>
    )
}

export default Clasificacion