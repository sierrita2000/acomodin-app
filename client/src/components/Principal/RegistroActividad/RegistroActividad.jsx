import { useContext, useEffect, useState } from 'react'
import './RegistroActividad.css'
import { LoginContext } from '../../../context/LoginContext'
import { useFetch } from '../../../hooks/useFetch'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import EstanciaSimple from '../Estancia/EstanciaSimple/EstanciaSimple'

export default function RegistroActividad () {

    const loginContext = useContext(LoginContext)
    let [ dataUsuario ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador/' : 'camping/'}id/${loginContext[0][0]}`)

    const navigate = useNavigate()
    const location = useLocation()

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() < 10) ? '0' : ''}${fecha.getDate()}`
    }

    const [ fecha, setFecha ] = useState(formatearFecha(new Date()))
    const [ estado, setEstado ] = useState('todos')
    const [ estanciasFiltradas, setEstanciasFiltradas ] = useState(null)

    const [ loading, setLoading ] = useState(false)

    /**
     * Realiza una busqueda de las estancias con los filtros seleccionados
     */
    const aplicarFiltros = async () => {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancias/id_camping/${loginContext[0][1] === 0 ? dataUsuario?.results.id_camping : loginContext[0][0]}/filtros/fecha/${fecha || 'null'}/estado/${estado}`)
        const data = await response.json()

        if (data.status != 'error') {
            setEstanciasFiltradas(data?.results)
            setLoading(false)
        }
    }

    useEffect(() => {
        dataUsuario?.results && aplicarFiltros()
    }, [location, dataUsuario])

    return(
        <div className="registro_actividad">
            <div className="registro_actividad__filtros">
                <section>
                    <div className="filtros__fecha">
                        <label htmlFor="filtrosFecha">fecha:</label>
                        <input required type="date" name="filtrosFecha" id="filtrosFecha" value={fecha} onChange={e => setFecha(e.target.value)} />
                    </div>
                    <div className="filtros__estado">
                        <label htmlFor="filtrosEstado">estado:</label>
                        <select name="filtrosEstado" id="filtrosEstado" value={estado} onChange={e => setEstado(e.target.value)}>
                            <option value="todos">todos</option>
                            <option value="entrada">entrada</option>
                            <option value="reserva">reserva</option>
                            <option value="salida">salida</option>
                        </select>
                    </div>
                </section>
                <button onClick={aplicarFiltros} className='filtros__boton'>APLICAR FILTROS</button>
            </div>
            {
                estanciasFiltradas && (
                    <section className="registro_actividad__leyenda">
                        <div className='estancia_registro__estado__reserva'></div>
                        <p>reserva</p>
                        <div className='estancia_registro__estado__entrada'></div>
                        <p>entrada</p>
                        <div className='estancia_registro__estado__salida'></div>
                        <p>salida</p>
                    </section>
                )
            }
            <div className="registro_actividad__estancias">
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
                        estanciasFiltradas ? (
                            estanciasFiltradas.sort((a, b) => {
                                const id_zona_A = a.estancia.parcela ? a.estancia.parcela.toUpperCase() : '-'
                                const id_zona_B = b.estancia.parcela ? b.estancia.parcela.toUpperCase() : '-'
    
                                if(id_zona_A < id_zona_B) return -1
                                if(id_zona_A > id_zona_B) return 1
                                else return 0
                            }).map(estancia => {
                                return <EstanciaSimple {...estancia} handlerEstancia={() => navigate(`/principal/registro-actividad/${estancia.estancia_accion._id}`)} />
                            })
                        ) : (
                            <div className="registro_actividad__estancias__vacias">
                                <p>NO HAY REGISTROS PARA LOS FILTROS IMPUESTOS</p>
                                <img src="/figura-hoguera.png" alt="FIGURA-HOOGUERA" />
                            </div>
                        )
                    )
                }
            </div>
            <Outlet />
        </div>
    )
}