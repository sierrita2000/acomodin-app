import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Inicio from './pages/Inicio/Inicio'
import Login from './pages/Login/Login'
import Registro from './pages/Registro/Registro'
import Error from './pages/Error/Error'
import Completado from './components/Registro/PantallaCompletado/Completado'

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
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
