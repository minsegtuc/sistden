import React, { useEffect, useState, useContext } from 'react'
import { BiSolidEdit } from "react-icons/bi";
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ContextConfig } from '../context/ContextConfig';

const Roles = () => {

    const [roles, setRoles] = useState([])
    const [rolForm, setRolForm] = useState({ idRol: '', descripcion: '', detalle: '' })
    const [isLoading, setIsLoading] = useState(false)
    const { handleSession, HOST, HOST_AUTH } = useContext(ContextConfig)

    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${HOST_AUTH}/auth/rol`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error("Error al obtener el rol:", response.statusText);
                }
            })
            .then(data => {
                //console.log("Info rol: ", data)
                setRoles(data)
            })
            .catch(err => {
                console.error("Error de red:", err);
            });
    }, [])

    const handleEdit = (id) => {
        const roleToEdit = roles.find(role => role.idRol === id);
        if (roleToEdit) {
            setRolForm({ idRol: roleToEdit.idRol, descripcion: roleToEdit.descripcion, detalle: roleToEdit.detalle });
        }
    }

    const handleClear = () => {
        setRolForm({ idRol: '', descripcion: '', detalle: '' });
    }

    const handleSubmit = (e) => {
        setIsLoading(true)
        e.preventDefault();
        const idRol = rolForm.idRol;
        const descripcion = rolForm.descripcion;
        const detalle = rolForm.detalle;

        const rolExistente = roles.find(role => role.idRol === idRol);

        if (rolExistente) {
            fetch(`${HOST_AUTH}/auth/rol/${idRol}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ idRol, descripcion, detalle })
            })
                .then(response => {
                    if (response.ok) {
                        setIsLoading(false)
                        return response.json();
                    } else {
                        console.error("Error al obtener el rol:", response.statusText);
                    }
                })
                .then(data => {
                    Swal.fire({
                        title: 'Rol modificado',
                        icon: 'success',
                        text: 'El rol ha sido modificado con éxito',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const updatedRoles = roles.map(role => role.idRol === idRol ? data : role);
                            setRoles(updatedRoles);
                            handleClear();
                        }
                    })
                })
                .catch(err => {
                    console.error("Error de red:", err);
                });
        } else {
            fetch(`${HOST_AUTH}/auth/rol`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ descripcion, detalle })
            })
                .then(response => {
                    if (response.ok) {
                        setIsLoading(false)
                        return response.json();
                    } else {
                        console.error("Error al obtener el rol:", response.statusText);
                    }
                })
                .then(data => {                    
                    Swal.fire({
                        title: 'Rol creado',
                        icon: 'success',
                        text: 'El rol ha sido creado con éxito',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setRoles([...roles, data]);
                            handleClear();
                        }
                })
                .catch(err => {
                    console.log(err)
                });
            })
        }
    }

    return (
        <div className='flex flex-col md:h-screen px-8 pt-8 overflow-y-hidden'>
            <h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Roles</h2>
            <div className='flex flex-col md:flex-row gap-2'>
                <div className='w-full md:w-1/2 text-md'>
                    <table className='w-full border-collapse mt-4'>
                        <thead>
                            <tr className='text-center'>
                                <th>ID</th>
                                <th>Descripción</th>
                                <th>Detalle</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.idRol} className='text-center border-t h-10 hover:bg-gray-100'>
                                    <td className=''>{role.idRol}</td>
                                    <td className='min-w-[150px]'>{role.descripcion}</td>
                                    <td className='text-xs'>{role.detalle}</td>
                                    <td className='text-xs'>
                                        <button onClick={() => handleEdit(role.idRol)} className='hover:scale-110 transition-all duration-200 ease-in-out'>
                                            <BiSolidEdit className='w-5 h-5 text-[#005CA2]/90 hover:text-[#005CA2]' />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='w-full md:w-1/2 text-md'>
                    <h3 className='text-[#005CA2] font-bold text-lg text-center mb-4'>Agregar o modificar rol</h3>
                    <form action="">
                        <div className='grid grid-cols-3 gap-4 lg:grid-cols-4 w-full'>
                            <label htmlFor="" className='text-right pr-4'>ID:</label>
                            <input type="text" className='border-2 rounded-md pl-3 border-[#757873] col-span-2 lg:col-span-3' name='idRol' value={rolForm.idRol} onChange={e => setRolForm({ ...rolForm, idRol: e.target.value })} disabled/>
                            <label htmlFor="" className='text-right pr-4'>Descripción:</label>
                            <input type="text" className='border-2 rounded-md pl-3 border-[#757873] col-span-2 lg:col-span-3' name='descripcion' value={rolForm.descripcion} onChange={e => setRolForm({ ...rolForm, descripcion: e.target.value })} />
                            <label htmlFor="" className='text-right pr-4'>Detalle:</label>
                            <textarea type="text" className='border-2 rounded-md pl-3 border-[#757873] col-span-2 lg:col-span-3' name='detalle' value={rolForm.detalle} onChange={e => setRolForm({ ...rolForm, detalle: e.target.value })} />
                        </div>
                        <div className='w-full flex justify-center md:justify-end my-4 gap-2'>
                            <button type="button" className='bg-[#000] text-white px-6 py-2 rounded-md hover:bg-[#004080] transition-all duration-200 ease-in-out' onClick={handleClear}>Limpiar</button>
                            <button type="button" className='bg-[#005CA2]/90 text-white px-6 py-2 rounded-md hover:bg-[#004080] transition-all duration-200 ease-in-out' onClick={handleSubmit}>Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Roles