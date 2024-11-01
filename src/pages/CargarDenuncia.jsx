import { useEffect, useState, useContext } from 'react'
import * as XLSX from 'xlsx';
import { BsCaretLeft, BsCaretRight, BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { ContextConfig } from '../context/ContextConfig';

const CargarDenuncia = () => {

    const [denunciasFile, setDenunciasFile] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
    const [duplicadas, setDuplicadas] = useState(null)
    const [cantDuplicadas, setCantDuplicadas] = useState(null)

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
        const file = e.target.files[0]
        const reader = new FileReader()
        setDenunciasFile(null)

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

    const cambiarFormatoFecha = (fecha) => {
        const [dia, mes, año] = fecha.split('/');
        return `${año}-${mes}-${dia}`;
    }

    const buscarLocalidad = async (localidad) => {
        try {
            const res = await fetch(`${HOST}/api/localidad/nombre/${localidad}`, {
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

    const registrarUbicacion = async (domicilio, localidad) => {
        const idLocalidad = await buscarLocalidad(localidad)

        const ubicacion = {
            latitud: null,
            longitud: null,
            domicilio: domicilio,
            poligono: null,
            localidadId: idLocalidad
        }

        console.log("Ubicacion a registrar: ", ubicacion)

        try {
            const res = await fetch(`${HOST}/api/ubicacion/ubicacion`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(ubicacion)
            })

            if (res.ok) {
                const data = await res.json()
                return data.idUbicacion
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
            console.log("Error al cargar ubicacion: ", error)
        }
    }

    const buscarComisaria = async (comisaria) => {
        try {
            const res = await fetch(`${HOST}/api/comisaria/nombre/${comisaria}`, {
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
                console.log("Tipo de delito encontrado: " , data)
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
        for (const denuncia of denunciasFile) {
            console.log(denuncia)
            let esDuplicada = duplicadas.some(duplicada => {
                if (duplicada.idDenuncia.includes(denuncia['NRO DENUNCIA'])) {
                    console.log("Es duplicada")
                    return true;
                } else {
                    return false
                }
            })

            if (!esDuplicada) {

                const comisariaId = await buscarComisaria(denuncia['COMISARIA']);
                const ubicacionId = await registrarUbicacion(denuncia['LUGAR DEL HECHO'], denuncia['LOCALIDAD']);
                const tipoDelitoId = await buscarTipoDelito(denuncia['DELITO'])

                const denunciaACargar = {
                    idDenuncia: denuncia['NRO DENUNCIA'],
                    fechaDenuncia: cambiarFormatoFecha(denuncia['FECHA']),
                    dniDenunciante: null,
                    interes: null,
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
                    ubicacionId: ubicacionId,
                    submodalidadId: null,
                    tipoDelitoId: tipoDelitoId ? tipoDelitoId : null,
                    isClassificated: 0
                };

                console.log("La denuncia a cargar es: ", denunciaACargar)

                try {
                    const res = await fetch(`${HOST}/api/denuncia/denuncia`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(denunciaACargar)
                    })

                    if (res.ok) {
                        const data = await res.json()
                        /* return data */
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
                    } else {
                        console.log("La denuncia no fue cargada")

                        try {
                            const deleteRes = await fetch(`${HOST}/api/ubicacion/ubicacion/${ubicacionId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-type': 'application/json'
                                },
                                credentials: 'include'
                            })

                            if (deleteRes.ok) {
                                console.log("Ubicacion revertida correctamente")
                            } else if (deleteRes.status === 403) {
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
                        } catch (deleteError) {
                            console.log("Error al revertir la ubicación: ", deleteError);
                        }
                    }
                } catch (error) {
                    console.log("Error: " , error)
                }
            }
        }
    }

    useEffect(() => {
        cantDuplicados()
    }, [denunciasFile])

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
                                        <tr className='w-full flex justify-center items-center'>
                                            <th className='w-1/12 text-center'>NRO DENUNCIA</th>
                                            <th className='w-1/12 text-center'>FECHA</th>
                                            <th className='w-2/12 text-center'>DELITO</th>
                                            <th className='w-2/12 text-center'>LOCALIDAD</th>
                                            <th className='w-1/12 text-center'>COMISARIA</th>
                                            <th className='w-1/12 text-center'>FISCALIA</th>
                                            <th className='w-1/12 text-center'>FECHA HECHO</th>
                                            <th className='w-1/12 text-center'>HORA HECHO</th>
                                            <th className='w-2/12 text-center'>LUGAR DEL HECHO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentDenuncias.map((denuncia, index) => {
                                                const isDuplicada = duplicadas.some(dup => dup.idDenuncia === denuncia['NRO DENUNCIA']);

                                                return (
                                                    <tr key={index} className={`w-full flex items-center border-b-2 ${isDuplicada ? 'bg-yellow-100' : ''}`}>
                                                        <td className='w-1/12 text-center'>{denuncia["NRO DENUNCIA"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["FECHA"]}</td>
                                                        <td className='w-2/12 text-center'>{denuncia["DELITO"]}</td>
                                                        <td className='w-2/12 text-center'>{denuncia["LOCALIDAD"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["COMISARIA"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["FISCALIA"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["FECHA HECHO"]}</td>
                                                        <td className='w-1/12 text-center'>{denuncia["HORA HECHO"]}</td>
                                                        <td className='w-2/12 text-center'>{denuncia["LUGAR DEL HECHO"]}</td>
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
                <button className='font-semibold text-center px-4 py-1 bg-black rounded-2xl text-white w-48 disabled:bg-opacity-55' disabled={denunciasFile === null} onClick={handleCarga}>Cargar denuncias</button>
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