import { createContext } from "react";

const ContextConfig = createContext();

export const ContextProvider = ({ children }) => {
    return (
        <ContextConfig.Provider value={{}}>
            {children}
        </ContextConfig.Provider>
    );
};