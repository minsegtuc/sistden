import { Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ContextConfig } from '../context/ContextConfig';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const RutaProtegida = ({ element: Component, ...rest }) => {
    const { login, handleLogin, handleUser } = useContext(ContextConfig);

    useEffect(() => {
        fetch('http://localhost:3000/api/verifyToken', {
            method: 'GET',
            credentials: 'include'
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error('Usuario no autenticado');
            }
        }).
        then(data => {
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
        });
    }, [])

    return login ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default RutaProtegida;
