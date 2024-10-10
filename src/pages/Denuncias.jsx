import { useState, useEffect } from 'react'
import { BsSearch } from "react-icons/bs";
import { BiPlusCircle } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const Denuncias = () => {

    const [denunciasSC, setDenunciasSC] = useState([])
    const navigate = useNavigate();

    const handleClasificador = (denuncia) => {
        navigate(`/denuncias/clasificacion/${denuncia}`)
    }

    useEffect(() => {
        fetch('http://localhost:3000/api/denuncia/denuncia', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
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
            })
            .then(data => {
                const denunciasFilter = []

                data.map(denuncia => {
                    if (denuncia.isClassificated === 0) {
                        const newFecha = (denuncia.fechaDelito).split('-')
                        denunciasFilter.push({ ...denuncia, fechaDelito: newFecha[2] + '/' + newFecha[1] + '/' + newFecha[0] })
                    }
                }
                )

                setDenunciasSC(denunciasFilter)
            })
    }, [])


    return (
        <div className='flex flex-col md:h-heightfull w-full px-8 pt-8 text-sm'>
            <h2 className='text-[#345071] font-bold text-2xl md:text-left text-center'>Gestion de denuncias</h2>
            <div className='md:h-1/4 w-full flex items-center flex-row md:justify-between pt-2 gap-4'>
                <div className='relative w-5/6 px-4 flex justify-start items-center'>
                    <input className='w-full text-sm h-10 px-6 rounded-3xl border-[#757873] border-2' placeholder='Buscar N° de Denuncia' />
                    <div className="absolute right-9 top-1/2 transform -translate-y-1/2">
                        <BsSearch className="text-[#757873]" />
                    </div>
                </div>
                <div className='w-1/6 flex justify-center md:justify-start items-center gap-20 md:gap-0'>
                    <button className='md:w-48 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#002649] flex flex-row items-center justify-between'>
                        <NavLink to={'/denuncias/cargar'} className='flex flex-row items-center justify-between w-full'>
                            <BiPlusCircle className='text-4xl' />
                            <span className='md:block text-center hidden'>Cargar Denuncias</span>
                        </NavLink>
                    </button>
                </div>
            </div>
            <div className='md:h-full py-4'>
                {
                    denunciasSC.length > 0 ?
                        (
                            <table className='w-full'>
                                <thead className='border-b-2 border-black w-full'>
                                    <tr className='w-full flex text-center'>
                                        <th className='w-2/6 text-left'>N° DENUNCIA</th>
                                        {/* <th className='w-1/6'>Delito</th> */}
                                        <th className='w-1/6'>Comisaria</th>
                                        <th className='w-1/6'>Fecha</th>
                                        <th className='w-1/6 text-right'>Acciones</th>
                                    </tr>
                                </thead>
                                {
                                    denunciasSC.map(denuncia => (
                                        <tr className='w-full flex text-center' key={denuncia.idDenuncia}>
                                            <td className='w-2/6 text-left'>{denuncia.idDenuncia}</td>
                                            {/* <td className='w-1/6'>{denuncia.submodalidad.tipoDelito.descripcion}</td> */}
                                            <td className='w-1/6'>{denuncia.comisariaId}</td>
                                            <td className='w-1/6'>{denuncia.fechaDelito}</td>
                                            <td className='w-1/6 text-right'><button onClick={() => handleClasificador(denuncia.idDenuncia)}>Clasificar</button></td>
                                        </tr>
                                    ))
                                }
                            </table>
                        )
                        :
                        (
                            <div className='bg-[#345071] text-white rounded-md w-96 text-center py-16 mx-auto font-semibold shadow-md shadow-[#4274e2]/50'>La base de datos se encuentra sin denuncias para clasificar</div>
                        )
                }

            </div>
        </div>
    )
}

export default Denuncias