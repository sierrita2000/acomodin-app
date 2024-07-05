import { useContext, useEffect, useState } from 'react'
import './Reservas.css'
import { useFetch } from '../../../hooks/useFetch'
import { LoginContext } from '../../../context/LoginContext'
import EstanciaSimple from '../Estancia/EstanciaSimple/EstanciaSimple'
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom'

export default function Reservas () {

    const navigate = useNavigate()
    let location = useLocation()

    const loginContext = useContext(LoginContext)
    let [ dataUsuario ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador/' : 'camping/'}id/${loginContext[0][0]}`)

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
    }

    const [ nombre, setNombre ] = useState('')
    const [ telefono, setTelefono ] = useState('')
    const [ fechaInicio, setFechaInicio ] = useState(formatearFecha(new Date())) // Por defecto se pone la fecha de hoy
    const [ parcela, setParcela ] = useState("0")

    const [ reservas, setReservas ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    let [ dataParcelaCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}parcelas/devolver-parcelas/id_camping/${loginContext[0][1] === 0 ? dataUsuario?.results.id_camping : loginContext[0][0]}`)
    
    /**
     * Realiza una busqueda de las reservas con los filtros seleccionados
     * @param {Event} e
     */
    const aplicarFiltros = async (e) => {
        e && e.preventDefault()

        const filtros = new Object()
        const estado = 'reserva'

        if(nombre) filtros.nombre = nombre
        if(telefono) filtros.telefono = telefono
        if(fechaInicio) filtros.fecha_inicio = fechaInicio
        if(parcela != "0") filtros.parcela = (parcela === 'sin_parcela') ? null : parcela

        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancias/devolver-estancias-filtros/id_camping/${loginContext[0][1] === 0 ? dataUsuario?.results.id_camping : loginContext[0][0]}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filtros, estado })
        })
        const data = await response.json()

        if (data.status != 'error') {
            setReservas(data?.results)
            setLoading(false)
        }
    }

    useEffect(() => {
        aplicarFiltros(null)
    }, [location])

    return(
        <div className="reservas">
            <section className='reservas__boton_add_reserva'>
                <img src="../../../../../figura-tienda-cesped.png" alt="FIGURA-TIENDA" />
                <button onClick={() => navigate('/principal/reservas/crear-reserva')}>AÑADIR RESERVA</button>
                <img src="../../../../../figura-caravana-cesped.png" alt="FIGURA-TIENDA" />
            </section>
            <form className="reservas__filtros">
                <section>
                    <div className="reservas__filtros__filtro">
                        <label htmlFor="reservasFiltroNombre">nombre:</label>
                        <input type="text" name="reservasFiltroNombre" id="reservasFiltroNombre" placeholder='Ejemplo: "María Muñoz"' value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>
                    <div className="reservas__filtros__filtro">
                        <label htmlFor="reservasFiltroTelefono">telefono:</label>
                        <input type="text" name="reservasFiltroTelefono" id="reservasFiltroTelefono" placeholder='Ejemplo: "634829212"' maxLength={9} value={telefono} onChange={e => (new RegExp('^[0-9]+$').test(e.target.value) || e.target.value === '') && setTelefono(e.target.value)} />
                    </div>
                    <div className="reservas__filtros__filtro">
                        <label htmlFor="reservasFiltroFechaInicio">fecha inicio:</label>
                        <input type="date" name="reservasFiltroFechaInicio" id="reservasFiltroFechaInicio" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                    </div>
                    <div className="reservas__filtros__filtro">
                        <label htmlFor="reservasFiltroParcela">parcela:</label>
                        <select name="reservasFiltroParcela" id="reservasFiltroParcela" value={parcela} onChange={e => setParcela(e.target.value)}>
                            <option value="0">-</option>
                            <option value="sin_parcela">SIN PARCELA</option>
                            {
                                dataParcelaCamping?.results.sort((a, b) => {
                                    const id_zona_A = a.nombre.toUpperCase()
                                    const id_zona_B = b.nombre.toUpperCase()

                                    if(id_zona_A < id_zona_B) return -1
                                    if(id_zona_A > id_zona_B) return 1
                                    else return 0
                                }).map(parcela => {
                                    return(
                                        <option value={parcela._id}>{parcela.nombre}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </section>
                <button className='reservas__filtros__boton' type="submit" onClick={e => aplicarFiltros(e)} >APLICAR FILTROS</button>
            </form>
            <div className='reservas__reservas'>
            {
                    loading ? (
                        <div className="dot-spinner">
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div> 
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                        </div>
                    ) : (
                        reservas?.length > 0 ? (
                            reservas.sort((a, b) => {
                                const id_zona_A = a.estancia.parcela ? a.estancia.parcela.toUpperCase() : '-'
                                const id_zona_B = b.estancia.parcela ? b.estancia.parcela.toUpperCase() : '-'
    
                                if(id_zona_A < id_zona_B) return -1
                                if(id_zona_A > id_zona_B) return 1
                                else return 0
                            }).map(reserva => {
                                return <EstanciaSimple {...reserva} handlerEstancia={() => navigate(`/principal/reservas/${reserva.estancia_accion._id}`)} />
                            })
                        ) : (
                            <div className="reservas__reservas__vacias">
                                <p>NO HAY RESERVAS PARA LOS FILTROS IMPUESTOS</p>
                                <img src="../../../../figura-hoguera.png" alt="FIGURA-HOOGUERA" />
                            </div>
                        )
                    )
                }
            </div>
            <Outlet />
        </div>
    )
}