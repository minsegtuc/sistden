import { useContext, useEffect } from 'react'
import { useState } from 'react';
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { ContextConfig } from '../context/ContextConfig';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const IniciarSesion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [errorGoogle, setErrorGoogle] = useState(false);
    const [loginGoogle, setLoginGoogle] = useState(false)

    const navigate = useNavigate();

    const { login, handleLogin, handleUser, HOST, HOST_AUTH } = useContext(ContextConfig);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${HOST_AUTH}/auth/usuario/login`, {
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
                console.log("Datos de login: ", data)
                const user = {
                    nombre: data.usuario.nombre,
                    apellido: data.usuario.apellido,
                    rol: data.usuario.rol,
                    message: data.message
                }
                // console.log(user)
                setError(false);
                handleLogin();
                handleUser(user);
            })
            .catch(err => {
                if (err.message.includes('Failed to fetch')) {
                    Swal.fire({
                        title: 'Servidor no disponible',
                        icon: 'info',
                        text: 'El servidor no esta disponible comuniquese con su administrador',
                        confirmButtonText: 'Aceptar'
                    })
                } else {
                    console.log(err)
                }
            });
    };

    useEffect(() => {
        if (login) {
            navigate('/modulos');
        } else {
            navigate('/login');
        }
    }, [login]);

    useEffect(() => {
        window.google?.accounts.id.initialize({
            client_id: "198749693384-7tqgjv5b3s5p0stkgn3rhq9o7s977hut.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });

        window.google?.accounts.id.renderButton(
            document.getElementById("googleButton"),
            { theme: "outline", size: "large" }
        );
    }, []);

    // Bloquear scroll mientras se muestra la pantalla de inicio de sesión
    useEffect(() => {
        const prevBodyOverflow = document?.body?.style?.overflow;
        const prevHtmlOverflow = document?.documentElement?.style?.overflow;
        if (document?.body) {
            document.body.style.overflow = 'hidden';
        }
        if (document?.documentElement) {
            document.documentElement.style.overflow = 'hidden';
        }
        return () => {
            if (document?.body) {
                document.body.style.overflow = prevBodyOverflow || '';
            }
            if (document?.documentElement) {
                document.documentElement.style.overflow = prevHtmlOverflow || '';
            }
        };
    }, []);

    const handleCredentialResponse = (response) => {
        setLoginGoogle(true)
        fetch(`${HOST_AUTH}/auth/usuario/loginConGoogle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                idToken: response.credential
            })
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                setErrorGoogle(true);
                throw new Error('Usuario o contraseña incorrectos');
            }
        }).
            then(data => {
                setLoginGoogle(false)
                const user = {
                    nombre: data.usuario.nombre,
                    apellido: data.usuario.apellido,
                    rol: data.usuario.rol,
                    message: data.message
                }
                setErrorGoogle(false);
                handleLogin();
                handleUser(user);
            })
            .catch(err => {
                if (err.message.includes('Failed to fetch')) {
                    Swal.fire({
                        title: 'Servidor no disponible',
                        icon: 'info',
                        text: 'El servidor no esta disponible comuniquese con su administrador',
                        confirmButtonText: 'Aceptar'
                    })
                } else {
                    console.log(err)
                }
            });
    };

    return (
        <div className='flex h-screen flex-col lg:flex-row overflow-y-hidden'>
            <div className='lg:w-1/2 h-1-6 w-full lg:bg-[#005CA2] flex-row justify-center items-center lg:flex'>
                <h1 className='lg:text-6xl text-3xl lg:text-white text-[#005CA2] font-bold md:w-[90%] text-center p-4'>SISTEMA DE CONTROL DE GESTIÓN</h1>
                {/* <h2 className='lg:text-4xl text-3xl lg:text-white text-[#005CA2] lg:ml-10 hidden lg:flex'>Sistema de Gestión <br />de Denuncias</h2> */}
                {/* <h2 className='lg:text-4xl text-2xl lg:text-white text-[#005CA2] lg:ml-10 lg:hidden text-center'>Sistema de Gestión de Denuncias</h2> */}
            </div>
            <div className='w-full lg:w-1/2 h-5/6 lg:h-auto flex flex-col'>
                <div className='flex-grow h-5/6 flex flex-col items-center justify-center'>
                    <div className='flex flex-col items-center justify-center gap-8 lg:pt-20 pt-14'>
                        <BsPersonCircle className='w-10 h-10 text-[#005CA2] ' />
                        <h2 className='text-xl font-semibold'>Iniciar sesión</h2>
                        <div>
                            <form className='flex flex-col gap-6' onSubmit={(e) => {
                                handleSubmit(e);
                            }}>
                                <input className={`w-72 p-3 rounded-[50px] h-8 border-[1px] text-xs ${error ? 'border-red-500' : 'border-[#757873]'}`} type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <div className={`flex items-center w-72 h-8 p-3 border-[1px] rounded-[50px] ${error ? 'border-red-500' : 'border-[#757873]'}`}>
                                    <input
                                        className="flex-1 text-xs outline-none border-none bg-transparent"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    {showPassword ? <FaRegEye
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-500 cursor-pointer"
                                    /> : <FaRegEyeSlash
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-500 cursor-pointer"
                                    />}
                                </div>
                                {error && <p className='text-red-500'>Usuario o contraseña incorrectos</p>}
                                <button type='submit' className='bg-[#005CA2] rounded-2xl w-72 h-8 text-white font-semibold'>Ingresar</button>
                            </form>
                        </div>
                        <div>
                            <div className="my-1 flex items-center rounded-xl w-72">
                                <hr className="flex grow" />
                                <span className="px-2 text-xs">o usa una cuenta de Google</span>
                                <hr className="flex grow" />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-2 lg:pt-4 lg:pb-20 pt-2 pb-16'>                        
                        <div className="text-center justify-center w-72 text-xs flex items-center">
                            <div id="googleButton" className="rounded-2xl text-xs"></div>
                        </div>
                        {
                            loginGoogle ?
                                <p className='text-md animate-pulse'>Ingresando con Google...</p>
                                : ''
                        }
                    </div>
                    {/*  */}
                </div>
                <div className='flex-grow h-1/6 flex items-center justify-center my-4 md:mt-0'>
                    <img src="/Minseg_color.png" alt="" className='w-60' />
                </div>
            </div>
        </div>
    )
}

export default IniciarSesion