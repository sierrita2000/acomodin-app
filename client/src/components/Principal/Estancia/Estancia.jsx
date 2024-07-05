import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFetch } from '../../../hooks/useFetch'
import './Estancia.css'
import { useContext, useEffect, useState } from 'react'
import Concepto from '../FormularioReservas/Concepto/Concepto'
import Mensaje from '../../Mensaje/Mensaje'
import { LoginContext } from '../../../context/LoginContext'
import _ from 'lodash'

export const loader = ({ params }) => {
    const id_estancia_accion = params.id_estancia_accion

    return fetch(`${import.meta.env.VITE_API_HOST}estancia-accion/id/${id_estancia_accion}`)
}

export default function Estancia () {

    const { results: estancia } = useLoaderData()

    const loginContext = useContext(LoginContext)

    const [ nombre, setNombre ] = useState(estancia.estancia.nombre || '')
    const [ telefono, setTelefono ] = useState(estancia.estancia.telefono || '-')
    const [ fechaInicio, setFechaInicio ] = useState(estancia.estancia.fecha_inicio || '')
    const [ fechaFin, setFechaFin ] = useState(estancia.estancia.fecha_fin || '')
    const [ conceptos, setConceptos ] = useState(estancia.estancia.conceptos || new Array())
    const [ caracteristicas, setCaracteristicas ] = useState(estancia.estancia.caracteristicas || new Array())
    const [ parcela, setParcela ] = useState(estancia.estancia.parcela || "0")
    const [ comentarios, setComentarios ] = useState(estancia.estancia.comentarios || '')

    const [ mensaje, setMensaje ] = useState('')
    const [ accionAceptar, setAccionAceptar ] = useState(0) // 1 --> eliminar; 2 --> editar 

    const [ modificar, setModificar ] = useState(false)

    const navigate = useNavigate()

    let [ dataUsuarioEstancia ] = useFetch(`${import.meta.env.VITE_API_HOST}${estancia.estancia_accion.tipo_usuario}/id/${estancia.estancia_accion.id_usuario}`)
    let [ dataParcela ] = useFetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${parcela || 0}`)
    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)
    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)
    let [ dataParcelaCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}parcelas/devolver-parcelas/id_camping/${loginContext[0][1] === 0 ? dataUsuario?.results.id_camping : loginContext[0][0]}`)

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() < 10) ? '0' : ''}${fecha.getDate()}`
    }

    /**
     * Devuelve la fecha mínima que puede seleccionar el usuario de salida.s
     * @returns String
     */
    const fechaMinimaSalida = () => {
        let fecha_minima = new Date(fechaInicio) < new Date() ? new Date() : new Date(fechaInicio)
        fecha_minima.setDate(fecha_minima.getDate() + 1)
        formatearFecha(fecha_minima)
        return formatearFecha(fecha_minima)
    }

    /**
     * Controla el cambio de la fecha de inicio
     * @param {Event} e 
     */
    const cambiarFechaInicio = (e) => {
        setFechaInicio(e.target.value)

        // Si después de introducir la fecha de inicio de nuevo, supera a la de salida, esta última se borra
        if(new Date(fechaInicio) < new Date(fechaFin)) {
            setFechaFin('')
        }
    }

    /**
     * Función para eliminar una estancia
     */
    const funcionEliminarEstancia = () => {
        fetch(`${import.meta.env.VITE_API_HOST}estancia/eliminar/id/${estancia.estancia._id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.status === 'ok' ? `Reserva a nombre de ${nombre} eliminada correctamente` : data.messsage)
                navigate('..', { replace: true })
            })
    }

    /**
     * Función para marcar una llegada de una reserva
     */
    const funcionMarcarEntradaOSalida = (estado) => {
        const body = { 
            id_usuario: loginContext[0][0],
            tipo_usuario: loginContext[0][1] === 0 ? 'acomodador' : 'camping',
            fecha: formatearFecha(new Date()),
            comentarios: comentarios,
            estado: estado
        }

        fetch(`${import.meta.env.VITE_API_HOST}estancia/marcar-${estado === 'entrada' ? 'llegada' : 'salida'}/id_estancia/${estancia.estancia._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => {
                setMensaje(data.status === 'ok' ? ((estado === 'entrada') ? `Reserva a nombre de ${nombre} instalada en la parcela ${dataParcela?.results.nombre}` : `Estancia a nombre de ${nombre} ha dejado libre la parcela ${dataParcela?.results.nombre}`) : data.messsage)
                setAccionAceptar(0)
            })
    }

    /**
     * Función para actualizar una estancia dada
     */
    const funcionEditarEstancia = async () => {
        const updates = new Object()

        // Comprobamos cambios
        if(nombre != estancia.estancia.nombre) updates.nombre = nombre
        if(telefono != estancia.estancia.telefono) updates.telefono = telefono
        if(fechaInicio != estancia.estancia.fecha_inicio) updates.fecha_inicio = fechaInicio
        if(fechaFin != estancia.estancia.fecha_fin) updates.fecha_fin = fechaFin
        if(comentarios != estancia.estancia_accion.comentarios) updates.comentarios = comentarios
        if((estancia.estancia.parcela && (parcela != estancia.estancia.parcela)) || (!estancia.estancia.parcela && (parcela != "0"))) updates.parcela = parcela === "0" ? null : parcela
        /*for (const concepto of conceptos) {
            if(!(estancia.estancia.conceptos).find(c => (c[0]===concepto[0]) && (c[1]===concepto[1]))) {
                updates.conceptos = conceptos
                break
            }
        }*/
        updates.conceptos = conceptos
        if(!_.isEqual(caracteristicas, estancia.estancia.caracteristicas)) updates.caracteristicas = caracteristicas

        /*if(Object.keys(updates).length === 0) {
            setMensaje("No has editado ningún campo")
            setAccionAceptar(0)
            modificarEstancia()
            return
        }*/

        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancia/editar/id/${estancia.estancia._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ updates })
        })
        const data = await response.json()

        setMensaje(data.status === 'ok' ? `${estancia.estancia_accion.estado} a nombre de ${nombre} actualizada correctamente` : data.messsage)
        setAccionAceptar(0)
        modificarEstancia()
    }

    /**
     * Elimina una estancia
     */
    const eliminarEstancia = () => {
        setMensaje("¿Seguro que desea eliminar esta estancia?")
        setAccionAceptar(1)
    }

    /**
     * Elimina una estancia
     */
    const marcarLlegada = () => {
        setMensaje(`¿Seguro que deseas marcar que la reserva a nombre de ${nombre} se ha instalado en la parcela ${parcela}?`)
        setAccionAceptar(2)
    }

    /**
     * Edita una estancia
     */
    const editarEstancia = () => {
        setMensaje(`¿Seguro que quieres editar esta estancia?`)
        setAccionAceptar(3)
    }

    /**
     * Matca la salida de una entrada
     */
    const marcarSalida= () => {
        setMensaje(`¿Seguro que quieres resgitrar la salida de la parcela ${dataParcela?.results.nombre}?`)
        setAccionAceptar(4)
    }
    
    /**
     * Habilita la modificación de una estancia
     */
    const modificarEstancia = () => {
        let elementos = new Array()

        elementos.push(document.getElementById('estanciaNombre'))
        elementos.push(document.getElementById('estanciaTelefono'))
        elementos.push(document.getElementById('estanciaFechaFin'))
        if(estancia.estancia_accion.estado === 'reserva') {
            elementos.push(document.getElementById('estanciaFechaInicio')) 
            elementos.push(document.getElementById('estanciaComentarios'))
        } 

        elementos.forEach(elemento => {
            if(elemento) elemento.disabled = modificar
        })

        document.getElementById('perfilUsuario').scrollIntoView({ behavior: 'smooth' })
        setModificar(!modificar)
    }

    useEffect(() => {
        if((parcela === estancia.estancia.parcela) || (!estancia.estancia.parcela && (parcela === "0"))) {
            setConceptos(estancia.estancia.conceptos)
        } else {
            let nuevos_conceptos = []

            if(parcela != "0") {
                // lista de los id de los conceptos generales
                const conceptos_generales = dataConceptos?.results.filter(concepto => ['adultos', 'niños', 'coches', 'motos', 'mascotas'].includes(concepto.nombre)).map(tipo => tipo._id)
                const conceptos_generales_camping = dataCamping?.results.conceptos.filter(concepto => conceptos_generales.includes(concepto)).map(c => [c, 0])
                // id de la luz
                const id_electricidad = dataConceptos?.results.find(concepto => concepto.nombre === 'electricidad')._id

                nuevos_conceptos = dataParcela?.results.tipos.map(id_concepto => [id_concepto, 0]).concat(conceptos_generales_camping)
                if(dataParcela?.results.electricidad) nuevos_conceptos.push([id_electricidad, 0])

                setCaracteristicas(dataParcela?.results.caracteristicas)
            } else {
                nuevos_conceptos = dataCamping?.results.conceptos.map(id_concepto => [id_concepto, 0])
            }
            
            setConceptos(nuevos_conceptos)
        }
    }, [dataParcela])

    return(
        <section className="estancia">
            <button onClick={() => navigate('..', { replace: true })} className='boton_cierre'><i className="fa-solid fa-xmark"></i></button>
            <div className="estancia__estancia">
                <div id='perfilUsuario' className="estancia__estancia__acomodador">
                    <img src={`${import.meta.env.VITE_API_HOST}static/${dataUsuarioEstancia?.results.imagen}`} alt="IMAGEN-USUARIO" />
                    <div>
                        <p>{dataUsuarioEstancia?.results.nombre} {dataUsuarioEstancia?.results.apellidos}</p>
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
                            <input disabled type="date" name="estanciaFechaInicio" id="estanciaFechaInicio" min={formatearFecha(new Date())} value={fechaInicio} onChange={e => cambiarFechaInicio(e)} />
                            <p className='raya_fechas'>-</p>
                            <input disabled type="date" name="estanciaFechaFin" id="estanciaFechaFin" min={fechaMinimaSalida()} value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                        </div>
                    </div>
                    <h2>CONCEPTOS</h2>
                    <div className="estancia__estancia__informacion__conceptos">
                        {
                            dataConceptos?.results.filter(c => conceptos.map(c => c[0]).includes(c._id)).map(concepto => {
                                return <Concepto key={concepto._id} id={concepto._id} nombre={concepto.nombre} imagen={concepto.imagen} conceptos={conceptos} setConceptos={setConceptos} disabled={!modificar} />
                            })
                        }
                    </div>
                    <section>
                        <section className="estancia__estancia__informacion__caracteristicas">
                            <h2>CARACTERÍSTICAS</h2>
                            <section>
                                {
                                    (modificar && (parcela === "0")) && (
                                        <div className="estancia__estancia__informacion__caracteristicas__caracteristicas_no_incluidas">
                                            {
                                                dataCamping?.results.caracteristicas.filter(c => !caracteristicas.includes(c)).map(caracteristica => {
                                                    return(
                                                        <div className='caracteristica_con_boton'>
                                                            <p>+ {caracteristica}</p>
                                                            <button onClick={() => setCaracteristicas(caracteristicas.concat(caracteristica))}><i className="fa-solid fa-circle-arrow-right"></i></button>
                                                        </div>
                                                    ) 
                                                })
                                            }
                                        </div>
                                    )
                                }
                                <div className="estancia__estancia__informacion__caracteristicas__caracteristicas">
                                    {
                                        caracteristicas.length > 0 ?
                                        (
                                            caracteristicas.map(caracteristica => {
                                                return(
                                                    <div className='caracteristica_con_boton'>
                                                        <p>+ {caracteristica}</p>
                                                        {(modificar && (parcela === "0")) && <button onClick={() => {
                                                                const caracteristicas_copia = caracteristicas.slice()
                                                                const posicion = caracteristicas_copia.findIndex( c => c === caracteristica)
                                                                caracteristicas_copia.splice(posicion, 1)
                                                                setCaracteristicas(caracteristicas_copia)
                                                            }}><i className="fa-solid fa-trash-can"></i></button>}
                                                    </div>
                                                ) 
                                            })
                                        ) : (
                                            <p className='preferencias_vacias'>No hay preferencias.</p>
                                        )
                                    }
                                </div>
                            </section>
                        </section>
                        <section className="estancia__estancia__informacion__parcela_tipo">
                            <section className="estancia__estancia__informacion__parcela">
                                <h2>PARCELA</h2>
                                {
                                    modificar ? (
                                        <select className={`reserva_select_parcelas`} name="selectParcelas" id="selectParcelas" value={parcela} onChange={e => setParcela(e.target.value)}>
                                            <option value="0" selected>-</option>
                                            {
                                                dataParcelaCamping?.results.sort((a, b) => {
                                                    const id_zona_A = a.nombre.toUpperCase()
                                                    const id_zona_B = b.nombre.toUpperCase()
                
                                                    if(id_zona_A < id_zona_B) return -1
                                                    if(id_zona_A > id_zona_B) return 1
                                                    else return 0
                                                }).map(parcela => {
                                                    return <option value={parcela._id}>{parcela.nombre}</option>
                                                })
                                            }
                                        </select>
                                    ) : (
                                        <div className="estancia__estancia__informacion__parcela__parcela">
                                            {(parcela != "0") ? dataParcela?.results.nombre : '-'}
                                        </div>
                                    )
                                }
                            </section>
                            <section className="estancia__estancia__informacion__tipo">
                                <h2>TIPO</h2>
                                <div className="estancia__estancia__informacion__tipo__tipo">
                                    <div className={`circulo ${estancia.estancia_accion.estado === 'reserva' ? 'estado__reserva' : estancia.estancia_accion.estado === 'entrada' ? 'estado__entrada' : 'estado__salida'}`}></div>
                                    <p>{estancia.estancia_accion.estado}</p>
                                </div>
                            </section>
                        </section>
                    </section>
                    <h2>COMENTARIOS</h2>
                    <textarea disabled name="estanciaComentarios" id="estanciaComentarios" placeholder='Escriba aquí los comentarios que desé...' value={modificar ? comentarios : "No hay comentarios."} onChange={e => setComentarios(e.target.value)}></textarea>
                </div>
            </div>
            <div className="estancia__botones">
                <button onClick={() => { modificar ? editarEstancia() : modificarEstancia() }}>{ modificar ? 'GUARDAR' : 'EDITAR' }</button>
                {
                    !modificar ? (
                        <>
                            <button onClick={eliminarEstancia}>ELIMINAR</button>
                            { estancia.estancia.fecha_inicio === formatearFecha(new Date()) && <button onClick={marcarLlegada}>MARCAR LLEGADA</button> }
                            { estancia.estancia.fecha_fin === formatearFecha(new Date()) && <button onClick={marcarSalida}>MARCAR SALIDA</button> }
                        </>
                    ) : (
                        <button onClick={() => modificarEstancia()}>CANCELAR</button>
                    )
                }
            </div>
            {
                mensaje && <Mensaje mensaje={mensaje} accionCancelar={() => {setMensaje(''), setAccionAceptar(0)}} accionAceptar={(accionAceptar === 0) ? () => {setMensaje('')} : (accionAceptar === 1) ? funcionEliminarEstancia : (accionAceptar === 2) ? () => {funcionMarcarEntradaOSalida('entrada')} : (accionAceptar === 3) ? funcionEditarEstancia : () => {funcionMarcarEntradaOSalida('salida')} } />
            }
        </section>
    )
}