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
import DenunciaDetalle from './pages/DenunciaDetalle'
import CargarDenunciaCompleta from './pages/CargarDenunciaCompleta'
import Estadisticas from './pages/Estadisticas'

const App = () => {
  return (
    <div>
      <ContextProvider>
        <Routes>
          <Route path={'/sgd/login'} element={<IniciarSesion />} />
          <Route path={'/sgd/'} element={<RutaProtegida />}>
            <Route path={'/sgd/'} element={<Home />}>
              <Route path='/sgd/' element={<Navigate to={'/sgd/inicio'} />} />
              <Route path={'inicio'} element={<Inicio />} />
              <Route path={'usuarios'} element={<Usuarios />} />
              <Route path={'usuarios/nuevo'} element={<NuevoUsuario />} />
              <Route path={'usuarios/modificar/:id'} element={<ModificarUsuario />} />
              <Route path={'denuncias'} element={<Denuncias />} />
              <Route path={'denuncias/listado'} element={<ListadoDenuncias />} />
              <Route path={'denuncias/cargar'} element={<CargarDenuncia />} />
              <Route path={'denuncias/clasificacion'} element={<Clasificacion />} />
              <Route path={'denuncias/descripcion'} element={<DenunciaDetalle />} />
              <Route path={'denuncias/completa'} element={<CargarDenunciaCompleta />} />
              <Route path={'estadisticas'} element={<Estadisticas/>} />
              <Route path={'estadisticas/capital'} element={<Estadisticas/>} />
              <Route path={'estadisticas/norte'} element={<Estadisticas/>} />
              <Route path={'estadisticas/sur'} element={<Estadisticas/>} />
              <Route path={'estadisticas/este'} element={<Estadisticas/>} />
              <Route path={'estadisticasoeste'} element={<Estadisticas/>} />
            </Route>
          </Route>
        </Routes>
      </ContextProvider>
    </div>
  )
}

export default App