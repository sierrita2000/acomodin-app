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
import Perfil from './components/Principal/Perfil/Perfil'
import PanelEdicion from './components/Principal/Perfil/PanelEdicion/PanelEdicion'
import PanelPassword from './components/Principal/Perfil/PanelPassword/PanelPassword'
import Parcelas from './components/Principal/Parcelas/Parcelas'
import MiCamping from './components/Principal/MiCamping/MiCamping'
import FormularioReservas from './components/Principal/FormularioReservas/FormularioReservas'
import RegistroActividad from './components/Principal/RegistroActividad/RegistroActividad'

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
    errorElement: <Error primerNumero={4} segundoNumero={1} mensaje={"¡No puedes acceder a esta página sin autorización!"} ruta={"/login"} textoBoton={"INICIAR SESIÓN"} />,
    children: [
      {
        path: '/principal/calendario-reservas',
        element: <h1>Calendario reservas</h1>
      },
      {
        path: '/principal/parcelas',
        element: <Parcelas />,
        children: [
          {
            path: '/principal/parcelas/:id_parcela/formulario-reserva',
            element: <FormularioReservas reserva={true} />
          }
        ]
      },
      {
        path: '/principal/registro-actividad',
        element: <RegistroActividad />
      },
      {
        path: '/principal/entradas',
        element: <h1>Entradas</h1>
      },
      {
        path: '/principal/salidas',
        element: <h1>Salidas</h1>
      },
      {
        path: '/principal/perfil',
        element: <Perfil />,
        children: [
          {
            path: '/principal/perfil/editar/',
            element: <PanelEdicion />
          },
          {
            path: '/principal/perfil/cambiar-contraseña',
            element: <PanelPassword />
          }
        ]
      },
      {
        path: '/principal/mi-camping',
        element: <MiCamping />
      }
    ]
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
