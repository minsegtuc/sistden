import { useState, useEffect, useContext } from 'react'
import { ContextConfig } from '../context/ContextConfig';

const Auditoria = () => {

    const [rankingTotal, setRankingTotal] = useState([])
    const [rankingDiario, setRankingDiario] = useState([])

    const { handleSession, HOST, denuncia, socket, relato, setRelato, denunciasIds, handleDenuncia } = useContext(ContextConfig)

    useEffect(() => {
        fetch(`${HOST}/api/usuario/ranking?fecha=${encodeURIComponent('2025-04-28')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                } else if (res.status === 401) {
                    handleSession()
                } else {
                    throw new Error('Error al solicitar ranking')
                }
            })
            .then((data) => {
                console.log(data)
                setRankingTotal(data)
            })

        const fechaHoy = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'America/Argentina/Buenos_Aires',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
            .format(new Date())
            .replace(/-/g, '-');;


        fetch(`${HOST}/api/usuario/ranking?fecha=${encodeURIComponent(fechaHoy)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                } else if (res.status === 401) {
                    handleSession()
                } else {
                    throw new Error('Error al solicitar ranking')
                }
            })
            .then((data) => {
                console.log(data)
                setRankingDiario(data)
            })
    }, [])

    return (
        <div className='flex flex-col md:h-heightfull px-8 pt-8 overflow-scroll'>
            <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Ranking</h2>
            <div className='flex flex-col md:flex-row justify-center items-start w-full gap-32'>
                <div className='w-full md:w-1/2 flex flex-col justify-center'>
                    <h3 className='text-center text-lg font-semibold py-4 uppercase tracking-widest'>Total</h3>
                    <table>
                        <thead className='bg-[#005CA2] text-white'>
                            <tr>
                                <th>Posicion</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rankingTotal.length > 0 ? (
                                    rankingTotal.map((ranking, index) => {
                                        return (
                                            <tr key={index} className='border-[1px] border-y-black/75 border-x-none'>
                                                <td className='text-center font-bold'>{index + 1}°</td>
                                                <td className='text-center'>{ranking.nombre}</td>
                                                <td className='text-center'>{ranking.cantidad_clasificadas}</td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className='text-center'>-</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div className='w-full md:w-1/2 flex flex-col justify-center'>
                    <h3 className='text-center text-lg font-semibold py-4 uppercase tracking-widest'>Hoy</h3>
                    <table>
                        <thead className='bg-[#005CA2] text-white'>
                            <tr>
                                <th>Posicion</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rankingDiario.length > 0 ? (
                                    rankingDiario.map((ranking, index) => {
                                        return (
                                            <tr key={index} className='border-[1px] border-y-black/75'>
                                                <td className='text-center font-bold'>{index + 1}°</td>
                                                <td className='text-center'>{ranking.nombre}</td>
                                                <td className='text-center'>{ranking.cantidad_clasificadas}</td>
                                            </tr>)
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3" className='text-center'>-</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Auditoria