import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { ContextConfig } from '../context/ContextConfig';

const RutaProtegida = ({ element: Component, ...rest }) => {
    const { login } = useContext(ContextConfig);

    return login ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default RutaProtegida;
