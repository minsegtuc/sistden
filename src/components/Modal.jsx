import { useState, useEffect, useContext, useRef } from 'react'
import { ContextConfig } from '../context/ContextConfig';
import { CiCircleCheck, CiCircleRemove, CiCircleInfo } from "react-icons/ci";
import { RiRobot2Line } from "react-icons/ri";
import { Tooltip } from 'react-tooltip';
import Cookies from 'js-cookie';
import { use } from 'react';
import { on } from 'ws';
import parse from "html-react-parser";
import Swal from 'sweetalert2'

const Modal = ({ isOpen, onClose, recargarDenuncias, children }) => {

    const { handleSession, HOST, denuncia, socket, relato, setRelato, denunciasIds, handleDenuncia } = useContext(ContextConfig)

    const [autor, setAutor] = useState([])
    const [subModalidad, setSubModalidad] = useState([])
    const [tipoDelito, setTipoDelito] = useState([])
    const [especializacion, setEspecializacion] = useState([])
    const [movilidad, setMovilidad] = useState([])
    const [tipoArma, setTipoArma] = useState([])
    const [modalidad, setModalidad] = useState([])

    const [denunciaInfo, setDenunciaInfo] = useState({});
    const [idsDetectados, setIdsDetectados] = useState([])
    const [contenidoParseado, setContenidoParseado] = useState(null)
    const [formValues, setFormValues] = useState({
        idDenuncia: denunciaInfo?.idDenuncia || '',
        especializacionId: denunciaInfo?.especializacionId || '',
        submodalidadId: denunciaInfo?.submodalidadId || '',
        autorId: denunciaInfo?.autorId || '',
        modalidadId: denunciaInfo?.submodalidad?.modalidad?.idModalidad || '',
        movilidadId: denunciaInfo?.movilidad?.idMovilidad || '',
        aprehendido: denunciaInfo?.aprehendido !== undefined ? String(denunciaInfo?.aprehendido) : '',
        seguro: denunciaInfo?.seguro !== undefined ? String(denunciaInfo.seguro) : '',
        tipoArmaId: denunciaInfo?.tipoArmaId || '',
        victima: denunciaInfo?.victima !== undefined ? String(denunciaInfo?.victima) : '',
        interes: denunciaInfo?.interes || (denuncia?.charAt(0) === 'A' ? "0" : "1") || '',
        tipoDelitoId: denunciaInfo?.tipoDelito?.idTipoDelito || '',
        latitud: denunciaInfo?.Ubicacion?.latitud || '',
        longitud: denunciaInfo?.Ubicacion?.longitud || '',
        estado: denunciaInfo?.Ubicacion?.estado || '',
        lugar_del_hecho: denunciaInfo?.lugar_del_hecho || null,
        cantidad_victimario: denunciaInfo?.cantidad_victimario || null,
        elementoSustraido: denunciaInfo?.elementoSustraido || '',
        relato: denunciaInfo?.relato || "",
    });

    const [loadingCarga, setLoadingCarga] = useState(false)

    const estilosPorId = {
        autor: "text-violet-600 font-bold",
        modus_operandi: "text-blue-600 font-bold",
        para_seguro: "text-yellow-600 font-bold",
        arma_utilizada: "text-red-600 font-bold",
        movilidad: "text-green-600 font-bold",
        elementos_sustraidos: "font-bold",
    };

    const cerrarModal = useRef(null)
    const sectorGuargar = useRef(null)

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'X' || event.key === 'Escape' || event.key === 'x') {
                onClose();
            }
            if (event.key === 'G' || event.key === 'g') {
                sectorGuargar.current.click(); // Simula un clic en el botón de guardar
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown); // Limpia cuando el componente se desmonta
        };
    }, [])

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
        // setIdsDetectados([...encontrados]);

    }, [formValues]);

    useEffect(() => {
        fetch(`${HOST}/api/denuncia/${denuncia}`, {
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
            })
            .catch(err => console.log(err))
    }, [isOpen, denuncia])

    useEffect(() => {
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            idDenuncia: denunciaInfo?.idDenuncia || '',
            especializacionId: denunciaInfo?.especializacionId || '',
            submodalidadId: denunciaInfo?.submodalidadId || '',
            modalidadId: denunciaInfo?.submodalidad?.modalidad?.idModalidad || '',
            autorId: denunciaInfo?.autorId || '',
            movilidadId: denunciaInfo?.movilidad?.idMovilidad || '',
            aprehendido: denunciaInfo?.aprehendido !== undefined ? String(denunciaInfo?.aprehendido) : '',
            seguro: denunciaInfo?.seguro !== undefined ? String(denunciaInfo.seguro) : '',
            tipoArmaId: denunciaInfo?.tipoArmaId || '',
            victima: denunciaInfo?.victima !== undefined ? String(denunciaInfo?.victima) : '',
            interes: denunciaInfo?.interes || (denuncia?.charAt(0) === 'A' ? "0" : "1") || '',
            tipoDelitoId: denunciaInfo?.tipoDelito?.idTipoDelito || '',
            latitud: denunciaInfo?.Ubicacion?.latitud || '',
            longitud: denunciaInfo?.Ubicacion?.longitud || '',
            estado: denunciaInfo?.Ubicacion?.estado || '',
            lugar_del_hecho: denunciaInfo?.lugar_del_hecho || null,
            cantidad_victimario: denunciaInfo?.cantidad_victimario || null,
            elementoSustraido: denunciaInfo?.elementoSustraido || '',
            relato: denunciaInfo?.relato || "",
        }));
    }, [denunciaInfo])

    const updateDenuncia = async () => {
        let idDenunciaOk = ''
        const idDenunciaVerificar = denuncia != null ? denuncia : denunciaCookie
        if (idDenunciaVerificar.includes("%2F")) {
            idDenunciaOk = decodeURIComponent(idDenunciaVerificar);
        }

        const denunciaEnviar = {
            idDenuncia: idDenunciaOk,
            submodalidadId: parseInt(formValues.submodalidadId),
            especializacionId: parseInt(formValues.especializacionId),
            aprehendido: parseInt(formValues.aprehendido),
            movilidadId: parseInt(formValues.movilidadId),
            autorId: parseInt(formValues.autorId),
            seguro: parseInt(formValues.seguro),
            tipoArmaId: parseInt(formValues.tipoArmaId),
            victima: parseInt(formValues.victima),
            elementoSustraido: formValues.elementoSustraido,
            interes: parseInt(formValues.interes),
            cantidad_victimario: formValues.cantidad_victimario,
            lugar_del_hecho: formValues.lugar_del_hecho,
            isClassificated: 1
        }

        console.log(denunciaEnviar)

        try {
            setLoadingCarga(true)

            const denuncias = [denunciaEnviar];
            const denunciaResponse = await fetch(`${HOST}/api/denuncia/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ denuncias })
            })

            if (denunciaResponse.status === 200) {
                setLoadingCarga(false)
                Swal.fire({
                    icon: "success",
                    title: "Denuncia actualizada",
                    text: "La denuncia se actualizo",
                    confirmButtonText: 'Aceptar'
                })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            await recargarDenuncias();
                            onClose()
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
        } catch (error) {
            console.log(error)
        }
    }

    // useEffect(() => {
    //     console.log(formValues)
    // }, [formValues])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-[85%] md:max-w-[65%] max-h-[95%] w-full relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Modificar denuncia - {<><a href={`https://noteweb.mpftucuman.gob.ar/noteweb3.0/denview.php?id=${formValues?.idDenuncia ? (formValues?.idDenuncia).match(/\d+/)[0] : ''}`} target="_blank" className='pl-2 text-[#005CA2] underline'>{formValues?.idDenuncia}</a></>}</h2>
                <div className='flex flex-col md:flex-row w-full'>
                    <div className='md:px-4 px-2 grid grid-cols-2 uppercase pb-3 gap-3 text-xs w-full md:w-1/2 max-h-[430px]'>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Submodalidad:</label>
                            <div className='flex flex-row items-center md:min-w-[50%] w-4/5 rounded-xl border border-black/25 ml-[8px]'>
                                <select key={formValues.submodalidadId} name="submodalidadId" className={`h-6 border-none rounded-xl w-[90%] pl-[11px] focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("modus_operandi")) ? 'bg-blue-300' : ''} ${!formValues?.submodalidadId ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={(e) => { handleFormChange(e); handleModalidad(e.target.selectedOptions[0].getAttribute('dataModalidadId'), null); }} value={formValues.submodalidadId || ''}>
                                    <option value="">Seleccione una opción</option>
                                    {
                                        subModalidad.map(sm => (
                                            <option value={sm.idSubmodalidad} dataModalidadId={sm.modalidadId} key={sm.idSubmodalidad}>{sm.descripcion}</option>
                                        ))
                                    }
                                </select>
                                <CiCircleInfo className='text-[#005CA2] w-[10%] h-6' data-tooltip-id="tooltip1" data-tooltip-html="
                                            <div style='max-width: 170px; text-align: center; background-color: #005CA2; color: white; border-radius: 8px;'>
                                                <p>
                                                    En esta sección se cargan las definiciones de las submodalidades.
                                                </p>
                                                </div>">
                                </CiCircleInfo>
                                <Tooltip
                                    id="tooltip1"
                                    events={['click']}
                                    place='right'
                                    style={{ backgroundColor: "#005CA2" }}
                                />
                            </div>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Modalidad:</label>
                            <select name="modalidadId" className='h-6 border-[1px] rounded-xl pl-3 ml-2 border-black/25 md:min-w-[50%] w-4/5 focus:outline focus:outline-[#005CA2] focus:outline-2' onChange={handleFormChange} value={formValues.modalidadId || ''} disabled>
                                <option value="">Seleccione una opción</option>
                                {
                                    modalidad.map(mo => (
                                        <option value={mo.idModalidad} key={mo.idModalidad}>{mo.descripcion}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Aprehendido:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(!formValues?.aprehendido || formValues?.aprehendido === '') ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='aprehendido' value={formValues.aprehendido || ''}>
                                <option value="">Seleccione una opción</option>
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Movilidad:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("movilidad")) ? 'bg-green-300' : ''} ${!formValues?.movilidadId ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='movilidadId' value={formValues.movilidadId || ''}>
                                <option value="">Seleccione una opción</option>
                                {
                                    movilidad.map(mo => (
                                        <option value={mo.idMovilidad} key={mo.idMovilidad}>{mo.descripcion}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Autor:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("autor")) ? 'bg-violet-300' : ''} ${!formValues?.autorId ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='autorId' value={formValues.autorId || ''}>
                                <option value="">Seleccione una opción</option>
                                {
                                    autor.map(au => (
                                        <option value={au.idAutor} key={au.idAutor}>{au.descripcion}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Para seguro:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("para_seguro")) ? 'bg-yellow-300' : ''} ${(!formValues?.seguro || formValues?.seguro === '') ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='seguro' value={formValues.seguro || ''}>
                                <option value="">Seleccione una opción</option>
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Arma:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("arma_utilizada")) ? 'bg-red-300' : ''} ${!formValues?.tipoArmaId ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='tipoArmaId' value={formValues.tipoArmaId || ''}>
                                <option value="">Seleccione una opción</option>
                                {
                                    tipoArma.map(ta => (
                                        <option value={ta.idTipoArma} key={ta.idTipoArma}>{ta.descripcion}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Con riesgo:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(!formValues?.victima || formValues?.victima === '') ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='victima' value={formValues.victima || ''}>
                                <option value="">Seleccione una opción</option>
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right whitespace-nowrap overflow-hidden text-ellipsis'>Elementos sustraidos:</label>
                            <input name="elementoSustraido" className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(idsDetectados.includes("elementos_sustraidos")) ? 'bg-gray-300' : ''} ${!formValues?.elementoSustraido ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} value={formValues.elementoSustraido || ''} autoComplete='off'></input>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Lugar del hecho:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${(!formValues?.lugar_del_hecho || formValues?.lugar_del_hecho === '') ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='lugar_del_hecho' value={formValues?.lugar_del_hecho || ''}>
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
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right'>Interes:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${!formValues?.interes ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='interes' value={formValues.interes || ''}>
                                <option value="">Seleccione una opción</option>
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className='flex flex-row items-center col-span-3'>
                            <label htmlFor="" className='md:w-1/2 w-1/5 text-right whitespace-nowrap overflow-hidden text-ellipsis'>Cantidad victimario:</label>
                            <select className={`h-6 rounded-xl pl-3 md:min-w-[50%] w-4/5 ml-2 focus:outline focus:outline-[#005CA2] focus:outline-2 ${!formValues?.cantidad_victimario ? 'border-2 border-red-600' : 'border-[1px] border-black/25'}`} onChange={handleFormChange} name='cantidad_victimario' value={formValues.cantidad_victimario || ''}>
                                <option value="">Seleccione una opción</option>
                                <option value="solo">SOLO</option>
                                <option value="pareja">PAREJA</option>
                                <option value="grupo">GRUPO</option>
                                <option value="desconocido">DESCONOCIDO</option>
                            </select>
                        </div>
                    </div>
                    <div className='w-full md:w-1/2 max-h-[430px] overflow-scroll'>
                        <p className='w-full px-2 text-sm'>{contenidoParseado ? contenidoParseado : "NO SE ENCONTRO RELATO"}</p>
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-2 lg:gap-0 gap-4 text-sm'>
                    <button className={`text-xs py-2 bg-[#005CA2] text-white rounded-3xl w-40 focus:outline focus:outline-cyan-500 focus:outline-4 ${loadingCarga ? 'animate-pulse' : ''}`} onClick={updateDenuncia} ref={sectorGuargar}>Actualizar denuncia</button>
                    {/* <button className='py-2 bg-[#005CA2] text-white rounded-3xl w-40' onClick={obtenerData}>Obtener data</button> */}
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal