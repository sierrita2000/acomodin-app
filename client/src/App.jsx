import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Inicio from './pages/Inicio/Inicio'
import Login from './pages/Login/Login'
import Registro from './pages/Registro/Registro'
import Error from './pages/Error/Error404/Error'
import Completado from './components/Registro/PantallaCompletado/Completado'
import Principal from './pages/Principal/Principal'
import { LoginContext } from './context/LoginContext'
import { useState } from 'react'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Inicio />,
    errorElement: <Error primerNumero={4} segundoNumero={4} mensaje={"¡Upsssss! No existe esa ruta"} ruta={"/"} textoBoton={"VOLVER AL INICIO "}  />
  },
  {
    path:'/login',
    element: <Login />,
  },
  {
    path: '/registro-camping',
    element: <Registro />,
    children: [
      {
        path: '/registro-camping/completado',
        element: <Completado />
      }
    ]
  },
  {
    path: '/principal',
    element: <Principal />,
    errorElement: <Error primerNumero={4} segundoNumero={1} mensaje={"¡No puedes acceder a esta página sin autorización!"} ruta={"/login"} textoBoton={"INICIAR SESIÓN"} />
  }
])

function App() {

  const [ user, setUser ] = useState(null) // user = [ _id, tipo (0->acomodador // 1->camping) ]

  return (
    <LoginContext.Provider value={[user, setUser]}> 
      <RouterProvider router={router} />
    </LoginContext.Provider>
  )
}

export default App
