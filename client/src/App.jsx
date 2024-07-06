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
import Estancia, { loader as estanciaLoader } from './components/Principal/Estancia/Estancia'
import Reservas from './components/Principal/Reservas/Reservas'
import Entradas, { EntradasRealizadas, ReservasSinLlegar } from './components/Principal/Hoy/Entradas/Entradas'
import Salidas, { SalidasRealizadas, SalidasSinRealizar } from './components/Principal/Hoy/Salidas/Salidas'
import Estado from './components/Principal/Estado/Estado'

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
        path: '/principal/camping/estado',
        element: <Estado />,
        children: [
          {
            path: '/principal/camping/estado/:id_estancia_accion',
            element: <Estancia />,
            loader: estanciaLoader
          }
        ]
      },
      {
        path: '/principal/camping/calendario',
        element: <h1>Calendario Camping</h1>
      },
      {
        path: '/principal/parcelas',
        element: <Parcelas />,
        children: [
          {
            path: '/principal/parcelas/:id_parcela/formulario-reserva',
            element: <FormularioReservas reserva={true} selectVisible={false} />
          },
          {
            path: '/principal/parcelas/:id_estancia_accion',
            element: <Estancia />,
            loader: estanciaLoader
          }
        ]
      },
      {
        path: '/principal/registro-actividad',
        element: <RegistroActividad />,
        children: [
          {
            path:'/principal/registro-actividad/:id_estancia_accion',
            element: <Estancia />,
            loader: estanciaLoader
          }
        ]
      },
      {
        path: '/principal/reservas',
        element: <Reservas />,
        children: [
          {
            path: '/principal/reservas/:id_estancia_accion',
            element: <Estancia />,
            loader: estanciaLoader
          },
          {
            path: '/principal/reservas/crear-reserva',
            element: <FormularioReservas reserva={true} selectVisible={true} />
          }
        ]
      },
      {
        path: '/principal/entradas',
        element: <Entradas />,
        children: [
          {
            path: '/principal/entradas/reservas-sin-llegar',
            element: <ReservasSinLlegar />,
            children: [
              {
                path: '/principal/entradas/reservas-sin-llegar/:id_estancia_accion',
                element: <Estancia />,
                loader: estanciaLoader
              }
            ]
          },
          {
            path: '/principal/entradas/entradas',
            element: <EntradasRealizadas />,
            children: [
              {
                path: '/principal/entradas/entradas:id_estancia_accion',
                element: <Estancia />,
                loader: estanciaLoader
              },
              {
                path: '/principal/entradas/entradas/crear-entrada',
                element: <FormularioReservas reserva={false} selectVisible={true} />
              }
            ]
          }
        ]
      },
      {
        path: '/principal/salidas',
        element: <Salidas />,
        children: [
          {
            path: '/principal/salidas/salidas-sin-realizar',
            element: <SalidasSinRealizar />,
            children: [
              {
                path: '/principal/salidas/salidas-sin-realizar:id_estancia_accion',
                element: <Estancia />,
                loader: estanciaLoader
              }
            ]
          },
          {
            path: '/principal/salidas/salidas',
            element: <SalidasRealizadas />,
            children: [
              {
                path: '/principal/salidas/salidas:id_estancia_accion',
                element: <Estancia />,
                loader: estanciaLoader
              }
            ]
          }
        ]
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

  const usuario_session = sessionStorage.getItem("usuario")
  const [ user, setUser ] = useState(usuario_session ? [ usuario_session.split(',')[0], parseInt(usuario_session.split(',')[1]) ] : null) // user = [ _id, tipo (0->acomodador // 1->camping) ]

  return (
    <LoginContext.Provider value={[user, setUser]}> 
      <RouterProvider router={router} />
    </LoginContext.Provider>
  )
}

export default App
