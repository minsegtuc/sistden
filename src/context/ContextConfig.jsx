import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { io } from 'socket.io-client'
import { useLocation } from "react-router-dom";

export const ContextConfig = createContext();

export const ContextProvider = ({ children }) => {

    const [login, setLogin] = useState();
    const [user, setUser] = useState({});
    const [denuncia, setDenuncia] = useState(null)
    const [regional, setRegional] = useState(null)
    const [cookie, setCookie] = useState(null)
    const [relato, setRelato] = useState(null)
    const [propiedad, setPropiedad] = useState(true)
    const [interes, setInteres] = useState(true)
    const [año, setAño] = useState(null)
    const [comisaria, setComisaria] = useState(null)
    const [IA, setIA] = useState(true)
    const [observada, setObservada] = useState(true)
    const [denunciasIds, setDenunciasIds] = useState([])

    const location = useLocation();

    const HOST_SGD = process.env.NODE_ENV === 'production' ? '/sgd-api' : 'http://localhost:3005'
    const HOST_INGRESO = 'production' ? '/ingreso-api' : 'http://localhost:3006'
    const HOST_AUTH = process.env.NODE_ENV === 'production' ? '/auth-api' : 'http://localhost:3008'

    const serverlocal = process.env.NODE_ENV === 'production' ? 'https://control.minsegtuc.gov.ar' : 'http://localhost:5173'

    const getHost = () => {
        if (location.pathname.startsWith("/sgd")) {
            return HOST_SGD
        }
        if (location.pathname.startsWith("/ingreso")) {
            return HOST_INGRESO
        }
        return HOST_SGD
    }

    const HOST = getHost()

    const HOSTWS = process.env.NODE_ENV === 'production'
        ? 'wss://control.minsegtuc.gov.ar/sgd-api'
        : 'ws://localhost:3001';

    const handleDenunciasIds = (denunciasIds) => {
        setDenunciasIds(denunciasIds)
    }

    const handleRegionalGlobal = (regional) => {
        setRegional(regional)
    }

    const handlePropiedadGlobal = (propiedad) => {
        setPropiedad(propiedad)
    }

    const handleInteresGlobal = (interes) => {
        setInteres(interes)
    }

    const handleIAGlobal = (propiedad) => {
        setIA(propiedad)
    }

    const handleObservadaGlobal = (propiedad) => {
        setObservada(propiedad)
    }

    const handleAñoGlobal = (año) => {
        setAño(año)
    }

    const handleComisariaGlobal = (comisaria) => {
        setComisaria(comisaria)
    }

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
        //console.log("Denuncia en context: " , denuncia)
        //console.log("Ingreso a handleDenuncia: " , denuncia)
        const denunciaBuscar = encodeURIComponent(denuncia);
        setDenuncia(denunciaBuscar)
        sessionStorage.setItem('denunciaCookie', denunciaBuscar)
    }

    const handleUser = async (user) => {
        console.log("User en handleUser:", user);
        console.log("Tipo de user.rol:", typeof user.rol);
        const userAux = { ...user };

        try {
            const response = await fetch(`${HOST_AUTH}/auth/rol/${user.rol?.idRol}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("Info rol: ", data)
                userAux.rol = data.descripcion;
                setUser(userAux);
            } else {
                console.error("Error al obtener el rol:", response.statusText);
            }
        } catch (err) {
            console.error("Error de red:", err);
        }
    };

    useEffect(() => {
        console.log(HOST)
    }, [HOST])

    return (
        <ContextConfig.Provider value={{ IA, observada, serverlocal, login, handleLogin, handleUser, user, setLogin, handleSession, HOST, HOST_AUTH, handleDenuncia, denuncia, socket, handleRegionalGlobal, regional, cookie, setCookie, relato, setRelato, propiedad, interes, handleInteresGlobal, handlePropiedadGlobal, handleAñoGlobal, handleIAGlobal, handleObservadaGlobal, año, handleComisariaGlobal, comisaria, denunciasIds, handleDenunciasIds }}>
            {children}
        </ContextConfig.Provider>
    );
};