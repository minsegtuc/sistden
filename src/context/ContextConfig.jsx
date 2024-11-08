import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { io } from 'socket.io-client'

export const ContextConfig = createContext();

export const ContextProvider = ({ children }) => {

    const [login, setLogin] = useState();
    const [user, setUser] = useState({});
    const [denuncia, setDenuncia] = useState(null)

    const HOST = 'https://srv555183.hstgr.cloud:3005'
    //http://localhost:3000

    const HOSTWS = process.env.NODE_ENV === 'production'
        ? 'wss://srv555183.hstgr.cloud:3005' // URL en producción con WebSocket seguro
        : 'ws://localhost:3005';

    const socket = io(HOSTWS, {
        withCredentials: true,
        autoConnect: false,
    });

    const handleLogin = () => {
        setLogin(true);
    };

    const handleSession = () => {
        setLogin(false);
        setUser({});
    }

    const handleDenuncia = (denuncia) => {
        const denunciaBuscar = encodeURIComponent(denuncia);
        setDenuncia(denunciaBuscar)
    }

    const handleUser = async (user) => {
        const userAux = { ...user };

        try {
            const response = await fetch(`${HOST}/api/rol/rol/${user.rol}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                userAux.rol = data.descripcion;
                setUser(userAux); // Actualiza el estado después de obtener los datos
            } else {
                console.error("Error al obtener el rol:", response.statusText);
            }
        } catch (err) {
            console.error("Error de red:", err);
        }
    };

    return (
        <ContextConfig.Provider value={{ login, handleLogin, handleUser, user, setLogin, handleSession, HOST, handleDenuncia, denuncia, socket }}>
            {children}
        </ContextConfig.Provider>
    );
};