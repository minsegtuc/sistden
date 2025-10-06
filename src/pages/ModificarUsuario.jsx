import { useEffect, useState, useContext } from 'react'
import Form from '../components/Form'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { ContextConfig } from '../context/ContextConfig'

const ModificarUsuario = () => {

    const [form, setForm] = useState({})
    const { id } = useParams()
    const navigate = useNavigate()

    const { handleUser, handleSession, HOST, HOST_AUTH } = useContext(ContextConfig)

    useEffect(() => {
        fetch(`${HOST_AUTH}/auth/usuario/${id}`, {
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
                setForm(
                    {
                        dni: data.dni,
                        nombre: data.nombre,
                        apellido: data.apellido,
                        email: data.email,
                        rolId: data.rolId,
                        contraseña: data.contraseña
                    }
                )
            })
    }, [])

    const handleChange = (e) => {
        if ([e.target.name] == 'dni' || [e.target.name] == 'rol') {
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

    const handleUpdateUser = () => {
        const payload = { ...form };
        
        if (!payload.contraseña || payload.contraseña.trim() === '') {
            delete payload.contraseña;
        }

        fetch(`${HOST_AUTH}/auth/usuario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload)
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
                        title: 'Usuario modificado',
                        icon: 'info',
                        text: 'El usuario fue modificado con exito',
                        confirmButtonText: 'Aceptar'
                    })
                    navigate('/admin/usuarios')
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
                console.log(err)
            })
    }

    return (
        <div className='px-6 pt-8 lg:h-heightfull overflow-scroll'>
            <div className='flex flex-row justify-between'>
                <h2 className='text-[#005CA2] font-bold text-2xl lg:text-left text-center'>Detalles del usuario</h2>
            </div>
            <Form handleChange={handleChange} form={form} tipo="update" />
            <div className='flex flex-col lg:flex-row justify-around items-center lg:mt-8 mt-2 lg:gap-0 gap-4 pb-4'>
                <NavLink to={'/admin/usuarios'} className='text-center py-2 bg-[#757873] text-white rounded-3xl w-40'>Cancelar</NavLink>
                <button className='py-2 bg-[#005CA2] text-white rounded-3xl w-40' onClick={handleUpdateUser}>Guardar Cambios</button>
            </div>
        </div>
    )
}

export default ModificarUsuario