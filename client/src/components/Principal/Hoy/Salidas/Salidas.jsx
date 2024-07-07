import { NavLink, Outlet } from 'react-router-dom'
import './Salidas.css'
import { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext'
import { useFetch } from '../../../../hooks/useFetch'
import ListadoEstancias from '../ListadoEstancias'

export default function Salidas () {

    return(
        <div className="salidas">
            <section className="salidas__menu">
                <NavLink to='/principal/salidas/salidas-sin-realizar' className={({ isActive, isPending }) =>
                    isPending ? "salidas__menu__links" : isActive ? "salidas__menu__links active" : "salidas__menu__links"}>SALIDAS SIN REALIZAR</NavLink>
                <NavLink to='/principal/salidas/salidas'className={({ isActive, isPending }) =>
                    isPending ? "salidas__menu__links" : isActive ? "salidas__menu__links active" : "salidas__menu__links"}>SALIDAS REALIZADAS</NavLink>
            </section>
            <section className="salidas__outlet">
                <Outlet />
            </section>
        </div>
    )
}

export function SalidasSinRealizar () {

    const loginContext = useContext(LoginContext)
    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)

    const [ entradas, setEntradas ] = useState(new Array())
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        if(dataCamping) {
            setLoading(true)

            fetch(`${import.meta.env.VITE_API_HOST}estancias/devolver-entradas-hoy-sin-salir/id_camping/${dataCamping?.results._id}`)
                .then(response => response.json())
                .then(data => setEntradas(data.results))
                .finally(() => setLoading(false))
        }
    }, [dataCamping])

    return(
        <div className="salidas_sin_realizar">
            <ListadoEstancias estancias={entradas} loading={loading} texto_estancias_vacias={'NO HAY SALIDAS PREVISTAS PARA HOY'} url={`/principal/salidas/salidas-sin-realizar/`} />
        </div>
    )
}

export function SalidasRealizadas () {

    const loginContext = useContext(LoginContext)
    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)

    const [ salidas, setSalidas ] = useState(new Array())
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
                    filtros: { fecha_fin: formatearFecha(new Date()) },
                    estado: 'salida'
                })
            })
                .then(response => response.json())
                .then(data => setSalidas(data.results))
                .finally(() => setLoading(false))
        }
    }, [dataCamping])

    return(
        <div className="salidas_sin_realizar">
            <ListadoEstancias estancias={salidas} loading={loading} texto_estancias_vacias={'NO SE HA REGISTRADO NINGUNA SALIDA TODAVÍA'} url={`/principal/salidas/salidas/`} />
        </div>
    )
}