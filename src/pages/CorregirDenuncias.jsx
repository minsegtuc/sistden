import { useState, useEffect, useContext } from 'react'
import { ContextConfig } from '../context/ContextConfig';
import Modal from '../components/Modal'

const CorregirDenuncias = () => {

    const { handleSession, HOST, denuncia, socket, relato, setRelato, denunciasIds, handleDenuncia } = useContext(ContextConfig)

    const [isLoading, setIsLoading] = useState(false)
    const [fechaInicio, setFechaInicio] = useState(new Date().getFullYear() + '-' + (new Date().getMonth()).toString().padStart(2, '0') + '-' + new Date().getDate().toString().padStart(2, '0'))
    const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0])
    const [delito, setDelito] = useState('')
    const [submodalidad, setSubmodalidad] = useState('')
    const [interes, setInteres] = useState('')
    const [arma, setArma] = useState('')
    const [denuncias, setDenuncias] = useState([])

    const [autor, setAutor] = useState([])
    const [subModalidad, setSubModalidad] = useState([])
    const [tipoDelito, setTipoDelito] = useState([])
    const [especializacion, setEspecializacion] = useState([])
    const [movilidad, setMovilidad] = useState([])
    const [tipoArma, setTipoArma] = useState([])
    const [modalidad, setModalidad] = useState([])

    const [openModal, setOpenModal] = useState(false)

    const solicitarVista = async () => {
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
                setDenuncias(data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'fechaInicio') {
            setFechaInicio(value)
        } else if (name === 'fechaFin') {
            setFechaFin(value)
        } else if (name === 'delito') {
            setDelito(value)
        } else if (name === 'submodalidad') {
            setSubmodalidad(value)
        } else if (name === 'interes') {
            setInteres(value)
        } else if (name === 'arma') {
            setArma(value)
        }
    }

    const limpiarFiltros = () => {
        setFechaInicio('')
        setFechaFin('')
        setDelito('')
        setSubmodalidad('')
        setInteres('')
        setArma('')
    }

    const handleDenunciaClick = (denuncia) => {
        console.log(denuncia)
        handleDenuncia(denuncia)
        setOpenModal(true)
    }

    

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

    return (
        <div className='flex flex-col px-8 pt-8 overflow-y-scroll overflow-x-hidden w-full'>
            <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center mb-2'>Corregir denuncias</h2>
            <div className='bg-gray-300 p-2 rounded-lg w-full mt-2 flex flex-col lg:flex-row justify-center items-center'>
                <div className='flex flex-col lg:flex-wrap lg:flex-row mt-2 lg:w-5/6 w-full'>
                    <div className='flex flex-col lg:flex-row justify-center border-r-[1px] items-center gap-2 px-4 py-1'>
                        <label className='text-xs font-semibold whitespace-nowrap text-left'>Fecha de inicio:</label>
                        <input type="date" name='fechaInicio' value={fechaInicio} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg p-2 h-7 text-xs min-w-36' />
                        <label className='text-xs font-semibold whitespace-nowrap'>Fecha de fin:</label>
                        <input type="date" name='fechaFin' value={fechaFin} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg p-2 h-7 text-xs min-w-36' />
                    </div>
                    <div className='flex flex-col lg:flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                        <label htmlFor="" className='text-xs font-semibold'>Interes:</label>
                        <select name="interes" value={interes} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36'>
                            <option value="">Seleccione una opcion</option>
                            <option value="SI">SI</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                    <div className='flex flex-col lg:flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                        <label htmlFor="" className='text-xs font-semibold'>Delito:</label>
                        <select name="delito" value={delito} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36'>
                            <option value="">Seleccione una opcion</option>
                            {
                                tipoDelito.map((delito) => (
                                    <option key={delito.idTipoDelito} value={delito.descripcion}>{delito.descripcion}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='flex flex-col lg:flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                        <label htmlFor="" className='text-xs font-semibold'>Submodalidad:</label>
                        <select name="submodalidad" value={submodalidad} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36'>
                            <option value="">Seleccione una opcion</option>
                            {
                                subModalidad.map(sm => (
                                    <option value={sm.descripcion} dataModalidadId={sm.modalidadId} key={sm.idSubmodalidad}>{sm.descripcion}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='flex flex-col lg:flex-row justify-center items-center gap-2 border-r-[1px] px-4 py-1'>
                        <label htmlFor="" className='text-xs font-semibold'>Arma:</label>
                        <select name="arma" value={arma} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg h-7 text-xs max-w-36'>
                            <option value="">Seleccione una opcion</option>
                            {
                                tipoArma.map(arma => (
                                    <option key={arma.idTipoArma} value={arma.descripcion}>{arma.descripcion}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className='flex flex-row flex-wrap justify-center items-center gap-2 lg:w-1/6 w-full'>
                    <button className={`text-sm font-semibold text-center px-4 py-1 rounded-2xl w-36 text-white disabled:bg-opacity-55 transition-colors bg-black`} onClick={limpiarFiltros}>Limpiar filtros</button>
                    <button className={`text-sm font-semibold text-center px-4 py-1  rounded-2xl w-36 text-white disabled:bg-opacity-55 transition-colors bg-[#005CA2]  ${isLoading ? 'animate-pulse' : ''}`} onClick={solicitarVista}>Buscar</button>
                </div>
            </div>
            {
                denuncias.length > 0 ? (
                    <div className='overflow-x-scroll w-full mt-4 mb-8 max-h-[450px]'>
                        <table className='mt-2  overflow-scroll text-[13px] '>
                            <thead className='bg-[#005CA2] text-white sticky top-0'>
                                <tr>
                                    <th className='px-2 text-center'>NRO_DENUNCIA</th>
                                    <th className='px-2 text-center'>FECHA</th>
                                    <th className='px-2 text-center'>DELITO</th>
                                    <th className='px-2 text-center'>LOCALIDAD</th>
                                    <th className='px-2 text-center'>COMISARIA</th>
                                    {/* <th className='px-2 text-center'>FISCALIA</th> */}
                                    {/* <th className='px-2 text-center'>ESPECIALIZACION</th> */}
                                    <th className='px-2 text-center'>INTERES</th>
                                    <th className='px-2 whitespace-nowrap text-center'>FECHA HECHO</th>
                                    {/* <th className='px-2 text-center'>CALLE</th> */}
                                    {/* <th className='px-2 text-center'>HORA</th> */}
                                    <th className='px-2 text-center'>MODALIDAD</th>
                                    <th className='px-2 text-center'>SUBMODALIDAD</th>
                                    <th className='px-2 text-center'>APREHENDIDO</th>
                                    <th className='px-2 whitespace-nowrap text-center'>CANTIDAD VICTIMARIO</th>
                                    <th className='px-2 whitespace-nowrap text-center'>LUGAR DEL HECHO</th>
                                    {/* <th className='px-2 text-center'>MEDIDA</th> */}
                                    <th className='px-2 text-center'>MOVIVLIDAD</th>
                                    <th className='px-2 text-center'>AUTOR</th>
                                    <th className='px-2 whitespace-nowrap text-center'>ARMA UTILIZADA</th>
                                    <th className='px-2 whitespace-nowrap text-center'>PARA SEGURO</th>
                                    <th className='px-2 text-center'>RIESGO</th>
                                    <th className='px-2 whitespace-nowrap text-center'>ELEMENTOS SUSTRAIDOS</th>
                                    <th className='px-2 whitespace-nowrap text-center'>COORDENADAS GEO</th>
                                    <th className='px-2 whitespace-nowrap text-center'>ESTADO GEO</th>
                                    {/* <th className='px-2 text-center'>DEPARTAMENTO</th> */}
                                    {/* <th className='px-2 text-center whitespace-nowrap'>UNIDAD REGIONAL</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    denuncias.map((denuncia) => (
                                        <tr className='border-b-[1px] border-gray-300 hover:bg-[#005CA2]/25 cursor-pointer' key={denuncia.NRO_DENUNCIA} onClick={() => handleDenunciaClick(denuncia.NRO_DENUNCIA)}>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.NRO_DENUNCIA}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.FECHA}</td>
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.DELITO}</td>
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.LOCALIDAD}</td>
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.COMISARIA}</td>
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.FISCALIA}</td> */}
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.ESPECIALIZACION}</td> */}
                                            <td className='py-4 px-2 text-center'>{denuncia.INTERES}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.FECHA_HECHO}</td>
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.CALLE}</td> */}
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.HORA}</td> */}
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.MODALIDAD}</td>
                                            <td className='py-4 px-2 text-center whitespace-nowrap'>{denuncia.SUBMODALIDAD}</td>
                                            <td className='py-4 px-2 text-center'>{denuncia.APREHENDIDO}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.Cantidad_victimario}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.Lugar_Del_Hecho}</td>
                                            {/* <td className='py-4 px-2 text-center'>{denuncia.MEDIDA}</td> */}
                                            <td className='py-4 px-2 text-center'>{denuncia.MOVIVLIDAD}</td>
                                            <td className='py-4 px-2 text-center'>{denuncia.AUTOR}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia["ARMA UTILIZADA"]}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia["PARA SEGURO"]}</td>
                                            <td className='py-4 px-2'>{denuncia.VICTIMA}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.ELEMENTOS_SUSTRAIDOS}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.COORDENADAS_GEO}</td>
                                            <td className='py-4 px-2 whitespace-nowrap text-center'>{denuncia.ESTADO_GEO}</td>
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
            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
            </Modal>
        </div >
    )
}

export default CorregirDenuncias