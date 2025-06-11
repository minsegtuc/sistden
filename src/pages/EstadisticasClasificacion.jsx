import React, { useEffect, useState, useContext, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ContextConfig } from '../context/ContextConfig';
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
    Filler
} from "chart.js/auto";
import { SankeyController, Flow } from "chartjs-chart-sankey";
import { tooltip } from 'leaflet';
import { Chart } from 'react-google-charts';

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
    ChartDataLabels,
    SankeyController,
    Flow
);

// VERDE #5BBAB3 rgb(91, 186, 179)
// NARANJA #ECAE5C rgb(236, 174, 92)
// ROJO #FC645E rgb(252, 100, 94)
// NEGRO #595858 rgba(88, 88, 88)
// GRIS FONDO #F0F0F0 rgb(240, 240, 240)

const EstadisticasClasificacion = () => {

    const { HOST } = useContext(ContextConfig)
    const [dataBar, setDataBar] = useState(null)
    const [dataBarSubmodalidad, setDataBarSubmodalidad] = useState(null)
    const [sankeyData, setSankeyData] = useState(null)
    const [submodalidadElegida, setSubmodalidadElegida] = useState(null)
    const [pesoCambio, setPesoCambio] = useState(10)
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')

    const data = {
        labels: dataBar?.map((item) => item.label),
        datasets: [
            {
                label: "Coinciden",
                data: dataBar?.map((item) => item.coinciden),
                backgroundColor: "rgb(91, 186, 179)",
                borderColor: 'rgb(91, 186, 179)',
                borderWidth: 1,
                datalabels: {
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }
            },
            {
                label: "Cambiaron",
                data: dataBar?.map((item) => item.cambiaron),
                borderColor: 'rgb(236, 174, 92)',
                backgroundColor: "rgba(236, 174, 92)",
                borderWidth: 1,
                datalabels: {
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            tooltip: { enabled: true },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const dataSubmodalidad = {
        labels: dataBarSubmodalidad?.map((item) => item.label),
        datasets: [
            {
                label: "Submodalidad sin cambio",
                data: dataBarSubmodalidad?.map((item) => item.coinciden),
                backgroundColor: "rgb(91, 186, 179)",
                borderColor: 'rgb(91, 186, 179)',
                borderWidth: 1,
                datalabels: {
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }
            },
            {
                label: "Cambio a otra submodalidad",
                data: dataBarSubmodalidad?.map((item) => item.cambiaron),
                borderColor: 'rgb(236, 174, 92)',
                backgroundColor: "rgba(236, 174, 92)",
                borderWidth: 1,
                datalabels: {
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                }
            },
        ],
    };

    const optionsSubmodalidad = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            tooltip: { enabled: true },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
        onClick: (event, elements, chart) => {
            if (elements.length > 0) {
                const chartInstance = chartRef.current;
                const index = elements[0].index;
                const label = chartInstance.data.labels[index];
                setSubmodalidadElegida(label);
            }
        },
    };

    const chartRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fechaInicio') {
            setFechaInicio(value);
        }
        if (name === 'fechaFin') {
            setFechaFin(value);
        }
        if (name === 'pesoCambio') {
            setPesoCambio(value);
        }
    };

    useEffect(() => {
        fetch(`${HOST}/api/denuncia/estadisticasClasificacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ fechaInicio, fechaFin })
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
                setDataBar(null)
                const formateado = Object.entries(data).map(([key, value]) => {
                    return {
                        label: key,
                        coinciden: Number(value[0]?.coinciden),
                        cambiaron: Number(value[0]?.cambiaron),
                    };
                });

                setDataBar(formateado);

            })
            .catch(err => console.log(err))


        fetch(`${HOST}/api/denuncia/estadisticasSubmodalidad`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ fechaInicio, fechaFin })
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
                setDataBarSubmodalidad(null)
                console.log("Data submodalidad: ", data.conteo)
                const formateadoConteo = data.conteo.map((item) => ({
                    label: item.modalidad_ia,
                    coinciden: Number(item.coinciden),
                    cambiaron: Number(item.cambiaron),
                }))
                    .filter(item => item.cambiaron >= pesoCambio);

                setDataBarSubmodalidad(formateadoConteo);
            })
            .catch(err => console.log(err))
    }, [fechaInicio, fechaFin, pesoCambio]);

    useEffect(() => {
        fetch(`${HOST}/api/denuncia/estadisticasSankey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ fechaInicio, fechaFin })
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
                setSankeyData(null)
                const formateadoSankey = data.sankey
                    .filter(item => item.from === submodalidadElegida)
                    .map(item => ({
                        from: `${item.from}_IA`,
                        to: item.to,
                        flow: Number(item.flow),
                    }));

                setSankeyData(formateadoSankey);
            })
            .catch(err => console.log(err))
    }, [submodalidadElegida])

    return (
        <div className='flex flex-col md:h-heightfull w-full px-4 md:px-8 pt-8 text-sm overflow-scroll'>
            <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Estadisticas IA</h2>
            <div className='bg-gray-300 p-2 rounded-lg w-[95%] mt-2 flex flex-col lg:flex-row justify-center items-center mx-auto'>
                <div className='flex flex-row justify-center items-center'>
                    <div className='flex flex-col lg:flex-wrap lg:flex-row mt-2 lg:w-2/3 w-full'>
                        <div className='flex flex-col lg:flex-row justify-center border-r-[1px] items-center gap-2 px-4 py-1'>
                            <label className='text-xs font-semibold whitespace-nowrap text-left'>Fecha de inicio:</label>
                            <input type="date" name='fechaInicio' value={fechaInicio} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg p-2 h-7 text-xs min-w-32' />
                            <label className='text-xs font-semibold whitespace-nowrap'>Fecha de fin:</label>
                            <input type="date" name='fechaFin' value={fechaFin} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg p-2 h-7 text-xs min-w-32' />
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-wrap lg:flex-row mt-2 w-full'>
                        <div className='flex flex-col lg:flex-row justify-center border-r-[1px] items-center gap-2 px-4 py-1'>
                            <label className='text-xs font-semibold whitespace-nowrap text-left'>Peso de cambio:</label>
                            <input type="number" name='pesoCambio' value={pesoCambio} onChange={(e) => handleChange(e)} className='border border-gray-400 rounded-lg p-2 h-7 text-xs min-w-32' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full min-h-fit overflow-x-auto py-4 flex md:justify-center md:items-center'>
                <div className='min-w-[700px] min-h-auto mx-auto'>
                    {dataBar ? (
                        <Bar data={data} options={options} />
                    ) : (
                        <p className="text-center">Cargando datos...</p>
                    )}
                </div>
            </div>
            <div className='w-full overflow-x-auto py-4 flex md:justify-center md:items-center'>
                <div className='min-w-[950px] h-auto mx-auto'>
                    {dataBarSubmodalidad ? (
                        <Bar data={dataSubmodalidad} options={optionsSubmodalidad} ref={chartRef} />
                    ) : (
                        <p className="text-center">Cargando datos...</p>
                    )}
                </div>

            </div>
            <div className='w-full min-h-fit overflow-x-auto py-4 flex md:justify-center md:items-center'>
                <div className='w-full h-auto mx-auto'>
                    {sankeyData && submodalidadElegida ? (
                        <Chart
                            width={'100%'}
                            height={'400px'}
                            chartType="Sankey"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['From', 'To', 'Weight'],
                                ...sankeyData.map((item) => [item.from, item.to, item.flow]),
                            ]}
                            options={{
                                sankey: {
                                    node: {
                                        colors: ['#5BBAB3', '#ECAE5C', '#FC645E', '#595858'],
                                        label: {
                                            fontName: 'Arial',
                                            fontSize: 12,
                                            color: '#000000',
                                        },
                                    },
                                    link: {
                                        colorMode: 'gradient',
                                        colors: ['#5BBAB3', '#ECAE5C', '#FC645E', '#595858'],
                                    },
                                },
                                tooltip: {
                                    isHtml: true,
                                },
                            }}
                        />
                    ) : (
                        <p className="text-center"></p>
                    )}
                </div>

            </div>
        </div>
    )
}

export default EstadisticasClasificacion