import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import './Entradas.css'
import { LoginContext } from '../../../../context/LoginContext'
import { useFetch } from '../../../../hooks/useFetch'
import { useContext, useEffect, useState } from 'react'
import ListadoEstancias from '../ListadoEstancias'

export default function Entradas () {

    return(
        <div className="entradas">
            <section className="entradas__menu">
                <NavLink to='/principal/entradas/reservas-sin-llegar' className={({ isActive, isPending }) =>
                    isPending ? "entradas__menu__links" : isActive ? "entradas__menu__links active" : "entradas__menu__links"}>RESERVAS SIN LLEGAR</NavLink>
                <NavLink to='/principal/entradas/entradas'className={({ isActive, isPending }) =>
                    isPending ? "entradas__menu__links" : isActive ? "entradas__menu__links active" : "entradas__menu__links"}>ENTRADAS</NavLink>
            </section>
            <section className="entradas__outlet">
                <Outlet />
            </section>
        </div>
    )
} 

export function ReservasSinLlegar () {

    const loginContext = useContext(LoginContext)
    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)

    const location = useLocation()

    const [ reservas, setReservas ] = useState(new Array())
    const [ loading, setLoading ] = useState(true)

    const [ busqueda, setBusqueda ] = useState('')

    /**
     * Devuelve las reservas para hoy con un posible filtro de búsqueda.
     */
    const filtrarReservasPorBusqueda = () => {
        if(busqueda) {
            setReservas(reservas.filter(reserva => reserva.estancia.nombre.includes(busqueda) || reserva.estancia.telefono.includes(busqueda)))
        } else {
            setLoading(true)
    
            fetch(`${import.meta.env.VITE_API_HOST}estancias/devolver-reservas-hoy-sin-llegar/id_camping/${dataCamping?.results._id}`)
                .then(response => response.json())
                .then(data => setReservas(data.results.slice()))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() => {
        if(dataCamping) {
            filtrarReservasPorBusqueda()
        }
    }, [dataCamping, location])

    return(
        <div className="entradas__reservas_sin_llegar">
            {
                reservas.length > 0 && 
                    (
                        <form className="entradas__reservas_sin_llegar__buscador">
                            <input type="text" name="buscador" id="buscador" placeholder='nombre/telefono de la reserva' value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                            <button type='sumbit' onClick={e => { e.preventDefault(); filtrarReservasPorBusqueda() }}><i className="fa-solid fa-magnifying-glass"></i></button>
                        </form>
                    )
            }
            <ListadoEstancias estancias={reservas} loading={loading} texto_estancias_vacias={'NO HAY RESERVAS PENDIENTES PARA HOY'} url={`/principal/entradas/reservas-sin-llegar/`} />
        </div>
    )
}

export function EntradasRealizadas () {

    const navigate = useNavigate()

    const loginContext = useContext(LoginContext)
    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)

    const location = useLocation()

    const [ entradas, setEntradas ] = useState(new Array())
    const [ loading, setLoading ] = useState(true)

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
    }

    useEffect(() => {
        if(dataCamping) {
            setLoading(true)

            fetch(`${import.meta.env.VITE_API_HOST}estancias/devolver-estancias-filtros/id_camping/${dataCamping?.results._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filtros: { fecha_inicio: formatearFecha(new Date()) },
                    estado: 'entrada'
                })
            })
                .then(response => response.json())
                .then(data => setEntradas(data.results))
                .finally(() => setLoading(false))
        }
    }, [dataCamping, location])

    return(
        <div className="entradas__entradas__realizadas">
            <section className="entradas__entradas__realizadas__boton_add_entrada">
                <img src="../../../../../figura-tienda-cesped.png" alt="FIGURA-TIENDA" />
                <button onClick={() => navigate('/principal/entradas/entradas/crear-entrada')}>AÑADIR ENTRADA</button>
                <img src="../../../../../figura-caravana-cesped.png" alt="FIGURA-TIENDA" />
            </section>
            <ListadoEstancias estancias={entradas} loading={loading} texto_estancias_vacias={'NO SE HAN REGISTRADO ENTRADAS PARA HOY TODAVÍA'} url={`/principal/entradas/entradas/`} />
        </div>
    )
}