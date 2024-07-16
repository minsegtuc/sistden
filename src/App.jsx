import React from 'react'
import Usuarios from './pages/Usuarios'
import Nav from './components/Nav'
import NuevoUsuario from './pages/NuevoUsuario'
import ModificarUsuario from './pages/ModificarUsuario'

const App = () => {
  return (
    <div className='w-full h-full'>
      <Nav />
      <ModificarUsuario />
      {/* <Usuarios /> */}
      {/* <NuevoUsuario /> */}
    </div>
  )
}

export default App