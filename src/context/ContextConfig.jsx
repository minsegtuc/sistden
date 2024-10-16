import { createContext, useEffect, useState } from "react";

export const ContextConfig = createContext();

export const ContextProvider = ({ children }) => {

    const [login, setLogin] = useState();
    const [user, setUser] = useState({});

    const handleLogin = () => {
        setLogin(true);
    };

    const handleSession = () => {
        setLogin(false);
        setUser({});
    }

    const handleUser = async (user) => {
        const userAux = { ...user };

        try {
            const response = await fetch(`httpss://srv555183.hstgr.cloud:3005/api/rol/rol/${user.rol}`, {
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
        <ContextConfig.Provider value={{login, handleLogin, handleUser, user, setLogin, handleSession}}>
            {children}
        </ContextConfig.Provider>
    );
};