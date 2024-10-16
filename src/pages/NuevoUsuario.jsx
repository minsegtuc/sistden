import React, { useEffect, useState, useContext } from 'react'
import Form from '../components/Form'
import { NavLink } from 'react-router-dom'
import { ContextConfig } from '../context/ContextConfig'
import Swal from 'sweetalert2'

const NuevoUsuario = () => {

    const { handleSession } = useContext(ContextConfig)

    const [form, setForm] = useState({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        puesto: '',
        contraseña: '',
        rolId: '',
        userFoto: ''
    })

    const handleChange = (e) => {
        if ([e.target.name] == 'dni' || [e.target.name] == 'rolId') {
            setForm({
                ...form,
                [e.target.name]: parseInt(e.target.value)
            })
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleNewUser = () => {
        fetch('https://srv555183.hstgr.cloud:3005/api/usuario/user', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(form)
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 500) {
                        return res.json().then(errorData => {
                            throw new Error(errorData.detail[0].message || "Error al crear el usuario")
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
                } else {
                    Swal.fire({
                        title: 'Usuario creado',
                        icon: 'info',
                        text: 'El usuario fue creado con exito'
                    })
                    setForm({
                        dni: '',
                        nombre: '',
                        apellido: '',
                        email: '',
                        telefono: '',
                        puesto: '',
                        contraseña: '',
                        rolId: '',
                        userFoto: ''
                    })
                }
            })
            .catch(err => {
                if (err.message === "PRIMARY must be unique") {
                    Swal.fire({
                        title: 'Usuario existente',
                        text: 'El usuario ya existe',
                        icon: 'info'
                    })
                    setForm({
                        dni: '',
                        nombre: '',
                        apellido: '',
                        email: '',
                        telefono: '',
                        puesto: '',
                        contraseña: '',
                        rolId: '',
                        userFoto: ''
                    })
                } else if (err.message === "email must be unique") {
                    Swal.fire({
                        title: 'Correo existente',
                        text: 'El correo electronico ya existe',
                        icon: 'info'
                    })
                    setForm({
                        dni: '',
                        nombre: '',
                        apellido: '',
                        email: '',
                        telefono: '',
                        puesto: '',
                        contraseña: '',
                        rolId: '',
                        userFoto: ''
                    })
                }
            })
    }

    return (
        <div className='px-6 pt-8 lg:h-heightfull'>
            <h2 className='text-[#345071] font-bold text-2xl lg:text-left text-center'>Nuevo usuario</h2>
            <Form handleChange={handleChange} form={form} tipo="new"/>
            <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-32 mt-8 lg:gap-0 gap-4 pb-4'>
                <NavLink to={'/usuarios'} className='text-center py-2 bg-[#757873] text-white rounded-3xl w-40'>Cancelar</NavLink>
                <button className='py-2 bg-[#345071] text-white rounded-3xl w-40' onClick={handleNewUser}>Crear usuario</button>
            </div>
        </div>
    )
}

export default NuevoUsuario