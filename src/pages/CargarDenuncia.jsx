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

    const denunciasPerPage = 9;

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
        if (excelHour === 0) {
            return "00:00:00";
        } else {
            const totalHours = excelHour * 24;
            let hours = Math.floor(totalHours);
            let minutes = Math.floor((totalHours - hours) * 60);
            let seconds = Math.round((((totalHours - hours) * 60) - minutes) * 60);

            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }

            if (minutes === 60) {
                hours++;
                minutes = 0;
            }

            const hh = hours.toString().padStart(2, '0');
            const mm = minutes.toString().padStart(2, '0');
            const ss = seconds.toString().padStart(2, '0');

            return `${hh}:${mm}:${ss}`;
        }


    }

    const handleFileUpload = (e) => {
        setIsLoading(true)
        setDenunciasFile(null)
        const file = e.target.files[0]
        const reader = new FileReader()

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const bodyData = jsonData.slice(1);

            const fixCorruptedCharacters = (text) => {
                if (typeof text !== 'string') return text;
                return text
                    .replace("ESTAFA Y DEFRAUDACI�N", "ESTAFA Y DEFRAUDACIÓN")
                    .replace("EXTRAV�OS (ARMAS, CHEQUES Y OTROS)", "EXTRAVÍOS (ARMAS, CHEQUES Y OTROS)")
                    .replace("DA�OS", "DAÑOS")
                    .replace("ABANDONO DE PERSONA / OMISI�N DE AUXILIO", "ABANDONO DE PERSONA / OMISIÓN DE AUXILIO")
                    .replace("FALSIFICACI�N O SUPRESI�N DE NUMERACI�N", "FALSIFICACIÓN O SUPRESIÓN DE NUMERACIÓN")
                    .replace("DESAPARICI�N DE PERSONA Y B�SQUEDA DE NI�O, NI�A Y ADOLESCENTE", "DESAPARICIÓN DE PERSONA Y BÚSQUEDA DE NIÑO, NIÑA Y ADOLESCENTE")
                    .replace("OTROS DELITOS CONTRA LA FE P�BLICA", "OTROS DELITOS CONTRA LA FE PÚBLICA")
                    .replace("GROOMING (ACOSO CIBERN�TICO A MENORES DE EDAD)", "GROOMING (ACOSO CIBERNÉTICO A MENORES DE EDAD)")
                    .replace("DIRECCI�N DE DISTRITOS URBANOS", "DIRECCIÓN DE DISTRITOS URBANOS")
                    .replace("RECEPCI�N DE DENUNCIAS-- MPF -- CENTRO MONTEROS", "RECEPCIÓN DE DENUNCIAS-- MPF -- CENTRO MONTEROS")
                    .replace("RECEPCI�N DE DENUNCIAS-- MPF -- CENTRO BANDA DEL RIO SALI", "RECEPCIÓN DE DENUNCIAS-- MPF -- CENTRO BANDA DEL RIO SALI")
                    .replace("RECEPCI�N DE DENUNCIAS-- MPF -- CENTRO CAPITAL", "RECEPCIÓN DE DENUNCIAS-- MPF -- CENTRO CAPITAL")
                    .replace("CHA�AR", "CHAÑAR")
                    .replace("COMISAR�A", "COMISARÍA")
                    .replace(" N� ", " N° ")
                    .replace(" N�", " N° ")
                    .replace(" B� ", " B° ")
                    .replace("B� ", " B° ")
                    .replace("BURRUYAC�", "BURRUYACÚ")
                    .replace("DECISI�N", "DECISIÓN")
                    .replace("CONCEPCI�N", "CONCEPCIÓN")
                    .replace("G�NERO", "GÉNERO")
                    .replace("MUERTE DUDOSA / SUICIDIO / FALLECIMIENTO SIN ASISTENCIA M�DICA", "MUERTE DUDOSA / SUICIDIO / FALLECIMIENTO SIN ASISTENCIA MÉDICA")
                    .replace("DELITOS CONTRA EL ORDEN P�BLICO", "DELITOS CONTRA EL ORDEN PÚBLICO")
                    .replace("OTROS DELITOS CONTRA LA ADMINISTRACI�N P�BLICA", "OTROS DELITOS CONTRA LA ADMINISTRACIÓN PÚBLICA")
                    .replace("TENENCIA Y PORTACI�N DE ARMAS", "TENENCIA Y PORTACIÓN DE ARMAS")
                    .replace("RECEPCI�N DE DENUNCIAS-- MPF -- CENTRO YERBA BUENA", "RECEPCIÓN DE DENUNCIAS-- MPF -- CENTRO YERBA BUENA")
                    .replace("RECEPCI�N DE DENUNCIAS-- MPF -- CENTRO ALDERETES", "RECEPCIÓN DE DENUNCIAS-- MPF -- CENTRO ALDERETES")
                    .replace("RECEPCI�N DE DENUNCIAS-- MPF -- CENTRO CONCEPCI�N", "RECEPCIÓN DE DENUNCIAS-- MPF -- CENTRO CONCEPCIÓN")
                    .replace("DIVISI�N TRATA DE PERSONAS", "DIVISIÓN TRATA DE PERSONAS")
                    .replace("RECEPCI�N DE DENUNCIAS-- MPF -- CENTRO TALITAS", "RECEPCIÓN DE DENUNCIAS-- MPF -- CENTRO TALITAS")
                    .replace("VIOLACI�N DE DOMICILIO", "VIOLACIÓN DE DOMICILIO")
                    .replace("PRIVACI�N ILEG�TIMA DE LA LIBERTAD", "PRIVACIÓN ILEGÍTIMA DE LA LIBERTAD")
                    .replace("COMERCIALIZACI�N DE ESTUPEFACIENTES", "COMERCIALIZACIÓN DE ESTUPEFACIENTES")
                    .replace("OFICINA DE CONCILIACI�N Y SALIDAS ALTERNATIVAS", "OFICINA DE CONCILIACIÓN Y SALIDAS ALTERNATIVAS")
                    .replace("UNIDAD FISCAL DE INVESTIGACI�N ESPECIALIZADA EN NARCOMENUDEO", "UNIDAD FISCAL DE INVESTIGACIÓN ESPECIALIZADA EN NARCOMENUDEO")
                    .replace("UNIDAD FISCAL DE INVESTIGACI�N ESPECIALIZADA EN HOMICIDIOS CONCEPCIÓN", "UNIDAD FISCAL DE INVESTIGACIÓN ESPECIALIZADA EN HOMICIDIOS CONCEPCIÓN")
                    .replace("ROBO SIMPLE / AGRAVADO", "ROBO")
                    .replace("DELITOS CONTRA LA SALUD P�BLICA", "DELITOS CONTRA LA SALUD PÚBLICA")
                    .replace("DELITOS CONTRA LA SEGURIDAD DEL TR�NSITO", "DELITOS CONTRA LA SEGURIDAD DEL TRÁNSITO")
                    .replace("DIDROP - DELEGACI�N ESTE", "DIDROP - DELEGACIÓN ESTE")
                    .replace("DIDROP - DELEGACI�N OESTE", "DIDROP - DELEGACIÓN OESTE")
                    .replace("RECEPCI�N DE DENUNCIAS-- MPF -- CENTRO LULES", "RECEPCIÓN DE DENUNCIAS-- MPF -- CENTRO LULES")
                    .replace("DIDROP - DELEGACI�N LULES", "DIDROP - DELEGACIÓN LULES")
                    .replace("DIDROP - DELEGACI�N LAS TALITAS NORTE", "DIDROP - DELEGACIÓN LAS TALITAS NORTE")
                    .replace("UNIDAD FISCAL DELITOS CONTRA LA PROPIEDAD E INTEGRIDAD F�SICA MONTEROS", "UNIDAD FISCAL DELITOS CONTRA LA PROPIEDAD E INTEGRIDAD FÍSICA MONTEROS")
                    .replace("UNIDAD FISCAL DE INVESTIGACI�N ESPECIALIZADA EN ROBOS Y HURTOS CONCEPCIÓN", "UNIDAD FISCAL DE INVESTIGACIÓN ESPECIALIZADA EN ROBOS Y HURTOS CONCEPCIÓN")
                    .replace("FISCAL�A DE INSTRUCCI�N PENAL DE ROBOS Y HURTOS", "FISCALÍA DE INSTRUCCIÓN PENAL DE ROBOS Y HURTOS")
                    .replace("FISCAL�A DE INSTRUCCI�N PENAL VD/VG e INTEGRIDAD SEXUAL", "FISCALÍA DE INSTRUCCIÓN PENAL VD/VG e INTEGRIDAD SEXUAL")
                    .replace("FISCAL�A DE INSTRUCCI�N PENAL CRIMINAL", "FISCALÍA DE INSTRUCCIÓN PENAL CRIMINAL")
                    .replace("DIRECCI�N DE ANIMALES DE APOYO PROFESIONAL", "DIRECCIÓN DE ANIMALES DE APOYO PROFESIONAL")
                    .replace("SUSTRACCI�N DE MENORES", "SUSTRACCIÓN DE MENORES")
                    .replace("DIV. BUSQUEDA Y CAPTURA DE PR�FUGOS - D.I.C.D.C", "DIV. BUSQUEDA Y CAPTURA DE PRÓFUGOS - D.I.C.D.C")
                    .replace("DIDROP - DELEGACI�N SUR", "DIDROP - DELEGACIÓN SUR")
                    .replace("FALSIFICACI�N DE DOCUMENTOS EN GENERAL", "FALSIFICACIÓN DE DOCUMENTOS EN GENERAL")
                    ;
            };

            const formattedData = bodyData.map((denuncia) => {
                return {
                    'NRO DENUNCIA': fixCorruptedCharacters(denuncia[0] || ''),
                    'FECHA': denuncia[1] ? excelDateToJSDate(denuncia[1]) : null,
                    'DELITO': fixCorruptedCharacters(denuncia[2] || ''),
                    'LOCALIDAD': fixCorruptedCharacters(denuncia[3] || ''),
                    'COMISARIA': fixCorruptedCharacters(denuncia[4] || ''),
                    'FISCALIA': fixCorruptedCharacters(denuncia[5] || ''),
                    'FECHA HECHO': denuncia[8] ? excelDateToJSDate(denuncia[8]) : null,
                    'HORA HECHO': denuncia[9] ? excelHourToJSDate(denuncia[9]) : '00:00:00',
                    'LUGAR DEL HECHO': fixCorruptedCharacters(denuncia[10] || ''),
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

    const comprobarEspecializacion = (denuncia) => {
        if (denuncia === "HURTOS" || denuncia === "ROBO" || denuncia === "ROBO CON ARMA DE FUEGO" || denuncia === "TENTATIVA DE ROBOS" || denuncia === "TENTATIVA DE HURTOS") {
            return 1;
        } else {
            return null;
        }
    }

    const comprobarInteres = (delito, denuncia) => {
        if ((delito === "HURTOS" || delito === "ROBO" || delito === "ROBO CON ARMA DE FUEGO" || delito === "TENTATIVA DE ROBOS" || delito === "TENTATIVA DE HURTOS") && (denuncia?.charAt(0) === 'D')) {
            return 1;
        } else {
            return 0;
        }
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
                //console.log("Tipo de delito encontrado: ", data)
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

    const handleCarga = async () => {
        let lote = []
        const maxLote = 50;
        setCargaTerminada(false)
        setIsUploading(true)
        setProgreso(0)

        let totalLotes = Math.ceil((denunciasFile.length - cantDuplicadas) / maxLote)
        let totalCargadas = 0

        for (const denuncia of denunciasFile) {
            let esDuplicada = duplicadas.some(duplicada => {
                if (duplicada.idDenuncia.includes(denuncia['NRO DENUNCIA'])) {
                    return true;
                } else {
                    return false
                }
            })

            if (!esDuplicada) {

                const comisariaId = await buscarComisaria(denuncia['COMISARIA']);
                const localidadId = await buscarLocalidad(denuncia['LOCALIDAD']);
                const tipoDelitoId = await buscarTipoDelito(denuncia['DELITO'])

                const denunciaACargar = {
                    latitud: null,
                    longitud: null,
                    domicilio: denuncia['LUGAR DEL HECHO'],
                    poligono: null,
                    localidadId: localidadId,
                    estado: null,
                    idDenuncia: denuncia['NRO DENUNCIA'],
                    fechaDenuncia: cambiarFormatoFecha(denuncia['FECHA']),
                    dniDenunciante: null,
                    interes: comprobarInteres(denuncia['DELITO'],denuncia['NRO DENUNCIA']),
                    aprehendido: null,
                    medida: null,
                    seguro: null,
                    elementoSustraido: null,
                    fechaDelito: cambiarFormatoFecha(denuncia['FECHA HECHO']),
                    horaDelito: denuncia['HORA HECHO'],
                    fiscalia: denuncia['FISCALIA'],
                    tipoArmaId: null,
                    movilidadId: null,
                    autorId: null,
                    victima: null,
                    especializacionId: comprobarEspecializacion(denuncia['DELITO']),
                    comisariaId: comisariaId,
                    submodalidadId: null,
                    tipoDelitoId: tipoDelitoId ? tipoDelitoId : null,
                    isClassificated: 0,
                    relato: denuncia['RELATO']
                };

                lote.push(denunciaACargar)

                if (lote.length === maxLote) {
                    await cargarLote(lote)
                    lote.length = 0
                    totalCargadas += 1
                }
            }
        }

        if (lote.length > 0) {
            await cargarLote(lote);
            totalCargadas += 1
        }

        if (totalCargadas === totalLotes) {
            cantDuplicados()
            setIsUploading(false);
            setCargaTerminada(true)
        }
    }

    const cargarLote = async (denuncias) => {
        let cantidadDeDenuncias = denunciasFile.length - cantDuplicadas
        //console.log("Cantidad de denuncias: ", cantidadDeDenuncias)
        try {
            const res = await fetch(`${HOST}/api/denuncia/denuncia`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ denuncias })
            })

            if (res.ok) {
                const data = await res.json()
                setTotalCargadas(prev => prev + data.denunciasCargadas);
                setTotalNoCargadas(prev => prev + data.denunciasNoCargadas);

                let progresoActual = Math.floor((((denuncias.length) * 100) / cantidadDeDenuncias) * 100) / 100;
                //console.log("Progreso ok actual: ", progresoActual)
                setProgreso(prev => prev + progresoActual)
                //console.log("Lote cargado exitosamente")
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
            } else if (res.status === 500) {
                const data = await res.json()
                let progresoActual = Math.floor((((denuncias.length) * 100) / cantidadDeDenuncias) * 100) / 100;
                //console.log("Progreso not ok actual: ", progresoActual)
                setProgreso(prev => prev + progresoActual)
                //console.log("El lote no fue cargado: ", data.errores)
                setDataCarga(data.errores)
            } else if (res.status === 400) {
                const data = await res.json()
                let progresoActual = Math.floor((((denuncias.length) * 100) / cantidadDeDenuncias) * 100) / 100;
                //console.log("Progreso not ok actual: ", progresoActual)
                setProgreso(prev => prev + progresoActual)
                //console.log("El lote no fue cargado: ", data.errores)
                setDataCarga(data.errores)
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }


    useEffect(() => {
        cantDuplicados()
    }, [denunciasFile])

    useEffect(() => {
        //console.log("Cantidad cargada: ", totalCargadas)
        //console.log("Cantidad no cargada: ", totalNoCargadas)
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

    return (
        <div className='px-6 pt-8 md:h-heightfull flex flex-col w-full text-sm overflow-scroll'>
            <div className='flex flex-row lg:gap-12 justify-between lg:justify-normal items-center'>
                <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Cargar denuncias</h2>
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
                                        <tr className='w-full'>
                                            <th className='text-center'>NRO DENUNCIA</th>
                                            <th className='text-center'>FECHA</th>
                                            <th className='text-center'>DELITO</th>
                                            <th className='text-center'>LOCALIDAD</th>
                                            <th className='text-center'>COMISARIA</th>
                                            <th className='text-center'>FISCALIA</th>
                                            <th className='text-center'>FECHA HECHO</th>
                                            <th className='text-center'>HORA HECHO</th>
                                            <th className='text-center'>LUGAR DEL HECHO</th>
                                        </tr>
                                    </thead>
                                    <tbody className='w-full'>
                                        {
                                            currentDenuncias.map((denuncia, index) => {
                                                const isDuplicada = duplicadas.some(dup => dup.idDenuncia === denuncia['NRO DENUNCIA']);

                                                return (
                                                    <tr key={index} className={`w-full border-b-2 ${isDuplicada ? 'bg-yellow-100' : ''}`}>
                                                        <td className='text-center px-2'>{denuncia["NRO DENUNCIA"]}</td>
                                                        <td className='text-center px-2'>{denuncia["FECHA"]}</td>
                                                        <td className='text-center px-2'>{denuncia["DELITO"]}</td>
                                                        <td className='text-center px-2'>{denuncia["LOCALIDAD"]}</td>
                                                        <td className='text-center px-2'>{denuncia["COMISARIA"]}</td>
                                                        <td className='text-center px-2'>{denuncia["FISCALIA"]}</td>
                                                        <td className='text-center px-2'>{denuncia["FECHA HECHO"]}</td>
                                                        <td className='text-center px-2'>{denuncia["HORA HECHO"]}</td>
                                                        <td className='text-center px-2'>{denuncia["LUGAR DEL HECHO"]}</td>
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
            <div className='flex flex-col justify-between lg:items-start items-center min-h-24 my-2 p-4'>
                <button className={`font-semibold text-center px-4 py-1  rounded-2xl  w-48 text-white disabled:bg-opacity-55 transition-colors ${isUploading ? 'bg-[#005CA2] ' : 'bg-black '}`} disabled={denunciasFile === null} onClick={handleCarga}>Cargar denuncias</button>
                {
                    progreso != null ?

                    (<div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 ml-4 ">
                        <div className="bg-[#005CA2] text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full animate-pulse" style={{ width: `${progreso}%` }}>{Math.floor(progreso*100) / 100}%</div>
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