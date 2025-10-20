import React, { useEffect, useState, useContext } from 'react'
import { BsPlusCircleFill, BsXCircleFill, BsSearch } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ContextConfig } from '../context/ContextConfig';

const Usuarios = () => {

    const [users, setUsers] = useState([])
    const [userSearch, setUserSearch] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userID, setUserID] = useState(null)
    const { handleSession, HOST, HOST_AUTH } = useContext(ContextConfig)

    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${HOST_AUTH}/auth/usuario/`, {
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
            })
            .then(data => {
                // console.log(data)
                setUsers(data)
                setFilteredUsers(data);
            })
    }, [])

    useEffect(() => {
        const lowerCaseSearch = userSearch.toLowerCase();
        const filtered = users.filter(user =>
            user.dni.toString().includes(lowerCaseSearch) ||
            user.nombre.toLowerCase().includes(lowerCaseSearch) ||
            user.apellido.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredUsers(filtered);
    }, [userSearch, users])

    const handleCheck = (id) => {
        //console.log("Id recibido para check: ", id)
        if (userID === id) {
            setUserID(null);
        } else {
            setUserID(id);
        }
    }

    const updateUser = () => {
        if (userID) {
            navigate(`/admin/usuarios/modificar/${userID}`)
        } else {
            Swal.fire({
                title: 'Usuario no seleccionado',
                icon: 'error',
                text: 'Por favor, seleccione un usuario para modificar',
                confirmButtonText: 'Aceptar'
            })
        }
    }

    const deleteUser = () => {
        if (userID) {
            fetch(`${HOST_AUTH}/api/usuario/user/${userID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
                .then(res => {
                    if (res.ok) {
                        Swal.fire({
                            title: 'Usuario eliminado',
                            icon: 'success',
                            text: 'El usuario ha sido eliminado con éxito',
                            confirmButtonText: 'Aceptar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate('/sgd/usuarios')
                            }
                        })
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
        } else {
            Swal.fire({
                title: 'Usuario no seleccionado',
                icon: 'error',
                text: 'Por favor, seleccione un usuario para eliminar',
                confirmButtonText: 'Aceptar'
            })
        }
    }

    // useEffect(() => {
    //     console.log("userID de usuario seleccionado: ", userID)
    // }, [userID])

    return (
        <div className='flex flex-col md:h-screen px-8 pt-8'>
            <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Usuarios</h2>
            <div className='md:h-1/4 w-full flex flex-col items-center md:flex-row md:justify-between py-8 md:gap-0 gap-4'>
                <div className='relative w-full md:w-3/5 px-4 flex justify-start items-center'>
                    <input className='w-full text-sm h-10 px-6 rounded-3xl border-[#757873] border-2' placeholder='Buscar por dni, nombre o apellido...' onChange={(e) => setUserSearch(e.target.value)} />
                    <div className="absolute right-9 top-1/2 transform -translate-y-1/2">
                        <BsSearch className="text-[#757873]" />
                    </div>
                </div>
                <div className='md:w-2/5 flex justify-around items-center gap-20 md:gap-0'>
                    <NavLink to={'/admin/usuarios/nuevo'} className='md:w-32 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#2ca900] flex flex-row items-center'>
                        <BsPlusCircleFill className='text-4xl' />
                        <span className='md:flex hidden text-center'>Nuevo usuario</span>
                    </NavLink>
                    <button className='md:w-32 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#002649] flex flex-row items-center' onClick={updateUser}>
                        <BiSolidEdit className='text-4xl' />
                        <span className='md:block text-center hidden'>Modificar usuario</span>
                    </button>
                    {/* <button className='md:w-32 h-12 w-12 text-white md:rounded-md rounded-full text-sm md:px-4 md:py-1 px-2 bg-[#f60021] flex flex-row items-center' onClick={deleteUser}>
                        <BsXCircleFill className='text-4xl' />
                        <span className='md:block text-center hidden'>Eliminar usuario</span>
                    </button> */}
                </div>
            </div>
            <div className='md:h-3/4 px-2 overflow-scroll'>
                {
                    filteredUsers.length > 0 ? (
                        <table className='w-auto text-md'>
                            <thead className='border-b-2 border-black w-full'>
                                <tr>
                                    <th className='md:w-1/6 w-[25%] text-center'>DNI</th>
                                    <th className='md:w-2/6 w-[55%] text-center'>Apellido y nombre</th>
                                    <th className='md:w-2/6 hidden md:flex text-center'>Email</th>
                                    <th className='md:w-1/6 w-[15%] text-center'>Rol</th>
                                    <th className='md:w-1/6 w-[5%] text-center'>Acción</th>
                                </tr>
                            </thead>
                            <tbody className='w-full'>
                                {
                                    filteredUsers.map(user => (
                                        <tr key={user.dni}>
                                            <td className='md:w-1/6 text-center w-[25%]'>{user.dni}</td>
                                            <td className='md:w-2/6 text-center w-[55%]'>{user.apellido}, {user.nombre}</td>
                                            <td className='md:w-2/6 hidden text-center md:flex'>{user.email}</td>
                                            <td className='md:w-1/6 text-center w-[15%]'>{user.rol?.descripcion}</td>
                                            <td className='md:w-1/6 w-[5%] text-center'>
                                                <input className='mx-auto' type="checkbox" checked={userID === user.dni} onChange={() => handleCheck(user.dni)} />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ) : <h1>La base de datos se encuentra sin usuarios</h1>
                }

            </div>
        </div>
    )
}

export default Usuarios