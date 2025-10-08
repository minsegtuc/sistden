import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ContextConfig } from '../context/ContextConfig';

const RutaProtegida = () => {
    const { login, handleLogin, handleUser, HOST } = useContext(ContextConfig);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetch(`${HOST}/api/verifyToken`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => {
            if (res.status === 200) return res.json();
            throw new Error('Usuario no autenticado');
        })
        .then(data => {
            const user = {
                nombre: data.usuario.nombre,
                apellido: data.usuario.apellido,
                rol: data.usuario.rol,
                message: data.message
            };
            handleLogin();
            handleUser(user);
        })
        .catch(err => console.log(err))
        .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return '';

    // 👇 Si el usuario está logueado y está en la raíz, lo mandamos a /modulos
    if (login && (location.pathname === '/' || location.pathname === '/login')) {
        return <Navigate to="/modulos" replace />;
    }

    return login ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RutaProtegida;
