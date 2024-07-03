import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFetch } from '../../../hooks/useFetch'
import './Estancia.css'
import { useState } from 'react'
import Concepto from '../FormularioReservas/Concepto/Concepto'

export const loader = ({ params }) => {
    const id_estancia_accion = params.id_estancia_accion

    return fetch(`${import.meta.env.VITE_API_HOST}estancia-accion/id/${id_estancia_accion}`)
}

export default function Estancia () {

    const { results: estancia } = useLoaderData()

    const [ nombre, setNombre ] = useState(estancia.estancia.nombre || '')
    const [ telefono, setTelefono ] = useState(estancia.estancia.telefono || '-')
    const [ fechaInicio, setFechaInicio ] = useState(estancia.estancia.fecha_inicio || '')
    const [ fechaFin, setFechaFin ] = useState(estancia.estancia.fecha_fin || '')
    const [ conceptos, setConceptos ] = useState(estancia.estancia.conceptos || new Array())
    const [ caracteristicas, setCaracteristicas ] = useState(estancia.estancia.caracteristicas || new Array())
    const [ comentarios, setComentarios ] = useState(estancia.estancia.comentarios || '')

    const navigate = useNavigate()

    let [ dataUsuario ] = useFetch(`${import.meta.env.VITE_API_HOST}${estancia.estancia_accion.tipo_usuario}/id/${estancia.estancia_accion.id_usuario}`)
    let [ dataParcela ] = estancia.estancia.parcela ? useFetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${estancia.estancia.parcela}`) : null
    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
    }

    /**
     * Devuelve la fecha mínima que puede seleccionar el usuario de salida.
     * @returns String
     */
    const fechaMinimaSalida = () => {
        let fecha_minima = new Date(fechaInicio) < new Date() ? new Date() : new Date(fechaInicio)
        fecha_minima.setDate(fecha_minima.getDate() + 1)
        return formatearFecha(fecha_minima)
    }

    return(
        <section className="estancia">
            <button onClick={() => navigate('..', { replace: true })} className='boton_cierre'><i className="fa-solid fa-xmark"></i></button>
            <div className="estancia__estancia">
                <div className="estancia__estancia__acomodador">
                    <img src={`${import.meta.env.VITE_API_HOST}static/${dataUsuario?.results.imagen}`} alt="IMAGEN-USUARIO" />
                    <div>
                        <p>{dataUsuario?.results.nombre} {dataUsuario?.results.apellidos}</p>
                    </div>
                </div>
                <div className="estancia__estancia__informacion">
                    <h2>DATOS RESERVA</h2>
                    <div className="estancia__estancia__informacion__datos">
                        <div>
                            <i className="fa-solid fa-user"></i>
                            <input disabled type="text" name="estanciaNombre" id="estanciaNombre" value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div>
                            <i className="fa-solid fa-phone"></i>
                            <input disabled type="text" name="estanciaTelefono" id="estanciaTelefono" maxLength={9} value={telefono} onChange={e => (new RegExp('^[0-9]+$').test(e.target.value) || e.target.value === '') && setTelefono(e.target.value)} />
                        </div>
                        <div>
                            <i className="fa-solid fa-calendar-days"></i>
                            <input disabled type="date" name="estanciaFechaInicio" id="estanciaFechaInicio" min={formatearFecha(new Date())} value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                            <p className='raya_fechas'>-</p>
                            <input disabled type="date" name="estanciaFechaFin" id="estanciaFechaFin" min={fechaMinimaSalida()} value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                        </div>
                    </div>
                    <h2>CONCEPTOS</h2>
                    <div className="estancia__estancia__informacion__conceptos">
                        {
                            dataConceptos?.results.filter(c => conceptos.map(c => c[0]).includes(c._id)).map((concepto, indice) => {
                                return <Concepto nombre={concepto.nombre} imagen={concepto.imagen} conceptos={conceptos} setConceptos={setConceptos} indice={indice} disabled={true} />
                            })
                        }
                    </div>
                    <section>
                        <section className="estancia__estancia__informacion__caracteristicas">
                            <h2>CARACTERÍSTICAS</h2>
                            <div className="estancia__estancia__informacion__caracteristicas__caracteristicas">
                                {
                                    caracteristicas.length > 0 ?
                                    (
                                        caracteristicas.map(caracteristica => {
                                        return <p>+ {caracteristica}</p>
                                        })
                                    ) : (
                                        <p className='preferencias_vacias'>No hay preferencias.</p>
                                    )
                                }
                            </div>
                        </section>
                        <section className="estancia__estancia__informacion__parcela_tipo">
                            <section className="estancia__estancia__informacion__parcela">
                                <h2>PARCELA</h2>
                                <div className="estancia__estancia__informacion__parcela__parcela">
                                    {dataParcela?.results.nombre}
                                </div>
                            </section>
                            <section className="estancia__estancia__informacion__tipo">
                                <h2>TIPO</h2>
                                <div className="estancia__estancia__informacion__tipo__tipo">
                                    <div className={`circulo ${estancia.estancia_accion.estado === 'reserva' ? 'estado__reserva' : estancia.estancia_accion.estado === 'entrada' ? 'entrada' : 'salida'}`}></div>
                                    <p>{estancia.estancia_accion.estado}</p>
                                </div>
                            </section>
                        </section>
                    </section>
                    <h2>COMENTARIOS</h2>
                    <textarea disabled name="estanciaComentarios" id="estanciaComentarios" value={comentarios || "No hay comentarios."} onChange={e => setComentarios(e.target.value)}></textarea>
                </div>
            </div>
        </section>
    )
}