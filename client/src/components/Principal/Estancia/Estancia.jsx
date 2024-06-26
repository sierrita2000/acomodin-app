import { useFetch } from '../../../hooks/useFetch'
import './Estancia.css'

export default function Estancia ({ id }) {

    const [ dataEstancia, errorEstancia, loadingEstancia ] = useFetch(`${import.meta.env.VITE_API_HOST}estancia/id/${id}`)

    return(
        <div className="estancia">
            <p>{dataEstancia?.results.estancia.nombre}</p>
        </div>
    )
}