import { useContext, useEffect } from 'react'
import { useState } from 'react';
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { ContextConfig } from '../context/ContextConfig';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const IniciarSesion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const { login, handleLogin, handleUser, HOST } = useContext(ContextConfig);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${HOST}/api/usuario/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                contraseña: password
            })
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                setError(true);
                throw new Error('Usuario o contraseña incorrectos');
            }
        }).
            then(data => {
                const token = data.token;
                const decoded = jwtDecode(token);

                const user = {
                    nombre: decoded.nombre,
                    apellido: decoded.apellido,
                    rol: decoded.rol,
                    foto: decoded.foto,
                    message: data.message
                }
                setError(false);
                handleLogin();
                handleUser(user);
            })
            .catch(err => {
                if(err.message.includes('Failed to fetch')){
                    Swal.fire({
                        title: 'Servidor no disponible',
                        icon: 'info',
                        text: 'El servidor no esta disponible comuniquese con su administrador',
                        confirmButtonText: 'Aceptar'
                    })
                }else{
                    console.log(err)
                }
            });
    };

    useEffect(() => {
        if (login) {
            navigate('/sigs/');
        } else {
            navigate('/sigs/login');
        }
    }, [login]);

    return (
        <div className='flex h-screen flex-col lg:flex-row'>
            <div className='lg:w-1/2 w-full lg:bg-[#005CA2] flex-col justify-center items-center lg:flex'>
                <div className='flex flex-col justify-center items-center lg:items-start'>
                    <h1 className='lg:text-6xl text-5xl lg:text-white text-[#005CA2] font-bold lg:ml-10 lg:mb-5 mt-8'>SGD</h1>
                    <h2 className='lg:text-4xl text-3xl lg:text-white text-[#005CA2] lg:ml-10 hidden lg:flex'>Sistema de Gestión <br />de Denuncias</h2>
                    <h2 className='lg:text-4xl text-2xl lg:text-white text-[#005CA2] lg:ml-10 lg:hidden text-center'>Sistema de Gestión de Denuncias</h2>
                </div>
            </div>
            <div className='w-full lg:w-1/2 h-5/6 lg:h-auto flex flex-col'>
                <div className='flex-grow h-5/6 flex items-center justify-center'>
                    <div className='flex flex-col items-center justify-center gap-8 lg:pt-20 lg:pb-20 pt-16 pb-16'>
                        <BsPersonCircle className='w-14 h-14 text-[#005CA2] ' />
                        <h2 className='text-2xl font-semibold'>Iniciar sesión</h2>
                        <div>
                            <form action="" className='flex flex-col gap-6'>
                                <input className={`w-72 p-3 rounded border-2 ${error ? 'border-red-500' : 'border-[#757873]'}`} type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <input className={`w-72 p-3 rounded border-2 ${error ? 'border-red-500' : 'border-[#757873]'}`} type="password" placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} required />
                                {error && <p className='text-red-500'>Usuario o contraseña incorrectos</p>}
                            </form>
                        </div>
                        <button className='bg-[#005CA2] rounded w-72 p-2 text-white font-semibold' onClick={handleSubmit}>Ingresar</button>
                    </div>
                </div>
                <div className='flex-grow h-1/6 flex items-center justify-center'>
                    <img src="/sigs/Minseg_color.png" alt="" className='w-60' />
                </div>
            </div>
        </div>
    )
}

export default IniciarSesion