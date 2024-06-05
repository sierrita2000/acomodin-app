import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Inicio from './pages/Inicio/Inicio'
import Login from './pages/Login/Login'
import Registro from './pages/Registro/Registro'
import Error from './pages/Error/Error'
import Completado from './components/Registro/PantallaCompletado/Completado'
import Principal from './pages/Principal/Principal'
import Plantilla from './pages/PlantillaCorreo/PlantillaCorreo'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Inicio />,
    errorElement: <Error />
  },
  {
    path:'/login',
    element: <Login />
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
    path: '/acomodador/:nombre_camping/:id_acomodador',
    element: <Principal />
  },
  {
    path: '/admin/:nombre_camping',
    element: <Principal />
  },
  {
    path: '/plantilla',
    element: <Plantilla />
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
