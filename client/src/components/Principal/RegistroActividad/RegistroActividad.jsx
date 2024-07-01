import { useContext, useEffect, useState } from 'react'
import './RegistroActividad.css'
import { LoginContext } from '../../../context/LoginContext'
import { useFetch } from '../../../hooks/useFetch'
import { Outlet, useNavigate } from 'react-router-dom'

export default function RegistroActividad () {

    const loginContext = useContext(LoginContext)
    let [ dataUsuario ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador/' : 'camping/'}id/${loginContext[0][0]}`)

    const navigate = useNavigate()

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
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
        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancias/id_camping/${loginContext[0][1] === 0 ? dataUsuario?.results.id_camping : loginContext[0][0]}/filtros/fecha/${fecha}/estado/${estado}`)
        const data = await response.json()

        if (data.status != 'error') {
            setEstanciasFiltradas(data?.results)
            setLoading(false)
        }
    }

    useEffect(() => {
        aplicarFiltros()
    }, [])

    return(
        <div className="registro_actividad">
            <div className="registro_actividad__filtros">
                <section>
                    <div className="filtros__fecha">
                        <label htmlFor="filtrosFecha">fecha:</label>
                        <input type="date" name="filtrosFecha" id="filtrosFecha" value={fecha} onChange={e => setFecha(e.target.value)} />
                    </div>
                    <div className="filtros__estado">
                        <label htmlFor="filtrosEstado">estado:</label>
                        <select name="filtrosEstado" id="filtrosEstado" onChange={e => setEstado(e.target.value)}>
                            <option value="todos" selected>todos</option>
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
                            estanciasFiltradas.map(estancia => {
                                return <EstanciaRegistro {...estancia} handlerEstancia={() => navigate(`/principal/registro-actividad/${estancia.estancia_accion._id}`)} />
                            })
                        ) : (
                            <div className="registro_actividad__estancias__vacias">
                                <p>NO HAY REGISTROS PARA LOS FILTROS IMPUESTOS</p>
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

function EstanciaRegistro ({ estancia, estancia_accion, handlerEstancia }) {

    let [ dataUsuario ] = useFetch(`${import.meta.env.VITE_API_HOST}${estancia_accion.tipo_usuario}/id/${estancia_accion.id_usuario}`)

    return (
            <div className="estancia_registro" onClick={handlerEstancia}>
                <div className="estancia_registro__imagen">
                    <img title={dataUsuario?.results.usuario} src={`${import.meta.env.VITE_API_HOST}static/${dataUsuario?.results.imagen}`} alt="IMAGEN-USUARIO" />
                </div>
                <div className="estancia_registro__informacion">
                    <div>
                        <i className="fa-solid fa-user"></i>
                        <p>{estancia.nombre}</p>
                    </div>
                    <div className="estancia_registro__informacion__raya"></div>
                    <div>
                        <i className="fa-solid fa-phone"></i>
                        <p>{estancia.telefono || '-'}</p>
                    </div>
                    <div className="estancia_registro__informacion__raya"></div>
                    <div>
                        <i className="fa-solid fa-calendar-days"></i>
                        <p>{estancia.fecha_inicio.replaceAll('-', '/')} - {estancia.fecha_fin.replaceAll('-', '/')}</p>
                    </div>
                </div>
                <div className={`estancia_registro__estado ${estancia_accion.estado === 'reserva' ? 'estancia_registro__estado__reserva' : estancia_accion.estado === 'entrada' ? 'estancia_registro__estado__entrada' : 'estancia_registro__estado__salida'}`}></div>
            </div>
    )
}