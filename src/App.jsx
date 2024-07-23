import React from 'react'
import IniciarSesion from './pages/IniciarSesion'
import Inicio from './pages/Inicio'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import { ContextProvider } from './context/ContextConfig'

const App = () => {
  return (
    <div>
      <ContextProvider>
        <Routes>
          <Route path={'/'} element={<IniciarSesion />} />
          <Route path={'/home'} element={<Home />}>
            <Route path={'inicio'} element={<Inicio />} />
          </Route>
        </Routes>
      </ContextProvider>
    </div>
  )
}

export default App