import React from 'react'
import IniciarSesion from './pages/IniciarSesion'
import Inicio from './pages/Inicio'
import Home from './pages/Home'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ContextProvider } from './context/ContextConfig'
import Usuarios from './pages/Usuarios'
import NuevoUsuario from './pages/NuevoUsuario'
import ModificarUsuario from './pages/ModificarUsuario'
import Denuncias from './pages/Denuncias'
import CargarDenuncia from './pages/CargarDenuncia'
import Clasificacion from './pages/Clasificacion'
import RutaProtegida from './components/RutaProtegida'
import ListadoDenuncias from './pages/ListadoDenuncias'

const App = () => {
  return (
    <div>
      <ContextProvider>
        <Routes>
          <Route path={'login'} element={<IniciarSesion />} />
          <Route path={'/'} element={<RutaProtegida />}>
            <Route path={'/'} element={<Home />}>
              <Route path='/' element={<Navigate to={'inicio'} />} />
              <Route path={'inicio'} element={<Inicio />} />
              <Route path={'usuarios'} element={<Usuarios />} />
              <Route path={'usuarios/nuevo'} element={<NuevoUsuario />} />
              <Route path={'usuarios/modificar/:id'} element={<ModificarUsuario />} />
              <Route path={'denuncias'} element={<Denuncias />} />
              <Route path={'denuncias/listado'} element={<ListadoDenuncias />} />
              <Route path={'denuncias/cargar'} element={<CargarDenuncia />} />
              <Route path={'denuncias/clasificacion'} element={<Clasificacion />} />
            </Route>
          </Route>
        </Routes>
      </ContextProvider>
    </div>
  )
}

export default App