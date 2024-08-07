import { createContext, useState } from "react";

export const ContextConfig = createContext();

export const ContextProvider = ({ children }) => {

    const [login, setLogin] = useState(sessionStorage.getItem('login') ? true : false);

    const handleLogin = () => {
        if(sessionStorage.getItem('login')){
            setLogin(true);
        }else{
            setLogin(false);
        }
    };

    return (
        <ContextConfig.Provider value={{login, handleLogin}}>
            {children}
        </ContextConfig.Provider>
    );
};