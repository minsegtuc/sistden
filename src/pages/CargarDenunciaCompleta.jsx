import { useEffect, useState, useContext } from 'react'
import * as XLSX from 'xlsx';
import { BsCaretLeft, BsCaretRight, BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { ContextConfig } from '../context/ContextConfig';
import Swal from 'sweetalert2';

const CargarDenuncia = () => {

    const [denunciasFile, setDenunciasFile] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [duplicadas, setDuplicadas] = useState(null)
    const [cantDuplicadas, setCantDuplicadas] = useState(null)
    const [progreso, setProgreso] = useState(null)

    const [dataCarga, setDataCarga] = useState([])
    const [totalCargadas, setTotalCargadas] = useState(0)
    const [totalNoCargadas, setTotalNoCargadas] = useState(0)
    const [cargaTerminada, setCargaTerminada] = useState(false)


    const denunciasPerPage = 20;

    const { HOST, handleSession } = useContext(ContextConfig)

    const excelDateToJSDate = (excelDate) => {
        const millisecondsInDay = 86400 * 1000;
        const excelEpochDays = 25567 + 2 - 1;

        const days = Math.floor(excelDate);
        const jsTimestamp = (days - excelEpochDays) * millisecondsInDay;

        const date = new Date(jsTimestamp - (4 * 3600 * 1000));

        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    };

    const excelHourToJSDate = (excelHour) => {
        const hh = excelHour.toString().padStart(2, '0');
        const mm = '00';
        const ss = '00';

        return `${hh}:${mm}:${ss}`;
    }

    const handleFileUpload = (e) => {
        setIsLoading(true)
        setDenunciasFile(null)
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onload = (e) => {
            setProgreso(null)
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const bodyData = jsonData.slice(1);

            const formattedData = bodyData.map((denuncia) => {
                return {
                    'NRO DENUNCIA': (denuncia[0] || ''),
                    'FECHA': denuncia[1] ? excelDateToJSDate(denuncia[1]) : null,
                    'DELITO': (denuncia[2] || ''),
                    'LOCALIDAD': (denuncia[3] || ''),
                    'COMISARIA': (denuncia[4] || ''),
                    'FISCALIA': (denuncia[5] || ''),
                    'ESPECIALIZACION': (denuncia[6] || ''),
                    'INTERES': (denuncia[7] || ''),
                    'FECHA HECHO': denuncia[8] ? excelDateToJSDate(denuncia[8]) : null,
                    'CALLE': (denuncia[9] || ''),
                    'HORA HECHO': denuncia[10] ? excelHourToJSDate(denuncia[10]) : '00:00:00',
                    'MODALIDAD': (denuncia[11] || ''),
                    'SUBMODALIDAD': (denuncia[12] || ''),
                    'APREHENDIDO': (denuncia[13] || ''),
                    'MEDIDA': (denuncia[14] || ''),
                    'MOVILIDAD': (denuncia[15] || ''),
                    'AUTOR': (denuncia[16] || ''),
                    'ARMA UTILIZADA': (denuncia[17] || ''),
                    'PARA SEGURO': (denuncia[18] || ''),
                    'VICTIMA': (denuncia[19] || ''),
                    'ELEMENTOS SUSTRAIDOS': (denuncia[20] || ''),
                    'LATITUD': (denuncia[24]) ? (denuncia[24]).split(/, ?/)[0] : '',
                    'LONGITUD': (denuncia[24]) ? (denuncia[24]).split(/, ?/)[1] : '',
                    'Estado_GEO': (denuncia[25] || ''),
                    'RELATO': (denuncia[31] || ''),
                };
            });

            setDenunciasFile(formattedData);
            setIsLoading(false)
        };

        reader.readAsArrayBuffer(file);
    }

    const cantDuplicados = () => {
        setCantDuplicadas(null)
        const denunciasVerificar = denunciasFile != null ? (
            denunciasFile.map(denuncia => {
                return denuncia['NRO DENUNCIA']
            })
        ) : []

        fetch(`${HOST}/api/denuncia/duplicadas`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ denunciasVerificar })
        }).then(res => {
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
        }).then(data => {
            setDuplicadas(data.duplicadas)
            setCantDuplicadas(data.duplicadas.length)
        }).catch(err => console.log(err))
    }

    const startIndex = currentPage * denunciasPerPage;
    const endIndex = startIndex + denunciasPerPage;

    const currentDenuncias = denunciasFile ? denunciasFile.slice(startIndex, endIndex) : []

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (endIndex < denunciasFile.length) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handleFirstPage = () => {
        setCurrentPage(0)
    }

    const handleLastPage = () => {
        const totalPages = denunciasFile ? Math.ceil(denunciasFile.length / denunciasPerPage) : 0;
        setCurrentPage(totalPages - 1)
    }

    const cambiarFormatoFecha = (fecha) => {
        const [dia, mes, año] = fecha.split('/');
        return `${año}-${mes}-${dia}`;
    }

    const buscarLocalidad = async (localidad) => {
        const localidadBuscar = encodeURIComponent(localidad)
        try {
            const res = await fetch(`${HOST}/api/localidad/nombre/${localidadBuscar}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
            })

            if (res.ok) {
                const data = await res.json()
                if (data.length === 0) {
                    return null
                }
                return data[0].idLocalidad
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
        } catch (error) {
            console.log("Error al buscar la localidad: ", error)
        }
    }

    const buscarComisaria = async (comisaria) => {
        const comisariaBuscar = encodeURIComponent(comisaria)
        try {
            const res = await fetch(`${HOST}/api/comisaria/nombre/${comisariaBuscar}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            })

            if (res.ok) {
                const data = await res.json()
                if (data.length === 0) {
                    return null
                }
                return data[0].idComisaria
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
        } catch (error) {
            console.log("Error al cargar Comisaria: ", error)
        }
    }

    const buscarTipoDelito = async (delito) => {
        const delitoBuscar = encodeURIComponent(delito)
        try {
            const res = await fetch(`${HOST}/api/tipoDelito/nombre/${delitoBuscar}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            })

            if (res.ok) {
                const data = await res.json()
                if (data === null) {
                    return null
                }
                return data.idTipoDelito
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
        } catch (error) {
            console.log("Error al cargar Tipo Delito: ", error)
        }
    }

    const comprobarArma = (arma) => {
        switch (arma) {
            case 'Blanca':
                return 2;
            case 'De fuego':
                return 1;
            case 'Objeto Contundente':
                return 3;
            case 'Sin armas':
                return 4;
            default:
                return null;
        }
    }

    const comprobarMovilidad = (movilidad) => {
        switch (movilidad) {
            case 'a Pie':
                return 1;
            case 'Auto/Camioneta':
                return 2;
            case 'Bici':
                return 3;
            case 'Moto':
                return 4;
            case 'SD':
                return 5;
            case 'Traccion a sangre':
                return 6;
            default:
                return null;
        }
    }

    const comprobarAutor = (autor) => {
        switch (autor) {
            case 'CONOCIDO':
                return 1;
            case 'DESCONOCIDO':
                return 2;
            case 'SD':
                return 3;
            default:
                return null;
        }
    }

    const comprobarEstado = (estado) => {
        switch (estado) {
            case 'EXACTA':
                return 1;
            case 'DESCARTADA':
                return 5;
            case 'APROXIMADA':
                return 3;
            case 'SD':
                return 2;
            default:
                return null;
        }
    }

    const buscarSubmodalidad = async (submodalidad) => {
        const submodalidadBuscar = encodeURIComponent(submodalidad);
        try {
            const res = await fetch(`${HOST}/api/submodalidad/nombre/${submodalidadBuscar}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                if (data === null) {
                    return null;
                }
                return data.idSubmodalidad;
            } else if (res.status === 403) {
                Swal.fire({
                    title: 'Credenciales caducadas',
                    icon: 'info',
                    text: 'Credenciales de seguridad caducadas. Vuelva a iniciar sesión',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleSession();
                    }
                });
            } else if (res.status === 404) {
                return null;
            } else {
                console.log(`Error ${res.status}: ${res.statusText}`);
            }
        } catch (error) {
            if (error.status !== 404) {
                console.log("Error al cargar submodalidad: ", error);
            }
        }
    };

    const handleCarga = async () => {
        const lote = []
        const loteUpdate = []
        const maxLote = 150;

        setCargaTerminada(false)
        setIsUploading(true)
        setProgreso(0)

        let lotesCargados = 0
        let lotesActualizados = 0;

        for (const denuncia of denunciasFile) {
            let esDuplicada = duplicadas.some(duplicada => duplicada.idDenuncia.includes(denuncia['NRO DENUNCIA']));

            const tipoArmaId = comprobarArma(denuncia['ARMA UTILIZADA']);
            const movilidadId = comprobarMovilidad(denuncia['MOVILIDAD']);
            const autorId = comprobarAutor(denuncia['AUTOR']);
            const comisariaId = await buscarComisaria(denuncia['COMISARIA']);
            const localidadId = await buscarLocalidad(denuncia['LOCALIDAD']);
            const submodalidadId = await buscarSubmodalidad(denuncia['SUBMODALIDAD']);
            const tipoDelitoId = await buscarTipoDelito(denuncia['DELITO']);
            const estado = comprobarEstado(denuncia['Estado_GEO'])

            const denunciaProcesada = {
                latitud: typeof denuncia['LATITUD'] === "number" ? denuncia['LATITUD'] : null,
                longitud: typeof denuncia['LONGITUD'] === "number" ? denuncia['LONGITUD'] : null,
                domicilio: denuncia['CALLE'],
                poligono: null,
                estado: estado || null,
                localidadId,
                idDenuncia: denuncia['NRO DENUNCIA'],
                fechaDenuncia: cambiarFormatoFecha(denuncia['FECHA']),
                dniDenunciante: null,
                interes: denuncia['INTERES'] === 'SI' ? 1 : denuncia['INTERES'] === 'NO' ? 0 : null,
                aprehendido: denuncia['APREHENDIDO'] === 'SI' ? 1 : denuncia['APREHENDIDO'] === 'NO' ? 0 : null,
                medida: denuncia['MEDIDA'] === 'SI' ? 1 : denuncia['MEDIDA'] === 'NO' ? 0 : null,
                seguro: denuncia['PARA SEGURO'] === 'SI' ? 1 : denuncia['PARA SEGURO'] === 'NO' ? 0 : null,
                elementoSustraido: typeof denuncia['ELEMENTOS SUSTRAIDOS'] === 'string'
                    ? denuncia['ELEMENTOS SUSTRAIDOS'].slice(0, 1022)
                    : null,
                fechaDelito: denuncia['FECHA HECHO'] ? cambiarFormatoFecha(denuncia['FECHA HECHO']) : cambiarFormatoFecha(denuncia['FECHA']),
                horaDelito: denuncia['HORA HECHO'] || '00:00:00',
                fiscalia: denuncia['FISCALIA'],
                tipoArmaId,
                movilidadId,
                autorId,
                victima: denuncia['VICTIMA'] === 'CON RIESGO' ? 1 : denuncia['VICTIMA'] === 'SIN RIESGO' ? 0 : null,
                especializacionId: denuncia['ESPECIALIZACION'] === 'PROPIEDAD' ? 1 : null,
                comisariaId,
                submodalidadId,
                tipoDelitoId: tipoDelitoId || null,
                isClassificated: 1,
                relato: denuncia['RELATO'] || null
            };

            if (esDuplicada) {
                loteUpdate.push(denunciaProcesada);
            } else {
                lote.push(denunciaProcesada);
            }

            if (lote.length === maxLote) {
                await cargarLote(lote);
                lote.length = 0;
                lotesCargados++;
            }

            if (loteUpdate.length === maxLote) {
                await updateDenuncia(loteUpdate);
                loteUpdate.length = 0;
                lotesActualizados++;
            }
        }

        if (lote.length > 0) {
            await cargarLote(lote);
            lotesCargados += 1
        }

        if (loteUpdate.length > 0) {
            await updateDenuncia(loteUpdate);
            lotesActualizados += 1;
        }

        cantDuplicados();
        setIsUploading(false);
        setCargaTerminada(true);
    }

    const cargarLote = async (denuncias) => {
        try {
            const res = await fetch(`${HOST}/api/denuncia/denuncia`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ denuncias })
            });
    
            await manejarRespuesta(res, denuncias.length);
        } catch (error) {
            console.log("Error en carga de lote: ", error);
        }
    };

    const updateDenuncia = async (denuncias) => {
        try {
            const res = await fetch(`${HOST}/api/denuncia/update`, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ denuncias })
            });
    
            await manejarRespuesta(res, denuncias.length);
        } catch (error) {
            console.log("Error en actualización de lote: ", error);
        }
    };

    const manejarRespuesta = async (res, cantidad) => {
        let cantidadDeDenuncias = denunciasFile.length;
        let progresoActual = Math.floor((cantidad * 100) / cantidadDeDenuncias * 100) / 100;
    
        if (res.ok) {
            const data = await res.json();
            setTotalCargadas(prev => prev + (data.denunciasCargadas || 0));
            setTotalNoCargadas(prev => prev + (data.denunciasNoCargadas || 0));
        } else {
            if (res.status === 403) {
                Swal.fire({
                    title: 'Credenciales caducadas',
                    icon: 'info',
                    text: 'Credenciales de seguridad caducadas. Vuelva a iniciar sesión',
                    confirmButtonText: 'Aceptar'
                }).then(result => { if (result.isConfirmed) handleSession(); });
            } else {
                const data = await res.json();
                setDataCarga(data.errores || []);
            }
        }
        setProgreso(prev => prev + progresoActual);
    };

    useEffect(() => {
        cantDuplicados()
    }, [denunciasFile])

    useEffect(() => {
        if (cargaTerminada) {
            Swal.fire({
                title: 'Carga finalizada',
                icon: 'success',
                text: `Denuncias cargadas ${totalCargadas}. ${totalNoCargadas > 0 ? `Denuncias no cargadas ${totalNoCargadas}` : ''}`,
                confirmButtonText: 'Aceptar'
            }).then((result) => {
                if (result.isConfirmed) {
                    setCargaTerminada(false)
                    cantDuplicados()
                    setProgreso(null)
                }
            })
        }

    }, [cargaTerminada])

    // useEffect(() => {
    //     console.log(progreso)
    // }, [progreso])

    return (
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full text-sm overflow-scroll'>
            <div className='flex flex-row lg:gap-12 justify-between lg:justify-normal items-center'>
                <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Cargar denuncias completas</h2>
            </div>
            <div className='flex flex-row items-center pt-4'>
                {
                    isLoading ? <svg className="animate-spin h-6 w-6 mr-4 text-[#005CA2]" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg> : ''
                }
                <input type="file" name="" id="" accept='.xlsx' className='' onChange={handleFileUpload} />
            </div>

            {
                denunciasFile != null ?
                    <div className='pt-4 min-h-3/4'>
                        {
                            currentDenuncias != null && cantDuplicadas != null ?
                                <table className='w-full'>
                                    <thead className='border-b-2 border-black w-full'>
                                        <tr className='w-full flex items-center'>
                                            <th className='w-32 text-center'>NRO DENUNCIA</th>
                                            <th className='w-32 text-center'>FECHA</th>
                                            <th className='w-32 text-center'>DELITO</th>
                                            <th className='w-32 text-center'>LOCALIDAD</th>
                                            <th className='w-32 text-center'>COMISARIA</th>
                                            <th className='w-32 text-center'>FISCALIA</th>
                                            <th className='w-32 text-center'>ESPECIALIZACION</th>
                                            <th className='w-32 text-center'>INTERES</th>
                                            <th className='w-32 text-center'>FECHA HECHO</th>
                                            <th className='w-32 text-center'>CALLE</th>
                                            <th className='w-32 text-center'>HORA HECHO</th>
                                            <th className='w-32 text-center'>MODALIDAD</th>
                                            <th className='w-32 text-center'>SUBMODALIDAD</th>
                                            <th className='w-32 text-center'>APREHENDIDO</th>
                                            <th className='w-32 text-center'>MEDIDA</th>
                                            <th className='w-32 text-center'>MOVILIDAD</th>
                                            <th className='w-32 text-center'>AUTOR</th>
                                            <th className='w-32 text-center'>ARMA UTILIZADA</th>
                                            <th className='w-32 text-center'>PARA SEGURO</th>
                                            <th className='w-32 text-center'>VICTIMA</th>
                                            <th className='w-32 text-center'>ELEMENTOS SUSTRAIDOS</th>
                                            <th className='w-32 text-center'>LATITUD</th>
                                            <th className='w-32 text-center'>LONGITUD</th>
                                            <th className='w-32 text-center'>ESTADO GEO</th>
                                            <th className='w-32 text-center'>RELATO</th>
                                        </tr>
                                    </thead>
                                    <tbody className='border-b-2 border-black w-full'>
                                        {
                                            currentDenuncias.map((denuncia, index) => {
                                                const isDuplicada = duplicadas.some(dup => dup.idDenuncia === denuncia['NRO DENUNCIA']);

                                                return (
                                                    <tr key={index} className={`w-full flex items-center border-b-2 ${isDuplicada ? 'bg-yellow-100' : ''}`}>
                                                        <td className='w-32 text-center'>{denuncia['NRO DENUNCIA']}</td>
                                                        <td className='w-32 text-center'>{denuncia['FECHA']}</td>
                                                        <td className='w-32 text-center'>{denuncia['DELITO']}</td>
                                                        <td className='w-32 text-center'>{denuncia['LOCALIDAD']}</td>
                                                        <td className='w-32 text-center'>{denuncia['COMISARIA']}</td>
                                                        <td className='w-32 text-center'>{denuncia['FISCALIA']}</td>
                                                        <td className='w-32 text-center'>{denuncia['ESPECIALIZACION']}</td>
                                                        <td className='w-32 text-center'>{denuncia['INTERES']}</td>
                                                        <td className='w-32 text-center'>{denuncia['FECHA HECHO']}</td>
                                                        <td className='w-32 text-center'>{denuncia['CALLE']}</td>
                                                        <td className='w-32 text-center'>{denuncia['HORA HECHO']}</td>
                                                        <td className='w-32 text-center'>{denuncia['MODALIDAD']}</td>
                                                        <td className='w-32 text-center'>{denuncia['SUBMODALIDAD']}</td>
                                                        <td className='w-32 text-center'>{denuncia['APREHENDIDO']}</td>
                                                        <td className='w-32 text-center'>{denuncia['MEDIDA']}</td>
                                                        <td className='w-32 text-center'>{denuncia['MOVILIDAD']}</td>
                                                        <td className='w-32 text-center'>{denuncia['AUTOR']}</td>
                                                        <td className='w-32 text-center'>{denuncia['ARMA UTILIZADA']}</td>
                                                        <td className='w-32 text-center'>{denuncia['PARA SEGURO']}</td>
                                                        <td className='w-32 text-center'>{denuncia['VICTIMA']}</td>
                                                        <td className='w-32 text-center'>{denuncia['ELEMENTOS SUSTRAIDOS']}</td>
                                                        <td className='w-32 text-center'>{denuncia['LATITUD']}</td>
                                                        <td className='w-32 text-center'>{denuncia['LONGITUD']}</td>
                                                        <td className='w-32 text-center'>{denuncia['Estado_GEO']}</td>
                                                        <td className='w-32 text-center'>{denuncia['RELATO']}</td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                                :
                                <div className='min-h-3/4'>
                                    <span className="relative flex h-32 w-32 mx-auto">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005CA2] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-32 w-32 bg-[#005CA2]"></span>
                                    </span>
                                </div>

                        }
                        {
                            currentDenuncias != null && cantDuplicadas != null ? (
                                <div>
                                    <p className='font-bold text-xs pt-2'>Cantidad de denuncias: {denunciasFile != null ? denunciasFile.length : ''}</p>
                                    <p className='font-bold text-xs pt-2'>Cantidad de denuncias duplicadas: {cantDuplicadas != null ? cantDuplicadas : ''}</p>
                                </div>
                            ) : ''
                        }

                    </div>
                    :
                    <div className='bg-[#005CA2] text-white rounded-md w-auto text-center lg:py-16 py-8 px-4 mx-auto font-semibold shadow-md shadow-[#4274e2]/50 lg:my-16 my-4'>La base de datos se encuentra sin denuncias para clasificar</div>
            }
            <div className='flex flex-row justify-between items-center min-h-24 my-2 p-4'>
                <button className={`font-semibold text-center px-4 py-1  rounded-2xl  w-48 text-white disabled:bg-opacity-55 transition-colors ${isUploading ? 'bg-[#005CA2] ' : 'bg-black '}`} disabled={denunciasFile === null} onClick={handleCarga}>Cargar denuncias</button>
                {
                    progreso != null ?

                        (<div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 ml-4 ">
                            <div className="bg-[#005CA2] text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full animate-pulse" style={{ width: `${progreso}%` }}>{Math.floor(progreso * 100) / 100}%</div>
                        </div>) : ''
                }
            </div>
            <div className='flex justify-center items-center pt-2 pb-4'>
                <BsCaretLeftFill className='text-2xl cursor-pointer' onClick={handleFirstPage} />
                <BsCaretLeft className='text-2xl cursor-pointer' onClick={handlePrevPage} />
                <p className='font-semibold'>Página {currentPage + 1}</p>
                <BsCaretRight className='text-2xl cursor-pointer' onClick={handleNextPage} />
                <BsCaretRightFill className='text-2xl cursor-pointer' onClick={handleLastPage} />
            </div>
        </div>
    )
}

export default CargarDenuncia