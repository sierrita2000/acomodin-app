import { useContext } from 'react'
import './Principal.css'
import { LoginContext } from '../../context/LoginContext'
import { useFetch } from '../../hooks/useFetch'

export default function Principal () {

    const loginContext = useContext(LoginContext)

    const [ data, error, loading ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador': 'camping'}/id/${loginContext[0][0]}`)

    return(
        <div className="principal">
            <p>Hola {data?.results.nombre}</p>
        </div>
    )
}