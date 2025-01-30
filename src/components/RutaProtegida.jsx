import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ContextConfig } from '../context/ContextConfig';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const RutaProtegida = () => {
    const { login, handleLogin, handleUser, HOST } = useContext(ContextConfig);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("Ruta Protegida");
        fetch(`${HOST}/api/verifyToken`, {
            method: 'GET',
            credentials: 'include'
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error('Usuario no autenticado');
            }
        })
            .then(data => {
                const token = Cookies.get('auth_token');
                const decoded = jwtDecode(token);

                const user = {
                    nombre: decoded.nombre,
                    apellido: decoded.apellido,
                    rol: decoded.rol,
                    foto: decoded.foto,
                    message: data.message
                }
                handleLogin();
                handleUser(user);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);  
            });
    }, []);

    if (isLoading) return '';

    return login ? <Outlet /> : <Navigate to="/sgd/login" />;
};

export default RutaProtegida;