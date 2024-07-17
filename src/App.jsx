import React from 'react'
import Usuarios from './pages/Usuarios'
import Nav from './components/Nav'
import NuevoUsuario from './pages/NuevoUsuario'
import ModificarUsuario from './pages/ModificarUsuario'
import CargarDenuncia from './pages/CargarDenuncia'
import Aside from './components/Aside'

const App = () => {
  return (
    <div className='w-full h-full'>
      <Nav />
      <div className='flex flex-row'>
        <Aside />
        <CargarDenuncia />
        {/* <ModificarUsuario /> */}
        {/* <Usuarios /> */}
        {/* <NuevoUsuario /> */}
      </div>
    </div>
  )
}

export default App