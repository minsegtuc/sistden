import React, { useEffect, useState, useContext } from 'react';
import { Line, Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ContextConfig } from '../context/ContextConfig';
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js/auto";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
);

// VERDE #5BBAB3 rgb(91, 186, 179)
// NARANJA #ECAE5C rgb(236, 174, 92)
// ROJO #FC645E rgb(252, 100, 94)
// NEGRO #595858 rgba(88, 88, 88)
// GRIS FONDO #F0F0F0 rgb(240, 240, 240)

const Estadisticas = () => {

    const { HOST } = useContext(ContextConfig)

    const [ultimaActualizacion, setUltimaActualizacion] = useState(null)
    const [totalDenuncias, setTotalDenuncias] = useState(null)
    const [denunciasInteres, setDenunciasInteres] = useState(null)
    const [habitantes, setHabitantes] = useState(null)

    const [graficaIzqInteres, setGraficaIzqInteres] = useState([])
    const [graficaIzqTotal, setGraficaIzqTotal] = useState([])
    const [mesesIzq, setMesesIzq] = useState([])
    const [mesesDer, setMesesDer] = useState([])
    const [graficaDerHurtos, setGraficaDerHurtos] = useState([])
    const [graficaDerRobos, setGraficaDerRobos] = useState([])
    const [graficaDerArmas, setGraficaDerArmas] = useState([])

    const [hurtoTablaIzqAnt, setHurtoTablaIzqAnt] = useState(null)
    const [hurtoTablaIzqPos, setHurtoTablaIzqPos] = useState(null)
    const [roboTablaIzqAnt, setRoboTablaIzqAnt] = useState(null)
    const [roboTablaIzqPos, setRoboTablaIzqPos] = useState(null)
    const [armaTablaIzqAnt, setArmaTablaIzqAnt] = useState(null)
    const [armaTablaIzqPos, setArmaTablaIzqPos] = useState(null)
    const [totalMesAnterior, setTotalMesAnterior] = useState(null)
    const [totalMesActual, setTotalMesActual] = useState(null)

    const [hurtoTablaDerAnt, setHurtoTablaDerAnt] = useState(null)
    const [hurtoTablaDerPos, setHurtoTablaDerPos] = useState(null)
    const [roboTablaDerAnt, setRoboTablaDerAnt] = useState(null)
    const [roboTablaDerPos, setRoboTablaDerPos] = useState(null)
    const [armaTablaDerAnt, setArmaTablaDerAnt] = useState(null)
    const [armaTablaDerPos, setArmaTablaDerPos] = useState(null)
    const [totalMesAnteriorDer, setTotalMesAnteriorDer] = useState(null)
    const [totalMesActualDer, setTotalMesActualDer] = useState(null)
    const [añoActualDer, setAñoActualDer] = useState('')

    const [fechaDesde, setFechaDesde] = useState('')
    const [fechaHasta, setFechaHasta] = useState('')
    const [mesActualIzq, setMesActualIzq] = useState('')
    const [añoActual, setAñoActual] = useState('')
    const [mesActualDer, setMesActualDer] = useState('')

    const data = {
        labels: mesesIzq,
        datasets: [
            {
                type: 'bar',
                label: 'Denuncias ingresadas',
                data: graficaIzqTotal,
                backgroundColor: 'rgb(91, 186, 179)',
                borderColor: 'rgb(91, 186, 179)',
                borderWidth: 1,
                order: 1,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11,
                    },
                    formatter: (value) => `${value}`,
                },
            },
            {
                type: 'line',
                label: 'Denuncias de interes',
                data: graficaIzqInteres,
                tension: 0.5,
                fill: true,
                borderColor: 'rgba(88, 88, 88)',
                backgroundColor: 'rgba(89, 88, 88, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgba(88, 88, 88)',
                pointBackgroundColor: 'rgba(88, 88, 88)',
                order: 0,
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11,
                    },
                    formatter: (value) => `${value}`,
                },
            },
        ],
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 10,
                    },
                },
            },
            title: {
                display: true,
                text: 'DENUNCIAS INGRESADAS TOTAL y de INTERÉS',
                font: {
                    size: 14,
                },
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                font: {
                    size: 10,
                },
            },
        },
        scales: {
            x: {
                offset: true,
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                suggestedMax: Math.max(...graficaIzqTotal) + 200,
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
        }
    }

    const data1 = {
        labels: mesesDer,
        datasets: [
            {
                type: 'line',
                label: 'ROBO ARMA DE FUEGO',
                data: graficaDerArmas,
                tension: 0.5,
                fill: true,
                borderColor: 'rgb(236, 174, 92)',
                backgroundColor: 'rgba(236, 174, 92, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgb(236, 174, 92)',
                pointBackgroundColor: 'rgb(236, 174, 92)',
                order: 0,
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11,
                    },
                    formatter: (value) => `${value}`,
                },
            },
            {
                type: 'line',
                label: 'HURTOS',
                data: graficaDerHurtos,
                tension: 0.5,
                fill: true,
                borderColor: 'rgba(88, 88, 88)',
                backgroundColor: 'rgba(89, 88, 88, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgba(88, 88, 88)',
                pointBackgroundColor: 'rgba(88, 88, 88)',
                order: 0,
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11,
                    },
                    formatter: (value) => `${value}`,
                },
            },
            {
                type: 'line',
                label: 'ROBO',
                data: graficaDerRobos,
                tension: 0.5,
                fill: true,
                borderColor: 'rgb(91, 186, 179)',
                backgroundColor: 'rgba(91, 186, 179, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgb(91, 186, 179)',
                pointBackgroundColor: 'rgb(91, 186, 179)',
                order: 0,
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11,
                    },
                    formatter: (value) => `${value}`,
                },
            },
        ],
    };
    const options1 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 10,
                    },
                },
            },
            title: {
                display: true,
                text: 'DENUNCIAS DE INTERÉS POR DELITOS',
                font: {
                    size: 14,
                },
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                font: {
                    size: 10,
                },
            },
        },
        scales: {
            x: {
                offset: true,
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                suggestedMax: Math.max(...graficaDerRobos) + 200,
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
        },

    };

    const handleFechaDesde = (e) => {
        setFechaDesde(e.target.value)
    }

    const handleFechaHasta = (e) => {
        setFechaHasta(e.target.value)
    }

    const handleMesIzq = (e) => {
        setMesActualIzq(parseInt(e.target.value))
    }

    const handleAñoActual = (e) => {
        setAñoActual(parseInt(e.target.value))
    }

    const handleAñoActualDer = (e) => {
        setAñoActualDer(parseInt(e.target.value))
    }

    const handleMesDer = (e) => {
        setMesActualDer(parseInt(e.target.value))
    }

    // useeffect graficas
    useEffect(() => {
        setUltimaActualizacion(null)
        setTotalDenuncias(null)
        setDenunciasInteres(null)
        setHabitantes(null)
        setGraficaIzqInteres([])
        setGraficaIzqTotal([])
        setMesesIzq([])
        setGraficaDerArmas([])
        setGraficaDerHurtos([])
        setGraficaDerRobos([])
        setMesesDer([])
        if ((fechaDesde && fechaHasta) && (fechaDesde <= fechaHasta)) {
            const fetchReciente = fetch(`${HOST}/api/denuncia/reciente`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => res.json())
                .catch(err => console.log(err))

            const fetchTotal = fetch(`${HOST}/api/denuncia/total?desde=${fechaDesde}&hasta=${fechaHasta}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => res.json())
                .catch(err => console.log(err))

            const fetchInteres = fetch(`${HOST}/api/denuncia/interes?desde=${fechaDesde}&hasta=${fechaHasta}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => res.json())
                .catch(err => console.log(err))

            const fetchInteresTotal = fetch(`${HOST}/api/denuncia/graficainterestotal?desde=${fechaDesde}&hasta=${fechaHasta}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => res.json())
                .catch(err => console.log(err))

            const fetchInteresDelito = fetch(`${HOST}/api/denuncia/graficadelito?desde=${fechaDesde}&hasta=${fechaHasta}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => res.json())
                .catch(err => console.log(err))

            let mesesIzq = [];
            let cantTotalIzq = [];
            let cantInteresIzq = [];
            let mesesDer = [];
            let cantRobo = [];
            let cantHurto = [];
            let cantArma = [];

            Promise.all([fetchReciente, fetchTotal, fetchInteres, fetchInteresTotal, fetchInteresDelito])
                .then(([recienteData, totalData, interesData, interesTotalData, interesDelitoData]) => {
                    const newFechaReciente = (recienteData.fechaDenuncia)?.split('-')
                    setUltimaActualizacion(newFechaReciente[2] + '/' + newFechaReciente[1] + '/' + newFechaReciente[0])
                    setTotalDenuncias(totalData)
                    setDenunciasInteres(interesData)
                    setHabitantes(1703186)

                    interesTotalData.map(it => {
                        mesesIzq.push(it.mes)
                        cantTotalIzq.push(it.cantidad_total)
                        cantInteresIzq.push(parseInt(it.cantidad_interes))
                    })

                    const monthNames = [
                        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ];

                    const mesesNombresIzq = mesesIzq.map(mesNumero => monthNames[mesNumero - 1]);

                    setGraficaIzqInteres(cantInteresIzq)
                    setGraficaIzqTotal(cantTotalIzq)
                    setMesesIzq(mesesNombresIzq)

                    interesDelitoData.map(id => {
                        mesesDer.push(id.mes)
                        cantArma.push(parseInt(id.cantidad_arma))
                        cantHurto.push(parseInt(id.cantidad_hurto))
                        cantRobo.push(parseInt(id.cantidad_robo))
                    })

                    const mesesNombresDer = mesesDer.map(mesNumero => monthNames[mesNumero - 1]);
                    setGraficaDerArmas(cantArma)
                    setGraficaDerHurtos(cantHurto)
                    setGraficaDerRobos(cantRobo)
                    setMesesDer(mesesNombresDer)
                })
                .catch(err => console.log(err))
        } else {
            setUltimaActualizacion(null)
            setTotalDenuncias(null)
            setDenunciasInteres(null)
            setHabitantes(null)
            setGraficaIzqInteres([])
            setGraficaIzqTotal([])
            setMesesIzq([])
            setGraficaDerArmas([])
            setGraficaDerHurtos([])
            setGraficaDerRobos([])
            setMesesDer([])
        }
    }, [fechaDesde, fechaHasta])

    // useeffect tablaizq
    useEffect(() => {
        setHurtoTablaIzqAnt(null)
        setRoboTablaIzqAnt(null)
        setArmaTablaIzqAnt(null)
        setHurtoTablaIzqPos(null)
        setRoboTablaIzqPos(null)
        setArmaTablaIzqPos(null)
        if (mesActualIzq && añoActual) {
            const fetchTablaIzq = fetch(`${HOST}/api/denuncia/tablaInteres?mes=${mesActualIzq}&anio=${añoActual}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => res.json())
                .catch(err => console.log(err))

            Promise.all([fetchTablaIzq]).then(([tablaIzqData]) => {
                tablaIzqData.map((ti, index) => {
                    if (index === 0) {
                        setHurtoTablaIzqAnt(ti.cantidad_hurto)
                        setRoboTablaIzqAnt(ti.cantidad_robo)
                        setArmaTablaIzqAnt(ti.cantidad_arma)
                        setTotalMesAnterior(parseInt(ti.cantidad_hurto) + parseInt(ti.cantidad_robo) + parseInt(ti.cantidad_arma))
                    } else {
                        setHurtoTablaIzqPos(ti.cantidad_hurto)
                        setRoboTablaIzqPos(ti.cantidad_robo)
                        setArmaTablaIzqPos(ti.cantidad_arma)
                        setTotalMesActual(parseInt(ti.cantidad_hurto) + parseInt(ti.cantidad_robo) + parseInt(ti.cantidad_arma))
                    }
                })
            }).catch(err => console.log(err))
        } else {
            setHurtoTablaIzqAnt(null)
            setRoboTablaIzqAnt(null)
            setArmaTablaIzqAnt(null)
            setHurtoTablaIzqPos(null)
            setRoboTablaIzqPos(null)
            setArmaTablaIzqPos(null)
        }
    }, [mesActualIzq, añoActual])

    // useeffect tablader
    useEffect(() => {
        setHurtoTablaDerAnt(null)
        setRoboTablaDerAnt(null)
        setArmaTablaDerAnt(null)
        setHurtoTablaDerPos(null)
        setRoboTablaDerPos(null)
        setArmaTablaDerPos(null)
        if (mesActualDer && añoActualDer) {
            const fetchTablaDer = fetch(`${HOST}/api/denuncia/mensual?mes=${mesActualDer}&anio=${añoActualDer}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => res.json())
                .catch(err => console.log(err))

            Promise.all([fetchTablaDer]).then(([tablaDerData]) => {
                tablaDerData.map((td, index) => {
                    if (index === 0) {
                        setHurtoTablaDerAnt(td.cantidad_hurto)
                        setRoboTablaDerAnt(td.cantidad_robo)
                        setArmaTablaDerAnt(td.cantidad_arma)
                        setTotalMesAnteriorDer(parseInt(td.cantidad_hurto) + parseInt(td.cantidad_robo) + parseInt(td.cantidad_arma))
                    } else {
                        setHurtoTablaDerPos(td.cantidad_hurto)
                        setRoboTablaDerPos(td.cantidad_robo)
                        setArmaTablaDerPos(td.cantidad_arma)
                        setTotalMesActualDer(parseInt(td.cantidad_hurto) + parseInt(td.cantidad_robo) + parseInt(td.cantidad_arma))
                    }
                })
            }).catch(err => console.log(err))
        } else {
            setHurtoTablaDerAnt(null)
            setRoboTablaDerAnt(null)
            setArmaTablaDerAnt(null)
            setHurtoTablaDerPos(null)
            setRoboTablaDerPos(null)
            setArmaTablaDerPos(null)
        }
    }, [mesActualDer, añoActualDer])

    return (
        <div className='flex flex-col md:h-heightfull w-full px-4 md:px-8 pt-8 text-sm overflow-scroll'>
            <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Estadisticas</h2>
            {/* AÑO Y MES */}
            <div className='flex flex-col gap-2 sm:flex-row justify-center items-center pb-4 mt-6'>
                <p className='px-4 font-semibold'>DESDE:</p>
                <input type="date" className='bg-[#005cA2]/10 rounded-md px-2' onChange={(e) => handleFechaDesde(e)} value={fechaDesde} />
                <p className='px-4 font-semibold'>HASTA:</p>
                <input type="date" className='bg-[#005cA2]/10 rounded-md px-2' onChange={(e) => handleFechaHasta(e)} value={fechaHasta} />
            </div>
            {/* DATOS GENERALES */}
            <div className='pt-4 grid grid-cols-2 grid-rows-4 lg:grid-cols-7 lg:grid-rows-1 gap-2 w-full text-xs text-center'>
                <div className={` w-full h-20 rounded-md border-2 border-black/15 flex items-center justify-center flex-col ${ultimaActualizacion ? 'bg-[#005cA2]/30' : 'bg-black/10'}`}>
                    <p className={`font-semibold text-lg transition-opacity duration-300 ease-linear ${ultimaActualizacion ? 'opacity-100 pb-4' : 'opacity-0'}`}>{ultimaActualizacion}</p>
                    <p className=''>ULTIMA ACTUALIZACION</p>
                </div>
                <div className={`bg-[#005cA2]/30 w-full h-20 rounded-md border-2 border-black/15 flex items-center justify-center flex-col ${totalDenuncias ? 'bg-[#005cA2]/30' : 'bg-black/10'}`}>
                    <p className={`font-semibold text-lg transition-opacity duration-300 ease-linear ${totalDenuncias ? 'opacity-100 pb-4' : 'opacity-0'}`}>{totalDenuncias?.toLocaleString('de-DE')}</p>
                    <p className=''>TOTAL DE DENUNCIAS</p>
                </div>
                <div className={`bg-[#005cA2]/30 w-full h-20 rounded-md border-2 border-black/15 flex items-center justify-center flex-col ${denunciasInteres ? 'bg-[#005cA2]/30' : 'bg-black/10'}`}>
                    <p className={`font-semibold text-lg transition-opacity duration-300 ease-linear ${denunciasInteres ? 'opacity-100 pb-4' : 'opacity-0'}`}>{denunciasInteres?.toLocaleString('de-DE')}</p>
                    <p className=''>DENUNCIAS DE INTERES</p>
                </div>
                <div className={`bg-[#005cA2]/30 w-full h-20 rounded-md border-2 border-black/15 flex items-center justify-center flex-col ${denunciasInteres && totalDenuncias ? 'bg-[#005cA2]/30' : 'bg-black/10'}`}>
                    <p className={`font-semibold text-lg pb-4 ${denunciasInteres && totalDenuncias ? '' : 'hidden'}`}>{((denunciasInteres * 100) / totalDenuncias)}%</p>
                    <p className=''>PORCENTAJE DE INTERES</p>
                </div>
                <div className={`bg-[#005cA2]/30 w-full h-20 rounded-md border-2 border-black/15 flex items-center justify-center flex-col ${habitantes ? 'bg-[#005cA2]/30' : 'bg-black/10'}`}>
                    <p className={`font-semibold text-lg transition-opacity duration-300 ease-linear ${habitantes ? 'opacity-100 pb-4' : 'opacity-0'}`}>{habitantes?.toLocaleString('de-DE')}</p>
                    <p className=''>HABITANTES</p>
                </div>
                <div className={`bg-[#005cA2]/30 w-full h-20 rounded-md border-2 border-black/15 flex items-center justify-center flex-col ${denunciasInteres && habitantes ? 'bg-[#005cA2]/30' : 'bg-black/10'}`}>
                    <p className=''>TASA DE CRIMINALIDAD</p>
                    <p className={`font-semibold text-lg transition-opacity duration-300 ease-linear ${denunciasInteres && habitantes ? 'opacity-100 pb-4' : 'opacity-0'}`}>{ }</p>
                    <p className=''>DEN. INT. C/ 100.000 hab</p>
                </div>
                <div className={`bg-[#005cA2]/30 w-full h-20 rounded-md border-2 border-black/15 flex items-center justify-center flex-col ${denunciasInteres && habitantes ? 'bg-[#005cA2]/30' : 'bg-black/10'}`}>
                    <p className={`font-semibold text-lg transition-opacity duration-300 ease-linear ${denunciasInteres && habitantes ? 'opacity-100 pb-4' : 'opacity-0'}`}>{ }</p>
                    <p className=''>POBLACION AFECTADA</p>
                </div>
            </div>
            {/* GRAFICAS */}
            <div className='flex flex-col lg:flex-row w-full gap-4 mt-8'>
                {/* DENUNCIAS INGRESADAS TOTAL y de INTERÉS */}
                <div className='w-full lg:w-1/2'>
                    <div className='overflow-x-scroll'>
                        <div className={`${graficaIzqTotal.length > 12 ? 'lg:min-w-[750px]' : 'lg:min-w-0'} min-w-[450px]  h-[300px] lg:h-96 flex justify-center items-center backdrop-blur-sm bg-white/30`}>
                            <Chart options={options} data={data} />
                        </div>
                    </div>
                </div>
                {/* DENUNCIAS DE INTERÉS POR DELITOS */}
                <div className='w-full lg:w-1/2'>
                    <div className='overflow-x-scroll'>
                        <div className={`${graficaIzqTotal.length > 12 ? 'lg:min-w-[750px]' : 'lg:min-w-0'} min-w-[450px] h-[300px] lg:h-96 flex justify-center items-center backdrop-blur-sm bg-white/30`}>
                            <Chart options={options1} data={data1} />
                        </div>
                    </div>
                </div>
            </div>
            {/* TABLAS */}
            <div className='mt-8 text-xs w-full flex flex-col lg:flex-row gap-8 justify-center items-center mb-8'>
                {/* COMPARATIVO INTERANUAL */}
                <div className='flex flex-col w-full lg:w-1/2'>
                    <h2 className='font-bold pb-4 text-center lg:text-left text-[#005CA2]'>DENUNCIAS DE INTERÉS - COMPARATIVO INTERANUAL</h2>
                    <div className='flex flex-col'>
                        <div className='flex flex-col gap-2 md:flex-row justify-center items-center pb-4'>
                            <p className='px-4 font-semibold'>MES ACTUAL:</p>
                            <select name="mes" id="" className='bg-[#005cA2]/10 rounded-md px-2' onChange={(e) => handleMesIzq(e)} value={mesActualIzq}>
                                <option value="" disabled selected>Seleccione un mes</option>
                                <option value="1">ENERO</option>
                                <option value="2">FEBRERO</option>
                                <option value="3">MARZO</option>
                                <option value="4">ABRIL</option>
                                <option value="5">MAYO</option>
                                <option value="6">JUNIO</option>
                                <option value="7">JULIO</option>
                                <option value="8">AGOSTO</option>
                                <option value="9">SEPTIEMBRE</option>
                                <option value="10">OCTUBRE</option>
                                <option value="11">NOVIEMBRE</option>
                                <option value="12">DICIEMBRE</option>
                            </select>
                            <p className='px-4 font-semibold'>AÑO ACTUAL:</p>
                            <input type="text" className='bg-[#005cA2]/10 rounded-md px-2' onChange={(e) => { handleAñoActual(e) }} />
                        </div>
                        <table className={`w-full`}>
                            <thead className={`border-b-2  ${hurtoTablaIzqAnt ? 'bg-[#ECAE5C]' : 'bg-[#f0f0f0]'}`}>
                                <tr>
                                    <th className='text-left'>DELITO</th>
                                    <th>{mesActualIzq && hurtoTablaIzqAnt ? mesActualIzq + '/' : 'MES ANTERIOR'}{añoActual && hurtoTablaIzqAnt ? parseInt(añoActual) - 1 : ''}</th>
                                    <th>{mesActualIzq && hurtoTablaIzqAnt ? mesActualIzq + '/' : 'MES ACTUAL'}{añoActual && hurtoTablaIzqAnt ? parseInt(añoActual) : ''}</th>
                                    <th>VARIACION INTERANUAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={`border-b-2  ${hurtoTablaIzqAnt ? 'bg-[#ECAE5C]' : 'bg-[#f0f0f0]'}`}>
                                    <td className='text-left border-r-2'>HURTOS</td>
                                    <td className='text-center'>{hurtoTablaIzqAnt}</td>
                                    <td className='text-center'>{hurtoTablaIzqPos}</td>
                                    <td>{hurtoTablaIzqAnt ? (parseInt(hurtoTablaIzqAnt) > parseInt(hurtoTablaIzqPos)) ? <IoMdArrowDropdownCircle className='mx-auto text-green-800 h-6 w-6' /> : <IoMdArrowDropupCircle className='mx-auto  text-red-800 h-6 w-6' /> : ''}</td>
                                </tr>
                                <tr>
                                    <td className='text-left border-r-2'>ROBO</td>
                                    <td className='text-center'>{roboTablaIzqAnt}</td>
                                    <td className='text-center'>{roboTablaIzqPos}</td>
                                    <td>{roboTablaIzqAnt ? (parseInt(roboTablaIzqAnt) > parseInt(roboTablaIzqPos)) ? <IoMdArrowDropdownCircle className='mx-auto text-green-800 h-6 w-6' /> : <IoMdArrowDropupCircle className='mx-auto  text-red-800 h-6 w-6' /> : ''}</td>
                                </tr>
                                <tr className={`border-b-2  ${hurtoTablaIzqAnt ? 'bg-[#ECAE5C]' : 'bg-[#f0f0f0]'}`}>
                                    <td className='text-left border-r-2'>ROBO CON ARMA DE FUEGO</td>
                                    <td className='text-center'>{armaTablaIzqAnt}</td>
                                    <td className='text-center'>{armaTablaIzqPos}</td>
                                    <td>{armaTablaIzqAnt ? (parseInt(armaTablaIzqAnt) > parseInt(armaTablaIzqPos)) ? <IoMdArrowDropdownCircle className='mx-auto text-green-800 h-6 w-6' /> : <IoMdArrowDropupCircle className='mx-auto  text-red-800 h-6 w-6' /> : ''}</td>
                                </tr>
                                <tr>
                                    <th className='text-left border-r-2'>Total</th>
                                    <th className='text-center'>{hurtoTablaIzqAnt ? (totalMesAnterior) : ''}</th>
                                    <th className='text-center'>{hurtoTablaIzqPos ? (totalMesActual) : ''}</th>
                                    <th>
                                        {armaTablaIzqAnt ? (
                                            totalMesAnterior > totalMesActual ? (
                                                <div className='flex flex-row justify-center items-center gap-2'>
                                                    <p className="text-xs">{Math.trunc(((totalMesActual / totalMesAnterior) - 1) * 100) / 100}%</p>
                                                    <IoMdArrowDropdownCircle className="text-green-800 h-6 w-6" />
                                                </div>
                                            ) : (
                                                <div className='flex flex-row justify-center items-center gap-2'>
                                                    <p className="text-xs">{Math.trunc(((totalMesActual / totalMesAnterior) - 1) * 100) / 100}%</p>
                                                    <IoMdArrowDropupCircle className="text-red-800 h-6 w-6" />
                                                </div>
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* COMPARATIVO MENSUAL */}
                <div className='flex flex-col w-full lg:w-1/2'>
                    <h2 className='font-bold pb-4 text-center lg:text-left text-[#005CA2]'>DENUNCIAS DE INTERÉS - COMPARATIVO MENSUAL</h2>
                    <div className='flex flex-col'>
                        <div className='flex flex-col gap-2 md:flex-row justify-center items-center pb-4'>
                            <p className='px-4 font-semibold'>MES ACTUAL:</p>
                            <select name="mes" id="" className='bg-[#005cA2]/10 rounded-md px-2' onChange={(e) => handleMesDer(e)} value={mesActualDer}>
                                <option value="" disabled selected>Seleccione un mes</option>
                                <option value="1">ENERO</option>
                                <option value="2">FEBRERO</option>
                                <option value="3">MARZO</option>
                                <option value="4">ABRIL</option>
                                <option value="5">MAYO</option>
                                <option value="6">JUNIO</option>
                                <option value="7">JULIO</option>
                                <option value="8">AGOSTO</option>
                                <option value="9">SEPTIEMBRE</option>
                                <option value="10">OCTUBRE</option>
                                <option value="11">NOVIEMBRE</option>
                                <option value="12">DICIEMBRE</option>
                            </select>
                            <p className='px-4 font-semibold'>AÑO ACTUAL:</p>
                            <input type="text" className='bg-[#005cA2]/10 rounded-md px-2' onChange={(e) => { handleAñoActualDer(e) }} />
                        </div>
                        <table className='w-full'>
                            <thead className={`border-b-2  ${hurtoTablaDerAnt ? 'bg-[#5BBAB3]' : 'bg-[#f0f0f0]'}`}>
                                <tr>
                                    <th className='text-left'>DELITO</th>
                                    <th className='text-center'>{mesActualDer && hurtoTablaDerAnt ? (mesActualDer - 1) + '/' : 'MES ANTERIOR'}{añoActualDer && hurtoTablaDerAnt ? parseInt(añoActualDer) : ''}</th>
                                    <th>{mesActualDer && hurtoTablaDerAnt ? mesActualDer + '/' : 'MES ACTUAL'}{añoActualDer && hurtoTablaDerAnt ? parseInt(añoActualDer) : ''}</th>
                                    <th>VARIACION MENSUAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={`border-b-2  ${hurtoTablaDerAnt > 0 ? 'bg-[#5BBAB3]' : 'bg-[#f0f0f0]'}`}>
                                    <td className='text-left border-r-2'>HURTOS</td>
                                    <td className='text-center'>{hurtoTablaDerAnt}</td>
                                    <td className='text-center'>{hurtoTablaDerPos}</td>
                                    <td>{hurtoTablaDerAnt ? (parseInt(hurtoTablaDerAnt) > parseInt(hurtoTablaDerPos)) ? <IoMdArrowDropdownCircle className='mx-auto text-green-800 h-6 w-6' /> : <IoMdArrowDropupCircle className='mx-auto  text-red-800 h-6 w-6' /> : ''}</td>
                                </tr>
                                <tr>
                                    <td className='text-left border-r-2'>ROBO</td>
                                    <td className='text-center'>{roboTablaDerAnt}</td>
                                    <td className='text-center'>{roboTablaDerPos}</td>
                                    <td>{roboTablaDerAnt ? (parseInt(roboTablaDerAnt) > parseInt(roboTablaDerPos)) ? <IoMdArrowDropdownCircle className='mx-auto text-green-800 h-6 w-6' /> : <IoMdArrowDropupCircle className='mx-auto  text-red-800 h-6 w-6' /> : ''}</td>
                                </tr>
                                <tr className={`border-b-2  ${hurtoTablaDerAnt ? 'bg-[#5BBAB3]' : 'bg-[#f0f0f0]'}`}>
                                    <td className='text-left border-r-2'>ROBO CON ARMA DE FUEGO</td>
                                    <td className='text-center'>{armaTablaDerAnt}</td>
                                    <td className='text-center'>{armaTablaDerPos}</td>
                                    <td>{armaTablaDerAnt ? (parseInt(armaTablaDerAnt) > parseInt(armaTablaDerPos)) ? <IoMdArrowDropdownCircle className='mx-auto text-green-800 h-6 w-6' /> : <IoMdArrowDropupCircle className='mx-auto  text-red-800 h-6 w-6' /> : ''}</td>
                                </tr>
                                <tr>
                                    <th className='text-left border-r-2'>Total</th>
                                    <th>{hurtoTablaDerAnt ? (totalMesAnteriorDer) : ''}</th>
                                    <th>{hurtoTablaDerPos ? (totalMesActualDer) : ''}</th>
                                    <th>{armaTablaDerAnt ? (
                                        totalMesAnteriorDer > totalMesActualDer ? (
                                            <div className='flex flex-row justify-center items-center gap-2'>
                                                <p className="text-xs">{Math.trunc(((totalMesActualDer / totalMesAnteriorDer) - 1) * 100) / 100}%</p>
                                                <IoMdArrowDropdownCircle className="text-green-800 h-6 w-6" />
                                            </div>
                                        ) : (
                                            <div className='flex flex-row justify-center items-center gap-2'>
                                                <p className="text-xs">{Math.trunc(((totalMesActualDer / totalMesAnteriorDer) - 1) * 100) / 100}%</p>
                                                <IoMdArrowDropupCircle className="text-red-800 h-6 w-6" />
                                            </div>
                                        )
                                    ) : (
                                        ''
                                    )}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Estadisticas