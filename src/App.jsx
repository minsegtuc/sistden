import React from 'react'
import Usuarios from './pages/Usuarios'
import Nav from './components/Nav'
import NuevoUsuario from './pages/NuevoUsaurio'

const App = () => {
  return (
    <div>
      <Nav />
      {/* <Usuarios /> */}
      <NuevoUsuario />
    </div>
  )
}

export default App