import { useState, useEffect, useContext } from 'react'
import { CiCircleCheck, CiCircleRemove, CiCircleInfo, CiTrash } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import { RiRobot2Line } from "react-icons/ri";
import { ContextConfig } from '../context/ContextConfig';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"
import Modal from '../components/Modal'

const CorregirDenuncias = () => {

    const { handleSession, HOST, denuncia, socket, relato, setRelato, denunciasIds, handleDenuncia } = useContext(ContextConfig)

    const [isLoading, setIsLoading] = useState(false)
    const [isDownload, setIsDownload] = useState(false)
    const [fechaInicio, setFechaInicio] = useState(new Date().getFullYear() + '-' + (new Date().getMonth()).toString().padStart(2, '0') + '-' + new Date().getDate().toString().padStart(2, '0'))
    const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0])
    const [delito, setDelito] = useState('')
    const [submodalidad, setSubmodalidad] = useState('')
    const [interes, setInteres] = useState('')
    const [arma, setArma] = useState('')
    const [especialidad, setEspecialidad] = useState('')
    const [seguro, setSeguro] = useState('')
    const [riesgo, setRiesgo] = useState('')
    const [comisaria, setComisaria] = useState('')
    const [lugar_del_hecho, setLugar_del_hecho] = useState('')
    const [denuncias, setDenuncias] = useState([])

    const [autor, setAutor] = useState([])
    const [subModalidad, setSubModalidad] = useState([])
    const [tipoDelito, setTipoDelito] = useState([])
    const [especializacion, setEspecializacion] = useState([])
    const [movilidad, setMovilidad] = useState([])
    const [tipoArma, setTipoArma] = useState([])
    const [modalidad, setModalidad] = useState([])
    const [comisarias, setComisarias] = useState([])

    const [filtros, setFiltros] = useState([])
    const [autorFiltrado, setAutorFiltrado] = useState([])
    const [subModalidadFiltrado, setSubModalidadFiltrado] = useState([])
    const [tipoDelitoFiltrado, setTipoDelitoFiltrado] = useState([])
    const [especializacionFiltrado, setEspecializacionFiltrado] = useState([])
    const [movilidadFiltrado, setMovilidadFiltrado] = useState([])
    const [tipoArmaFiltrado, setTipoArmaFiltrado] = useState([])
    const [modalidadFiltrado, setModalidadFiltrado] = useState([])
    const [seguroFiltrado, setSeguroFiltrado] = useState([])
    const [riesgoFiltrado, setRiesgoFiltrado] = useState([])
    const [lugarFiltrado, setLugarFiltrado] = useState([])
    const [comisariaFiltrado, setComisariaFiltrado] = useState([])

    const [openModal, setOpenModal] = useState(false)
    const [denunciaSearch, setDenunciaSearch] = useState('')

    const [loadingSelect, setLoadingSelect] = useState(false)
    const [viewFiltros, setViewFiltros] = useState(true)

    const handleSearch = (e) => {
        setDenunciaSearch(e.target.value)
    }

    const solicitarVista = async () => {
        setDenuncias([])
        setIsLoading(true)
        fetch(`${HOST}/api/usuario/vista`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                delito: delito,
                submodalidad: submodalidad,
                interes: interes,
                arma: arma,
                especializacion: especialidad,
                seguro: seguro,
                riesgo: riesgo,
                lugar_del_hecho: lugar_del_hecho,
                comisaria: comisaria
            })
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                } else if (res.status === 401) {
                    handleSession()
                } else {
                    throw new Error('Error al solicitar la vista')
                }
            })
            .then((data) => {
                setDenuncias(data.filter(d => d['CLASIFICADA POR'] !== 2))
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
    }

    const convertirA_CSV = (data) => {
        if (!data.length) return '';

        const encabezados = Object.keys(data[0]).join(',');
        const filas = data.map(row =>
            Object.values(row)
                .map(val => {
                    const limpio = (val !== null && val !== undefined)
                        ? val.toString()
                            .replace(/<[^>]*>/g, '')       // elimina etiquetas HTML
                            .replace(/[\r\n]+/g, ' ')      // reemplaza saltos de línea por espacio
                            .replace(/"/g, '""')           // escapa comillas dobles
                        : '';
                    return `"${limpio}"`;
                })
                .join(',')
        );
        return [encabezados, ...filas].join('\n');
    };

    const descargarVista = () => {
        setIsDownload(true)
        fetch(`${HOST}/api/usuario/vista`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                delito: delito,
                submodalidad: submodalidad,
                interes: interes,
                arma: arma,
                especializacion: especialidad,
                seguro: seguro,
                riesgo: riesgo,
                lugar_del_hecho: lugar_del_hecho,
                comisaria: comisaria
            })
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                } else if (res.status === 401) {
                    handleSession()
                } else {
                    throw new Error('Error al solicitar la vista')
                }
            })
            .then((data) => {
                setIsDownload(false);

                const csv = convertirA_CSV(data);
                const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'denuncias.csv');
                link.click();
                URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
    }

    const handleFiltros = (filtros) => {
        // console.log("Inside handleFiltros")
        // console.log(filtros)

        const limpiarArray = (arr) => arr.filter(item => item !== null && item !== undefined && item !== "").sort();
        const delitosUnicos = [...new Set(limpiarArray(filtros.delitos))];
        const submodalidadesUnicas = [...new Set(limpiarArray(filtros.submodalidades))];
        const especializacionesUnicas = [...new Set(limpiarArray(filtros.especializaciones))];
        const armasUnicas = [...new Set(limpiarArray(filtros.armas))];
        const seguroUnico = [...new Set(limpiarArray(filtros.seguros))];
        const riesgoUnico = [...new Set(limpiarArray(filtros.riesgos))];
        const lugarUnico = [...new Set(limpiarArray(filtros.lugares))];
        const comisariaUnica = [...new Set(limpiarArray(filtros.comisarias))];

        //console.log(delitosUnicos, submodalidadesUnicas, especializacionesUnicas, armasUnicas, seguroUnico, riesgoUnico, lugarUnico, comisariaUnica)

        setTipoDelitoFiltrado(delitosUnicos);
        setSubModalidadFiltrado(submodalidadesUnicas);
        setEspecializacionFiltrado(especializacionesUnicas);
        setTipoArmaFiltrado(armasUnicas);
        setSeguroFiltrado(seguroUnico);
        setRiesgoFiltrado(riesgoUnico);
        setLugarFiltrado(lugarUnico)
        setComisariaFiltrado(comisariaUnica);
        setLoadingSelect(false)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        //console.log("Nombre del campo:", name, "Valor:", value)
        if (name === 'fechaInicio') {
            setFechaInicio(value)
        }
        if (name === 'fechaFin') {
            setFechaFin(value)
        }
        if (name === 'delito') {
            setLoadingSelect(true)
            setDelito(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: value,
                    submodalidad: submodalidad,
                    interes: interes,
                    arma: arma,
                    riesgo: riesgo,
                    especialidad: especialidad,
                    seguro: seguro,
                    lugar_del_hecho: lugar_del_hecho,
                    comisaria: comisaria
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (name === 'submodalidad') {
            setLoadingSelect(true)
            setSubmodalidad(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: delito,
                    submodalidad: value,
                    interes: interes,
                    arma: arma,
                    riesgo: riesgo,
                    especialidad: especialidad,
                    seguro: seguro,
                    lugar_del_hecho: lugar_del_hecho,
                    comisaria: comisaria
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (name === 'interes') {
            setLoadingSelect(true)
            setInteres(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: delito,
                    submodalidad: submodalidad,
                    interes: value,
                    arma: arma,
                    riesgo: riesgo,
                    especialidad: especialidad,
                    seguro: seguro,
                    lugar_del_hecho: lugar_del_hecho,
                    comisaria: comisaria
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (name === 'arma') {
            setLoadingSelect(true)
            setArma(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: delito,
                    submodalidad: submodalidad,
                    interes: interes,
                    arma: value,
                    riesgo: riesgo,
                    especialidad: especialidad,
                    seguro: seguro,
                    lugar_del_hecho: lugar_del_hecho,
                    comisaria: comisaria
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })

        }
        if (name === 'especialidad') {
            setLoadingSelect(true)
            setEspecialidad(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: delito,
                    submodalidad: submodalidad,
                    interes: interes,
                    arma: arma,
                    especialidad: value,
                    seguro: seguro,
                    riesgo: riesgo,
                    lugar_del_hecho: lugar_del_hecho,
                    comisaria: comisaria
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    //console.log("Data propiedad: ", data)
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (name === 'seguro') {
            setLoadingSelect(true)
            setSeguro(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: delito,
                    submodalidad: submodalidad,
                    interes: interes,
                    arma: arma,
                    especialidad: especialidad,
                    riesgo: riesgo,
                    seguro: value,
                    lugar_del_hecho: lugar_del_hecho,
                    comisaria: comisaria
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (name === 'riesgo') {
            setLoadingSelect(true)
            setRiesgo(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: delito,
                    submodalidad: submodalidad,
                    interes: interes,
                    arma: arma,
                    riesgo: value,
                    especialidad: especialidad,
                    seguro: seguro,
                    lugar_del_hecho: lugar_del_hecho,
                    comisaria: comisaria
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    //console.log("Filtros obtenidos riesgo:", data)
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (name === 'lugar_del_hecho') {
            setLoadingSelect(true)
            setLugar_del_hecho(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: delito,
                    submodalidad: submodalidad,
                    interes: interes,
                    arma: arma,
                    riesgo: riesgo,
                    especialidad: especialidad,
                    seguro: seguro,
                    lugar_del_hecho: value,
                    comisaria: comisaria
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    //console.log("Filtros obtenidos riesgo:", data)
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (name === 'comisaria') {
            setLoadingSelect(true)
            setComisaria(value)
            fetch(`${HOST}/api/usuario/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    delito: delito,
                    submodalidad: submodalidad,
                    interes: interes,
                    arma: arma,
                    riesgo: riesgo,
                    especialidad: especialidad,
                    seguro: seguro,
                    lugar_del_hecho: lugar_del_hecho,
                    comisaria: value
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 401) {
                        handleSession()
                    } else {
                        throw new Error('Error al solicitar filtros')
                    }
                })
                .then((data) => {
                    //console.log("Filtros obtenidos riesgo:", data)
                    handleFiltros(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const limpiarFiltros = () => {
        setDelito('')
        setSubmodalidad('')
        setInteres('')
        setArma('')
        setEspecialidad('')
        setSeguro('')
        setRiesgo('')
        setLugar_del_hecho('')
        setComisaria('')

        setDenuncias([])

        setTipoArmaFiltrado([])
        setTipoDelitoFiltrado([])
        setSubModalidadFiltrado([])
        setEspecializacionFiltrado([])
        setSeguroFiltrado([])
        setRiesgoFiltrado([])
        setLugarFiltrado([])
        setComisariaFiltrado([])
    }

    const handleDenunciaClick = (denuncia) => {
        // console.log(denuncia)
        handleDenuncia(denuncia)
        setOpenModal(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [autor, subModalidad, tipoDelito, especializacion, movilidad, tipoArma, modalidad, comisarias] = await Promise.all([
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
                    fetch(`${HOST}/api/comisaria/comisaria`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        credentials: 'include'
                    })
                ])

                const data1 = await autor.json()
                const data2 = await subModalidad.json()
                const data3 = await tipoDelito.json()
                const data4 = await especializacion.json()
                const data5 = await movilidad.json()
                const data6 = await tipoArma.json()
                const data7 = await modalidad.json()
                const data8 = await comisarias.json()

                setAutor(data1)
                setSubModalidad(data2)
                setTipoDelito(data3)
                setEspecializacion(data4)
                setMovilidad(data5)
                setTipoArma(data6)
                setModalidad(data7)
                setComisarias(data8)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (denunciaSearch !== '' && denunciaSearch.length >= 13) {
            const denunciaEncoded = encodeURIComponent(denunciaSearch);

            fetch(`${HOST}/api/denuncia/denuncia/buscar`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    denuncia: denunciaEncoded
                })
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
                    //console.log(data)
                    setDenuncias(data)
                })
        } else {
            setDenuncias([])
        }
    }, [denunciaSearch])

    return (
        <div className='flex flex-col px-8 pt-8 overflow-y-scroll overflow-x-hidden w-full'>
            <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center mb-2'>Corregir denuncias</h2>
            <div className='bg-gray-300 p-2 rounded-lg w-full mt-2'>
                <div className='flex flex-row justify-between items-center'>
                    <div className='relative w-[70%] md:w-[90%] flex justify-start items-center'>
                        <input className='w-full text-[11px] h-8 px-4 rounded-md border-[#757873] border-2' placeholder='Buscar N° de Denuncia' onChange={handleSearch} />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <BsSearch className="text-[#757873]" />
                        </div>
                    </div>
                    <button className={`text-sm font-semibold text-center ml-2 px-[5px] rounded-md w-[30%] md:w-[10%] text-white disabled:bg-opacity-55 transition-colors bg-black h-8`}>
                        {
                            viewFiltros ?
                                <div className='flex flex-row justify-center items-center gap-2' onClick={() => setViewFiltros(!viewFiltros)}>
                                    <p className='text-[13px]'>Ocultar filtros</p>
                                    <FaRegEyeSlash title="Ocultar filtros" className='text-[13px] hidden md:flex' />
                                </div>
                                :
                                <div className='flex flex-row justify-center items-center gap-2' onClick={() => setViewFiltros(!viewFiltros)}>
                                    <p className='text-[13px]'>Ver filtros</p>
                                    <FaRegEye title="Ver filtros" className='text-[13px] hidden md:flex' />
                                </div>
                        }
                    </button>
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
                                <div className='flex flex-col md:flex-row justify-between items-center'>
                                    <div className='flex flex-col lg:flex-wrap lg:flex-row mt-2 lg:w-5/6 w-full'>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label className='text-xs font-semibold whitespace-nowrap md:text-left text-right w-1/3 md:w-full'>Fecha de inicio:</label>
                                            <input type="date" name='fechaInicio' value={fechaInicio} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg p-2 h-7 text-xs min-w-36' />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label className='text-xs font-semibold whitespace-nowrap md:text-left text-right w-1/3 md:w-full'>Fecha de fin:</label>
                                            <input type="date" name='fechaFin' value={fechaFin} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg p-2 h-7 text-xs min-w-36' />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Interes:</label>
                                            <select name="interes" value={interes} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                <option value="SI">SI</option>
                                                <option value="NO">NO</option>
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'interes', value: '' } })} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Propiedad:</label>
                                            <select name="especialidad" value={especialidad} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                {
                                                    especializacionFiltrado.length > 0 ?
                                                        (
                                                            especializacionFiltrado.map((especializacion) => (
                                                                <option key={especializacion} value={especializacion}>{especializacion}</option>
                                                            ))
                                                        )
                                                        :
                                                        (
                                                            especializacion.map((especializacion) => (
                                                                <option key={especializacion.idEspecializacion} value={especializacion.descripcion}>{especializacion.descripcion}</option>
                                                            ))
                                                        )
                                                }
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'especialidad', value: '' } })} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Delito:</label>
                                            <select name="delito" value={delito} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                {
                                                    tipoDelitoFiltrado.length > 0 ?
                                                        (
                                                            tipoDelitoFiltrado.map((delito) => (
                                                                <option key={delito} value={delito}>{delito}</option>
                                                            ))
                                                        )
                                                        :
                                                        (
                                                            tipoDelito.map((delito) => (
                                                                <option key={delito.idTipoDelito} value={delito.descripcion}>{delito.descripcion}</option>
                                                            ))
                                                        )
                                                }
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'delito', value: '' } })} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Submodalidad:</label>
                                            <select name="submodalidad" value={submodalidad} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                {
                                                    subModalidadFiltrado.length > 0 ?
                                                        (
                                                            subModalidadFiltrado.map((submodalidad) => (
                                                                <option key={submodalidad} value={submodalidad}>{submodalidad}</option>
                                                            ))
                                                        )
                                                        :
                                                        subModalidad.map(sm => (
                                                            <option value={sm.descripcion} dataModalidadId={sm.modalidadId} key={sm.idSubmodalidad}>{sm.descripcion}</option>
                                                        ))
                                                }
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'submodalidad', value: '' } })} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Arma:</label>
                                            <select name="arma" value={arma} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                {
                                                    tipoArmaFiltrado.length > 0 ?
                                                        (
                                                            tipoArmaFiltrado.map((arma) => (
                                                                <option key={arma} value={arma}>{arma}</option>
                                                            ))
                                                        )
                                                        :
                                                        tipoArma.map(arma => (
                                                            <option key={arma.idTipoArma} value={arma.descripcion}>{arma.descripcion}</option>
                                                        ))
                                                }
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'arma', value: '' } })} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Seguro:</label>
                                            <select name="seguro" value={seguro} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                {
                                                    seguroFiltrado.length > 0 ?
                                                        (
                                                            seguroFiltrado.map((seguro) => (
                                                                <option key={seguro} value={seguro}>{seguro}</option>
                                                            ))
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                <option value="SI">SI</option>
                                                                <option value="NO">NO</option>
                                                            </>
                                                        )
                                                }
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'seguro', value: '' } })} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Riesgo:</label>
                                            <select name="riesgo" value={riesgo} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                {
                                                    riesgoFiltrado.length > 0 ?
                                                        (
                                                            riesgoFiltrado.map((riesgo) => (
                                                                <option key={riesgo} value={riesgo}>{riesgo}</option>
                                                            ))
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                <option value="CON RIESGO">CON RIESGO</option>
                                                                <option value="SIN RIESGO">SIN RIESGO</option>
                                                            </>
                                                        )
                                                }
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'riesgo', value: '' } })} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Lugar del hecho:</label>
                                            <select name="lugar_del_hecho" value={lugar_del_hecho} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                {
                                                    lugarFiltrado.length > 0 ?
                                                        (
                                                            lugarFiltrado.map((lugar_del_hecho) => (
                                                                <option key={lugar_del_hecho} value={lugar_del_hecho}>{lugar_del_hecho}</option>
                                                            ))
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                <option value="via_publica">Via publica</option>
                                                                <option value="transporte_publico">Transporte publico</option>
                                                                <option value="comercio">Comercio</option>
                                                                <option value="vivienda">Vivienda</option>
                                                                <option value="establecimiento_publico">Establecimiento publico</option>
                                                                <option value="establecimiento_privado">Establecimiento privado</option>
                                                                <option value="establecimiento_educativo">Establecimiento educativo</option>
                                                                <option value="banco_cajero">Banco cajero</option>
                                                                <option value="campo_finca">Campo / Finca</option>
                                                                <option value="parada_colectivos">Parada colectivo</option>
                                                                <option value="evento_masivo">Evento masivo</option>
                                                                <option value="plaza_parque">Plaza / Parque</option>
                                                                <option value="desconocido">Desconocido</option>
                                                            </>
                                                        )
                                                }
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'lugar_del_hecho', value: '' } })} />
                                        </div>
                                        <div className='flex flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                                            <label htmlFor="" className='text-xs font-semibold md:text-left text-right w-1/3 md:w-fit'>Comisaria:</label>
                                            <select name="comisaria" value={comisaria} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36' disabled={loadingSelect ? true : false}>
                                                <option value="">Seleccione una opcion</option>
                                                {
                                                    comisariaFiltrado.length > 0 ?
                                                        (
                                                            comisariaFiltrado.map((comisaria) => (
                                                                <option key={comisaria} value={comisaria}>{comisaria}</option>
                                                            ))
                                                        )
                                                        :
                                                        (
                                                            comisarias.map((comisaria) => (
                                                                <option key={comisaria.idComisaria} value={comisaria.descripcion}>{comisaria.descripcion}</option>
                                                            ))
                                                        )
                                                }
                                            </select>
                                            <CiTrash className='md:min-h-2 md:w-auto' onClick={() => handleChange({ target: { name: 'comisaria', value: '' } })} />
                                        </div>
                                    </div>
                                    <div className='flex flex-row flex-wrap justify-center items-center gap-2 lg:w-1/6 w-full mt-2'>
                                        <button className={`text-sm font-semibold text-center px-4 py-1 rounded-2xl w-32 text-white disabled:bg-opacity-55 transition-colors bg-black`} onClick={limpiarFiltros}>Limpiar filtros</button>
                                        <button className={`text-sm font-semibold text-center px-4 py-1 rounded-2xl w-32 text-white disabled:bg-opacity-55 transition-colors bg-black  ${isDownload ? 'animate-pulse' : ''}`} onClick={descargarVista}>Descargar</button>
                                        <button className={`text-sm font-semibold text-center px-4 py-1 rounded-2xl w-32 text-white disabled:bg-opacity-55 transition-colors bg-[#005CA2]  ${isLoading ? 'animate-pulse' : ''}`} onClick={solicitarVista}>Buscar</button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
            {
                denuncias.length > 0 ? (
                    <div className='overflow-x-scroll w-full mt-4 mb-8 max-h-[450px]'>
                        <table className='mt-2  overflow-scroll text-[13px] '>
                            <thead className='bg-[#005CA2] text-white sticky top-0'>
                                <tr>
                                    <th className='text-center'>N°</th>
                                    <th className='px-2'>CLASIFICADA</th>
                                    <th className='px-2 text-center'>NRO_DENUNCIA</th>
                                    <th className='px-2 text-center'>FECHA</th>
                                    <th className='px-2 text-center'>DELITO</th>
                                    <th className='px-2 text-center whitespace-nowrap'>DELITO MPF</th>
                                    {/* <th className='px-2 text-center'>LOCALIDAD</th> */}
                                    <th className='px-2 text-center'>COMISARIA</th>
                                    {/* <th className='px-2 text-center'>FISCALIA</th> */}
                                    <th className='px-2 text-center'>ESPECIALIZACION</th>
                                    <th className='px-2 text-center'>INTERES</th>
                                    {/* <th className='px-2 whitespace-nowrap text-center'>FECHA HECHO</th> */}
                                    {/* <th className='px-2 text-center'>CALLE</th> */}
                                    {/* <th className='px-2 text-center'>HORA</th> */}
                                    <th className='px-2 text-center'>MODALIDAD</th>
                                    <th className='px-2 text-center'>SUBMODALIDAD</th>
                                    {/* <th className='px-2 text-center'>APREHENDIDO</th> */}
                                    {/* <th className='px-2 whitespace-nowrap text-center'>CANTIDAD VICTIMARIO</th> */}
                                    <th className='px-2 whitespace-nowrap text-center'>LUGAR DEL HECHO</th>
                                    {/* <th className='px-2 text-center'>MEDIDA</th> */}
                                    {/* <th className='px-2 text-center'>MOVIVLIDAD</th> */}
                                    {/* <th className='px-2 text-center'>AUTOR</th> */}
                                    <th className='px-2 whitespace-nowrap text-center'>ARMA UTILIZADA</th>
                                    <th className='px-2 whitespace-nowrap text-center'>PARA SEGURO</th>
                                    <th className='px-2 text-center'>RIESGO</th>
                                    <th className='px-2 whitespace-nowrap text-center text-ellipsis max-w-52'>ELEMENTOS SUSTRAIDOS</th>
                                    {/* <th className='px-2 whitespace-nowrap text-center'>COORDENADAS GEO</th> */}
                                    {/* <th className='px-2 whitespace-nowrap text-center'>ESTADO GEO</th> */}
                                    {/* <th className='px-2 text-center'>DEPARTAMENTO</th> */}
                                    {/* <th className='px-2 text-center whitespace-nowrap'>UNIDAD REGIONAL</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    denuncias.map((denuncia, index) => (
                                        <tr className='border-b-[1px] border-gray-300 hover:bg-[#005CA2]/25 cursor-pointer' key={denuncia.NRO_DENUNCIA} onClick={() => handleDenunciaClick(denuncia.NRO_DENUNCIA)}>
                                            <td className='text-center'>{index + 1}</td>
                                            <td className='px-2'>{denuncia['CLASIFICADA POR'] === 1 ? (<CiCircleCheck className='text-4xl text-green-900 ml-auto mr-auto' />) : denuncia['CLASIFICADA POR'] === 2 ? <RiRobot2Line className='text-4xl text-blue-900 ml-auto mr-auto' /> : (<CiCircleRemove className='text-4xl text-red-900 ml-auto mr-auto' />)}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'><a href={`https://noteweb.mpftucuman.gob.ar/noteweb3.0/denview.php?id=${(denuncia.NRO_DENUNCIA).match(/\d+/)[0]}`} target="_blank" className='pl-2 text-[#005CA2] underline'>{denuncia.NRO_DENUNCIA}</a></td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.FECHA}</td>
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.DELITO}</td>
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia['DELITO MPF']}</td>
                                            {/* <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.LOCALIDAD}</td> */}
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.COMISARIA}</td>
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.FISCALIA}</td> */}
                                            <td className='py-4 px-2 text-center'>{denuncia.ESPECIALIZACION}</td>
                                            <td className='py-4 px-2 text-center'>{denuncia.INTERES}</td>
                                            {/* <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.FECHA_HECHO}</td> */}
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.CALLE}</td> */}
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.HORA}</td> */}
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.MODALIDAD}</td>
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.SUBMODALIDAD}</td>
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.APREHENDIDO}</td> */}
                                            {/* <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.Cantidad_victimario}</td> */}
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.Lugar_del_Hecho}</td>
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.MEDIDA}</td> */}
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.MOVILIDAD}</td> */}
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.AUTOR}</td> */}
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia["ARMA UTILIZADA"]}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia["PARA SEGURO"]}</td>
                                            <td className='py-4 px-2 text-center'>{denuncia.VICTIMA}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center text-ellipsis overflow-hidden max-w-52'>{denuncia['ELEMENTOS SUSTRAIDOS']}</td>
                                            {/* <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.COORDENADAS_GEO}</td> */}
                                            {/* <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.Estado_Geo}</td> */}
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.DEPARTAMENTO}</td> */}
                                            {/* <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.UNIDAD_REGIONAL}</td> */}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                ) : ''
            }
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)} recargarDenuncias={solicitarVista}>
            </Modal>
        </div >
    )
}

export default CorregirDenuncias