import { createContext, useState } from "react";

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

    const handleUser = (user) => {
        const userAux = {...user};

        fetch(`http://localhost:3000/api/rol/rol/${user.rol}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                userAux.rol = data.descripcion;
            })
            .catch(err => console.log(err));

        setUser(userAux);
    };

    return (
        <ContextConfig.Provider value={{login, handleLogin, handleUser, user, setLogin, handleSession}}>
            {children}
        </ContextConfig.Provider>
    );
};