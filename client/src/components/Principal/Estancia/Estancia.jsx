import { useLoaderData, useNavigate } from 'react-router-dom'
import { useFetch } from '../../../hooks/useFetch'
import './Estancia.css'
import { useContext, useEffect, useState } from 'react'
import Concepto from '../FormularioReservas/Concepto/Concepto'
import Mensaje from '../../Mensaje/Mensaje'
import { LoginContext } from '../../../context/LoginContext'
import _ from 'lodash'
import ModalParcelas from './ModalParcelas/ModalParcelas'

export const loader = ({ params }) => {
    const id_estancia_accion = params.id_estancia_accion

    return fetch(`${import.meta.env.VITE_API_HOST}estancia-accion/id/${id_estancia_accion}`)
}

export default function Estancia () {

    const { results: estancia } = useLoaderData()

    const loginContext = useContext(LoginContext)

    // atributos de la estancia
    const [ nombre, setNombre ] = useState(estancia.estancia.nombre || '')
    const [ telefono, setTelefono ] = useState(estancia.estancia.telefono || '-')
    const [ fechaInicio, setFechaInicio ] = useState(estancia.estancia.fecha_inicio || '')
    const [ fechaFin, setFechaFin ] = useState(estancia.estancia.fecha_fin || '')
    const [ conceptos, setConceptos ] = useState(estancia.estancia.conceptos || new Array())
    const [ caracteristicas, setCaracteristicas ] = useState(estancia.estancia.caracteristicas || new Array())
    const [ parcela, setParcela ] = useState(estancia.estancia.parcela || "0")
    const [ comentarios, setComentarios ] = useState(estancia.estancia.comentarios || '')

    // Atributos del mesaje
    const [ mensaje, setMensaje ] = useState('')
    const [ accionAceptar, setAccionAceptar ] = useState(0) // 1 --> eliminar; 2 --> marcar llegada; 3 --> editar; 4 --> marcar salida 

    // Acciona la edición
    const [ modificar, setModificar ] = useState(false)

    // Controla la aparición del modal de parcelas disponibles
    const [ modalParcelas, setModalParcelas ] = useState(false)

    // Datos de la parcela seleccionada
    const [ dataParcela, setDataParcela ] = useState(null)

    // Errores
    const [ error, setError ] = useState(0) // 0 --> ningun error; 1 --> datos vacios; 2 --> conceptos invalidos; 3 --> parcela vacia

    const navigate = useNavigate()

    let [ dataUsuarioEstancia ] = useFetch(`${import.meta.env.VITE_API_HOST}${estancia.estancia_accion.tipo_usuario}/id/${estancia.estancia_accion.id_usuario}`)
    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)
    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)
    let [ dataEstanciaMasReciente ] = useFetch(`${import.meta.env.VITE_API_HOST}estancia/id/${estancia.estancia._id}`)

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
     * Devuelve los tipos de acomodación requeridos en la estancia
     * @returns array
     */
    const devolverTiposAcomodacionEstancia = () => {
        const conceptos_acomodacion = dataConceptos?.results.filter(concepto => ['bungalows', 'tipis', 'autocaravanas', 'carros tienda', 'caravanas', 'tiendas', 'campers'].includes(concepto.nombre)).map(tipo => tipo._id)
        const tipos_estancia_requeridos = conceptos.filter(concepto => conceptos_acomodacion.includes(concepto[0]) && (concepto[1] > 0)).map(t => t[0])

        return tipos_estancia_requeridos
    }

    /**
     * Comprueba que ni el nombre ni el telefono esté vacío
     * @returns boolean
     */
    const comprobarDatosValidos = () => {
        if(!nombre || !telefono || !fechaInicio || !fechaFin) {
            return false
        }

        return true
    }

    /**
     * Comprueba que al menos en la reserva hay seleccionado un adulto y un tipo de acomodación
     * @returns Boolean
     */
    const comprobarConceptosValidos = () => {
        let comprobacion = true

        const tipos_acomodacion = dataConceptos?.results.filter(concepto => ['bungalows', 'tipis', 'autocaravanas', 'caravanas', 'tiendas', 'campers', 'carros tienda'].includes(concepto.nombre)).map(tipo => tipo._id)
        const concepto_adulto = dataConceptos?.results.filter(concepto => concepto.nombre === 'adultos')[0]._id

        const tipos_acomodacion_reserva = conceptos.filter(c => tipos_acomodacion.includes(c[0]) && (c[1] > 0))
        const concepto_adulto_reserva = conceptos.filter(c => (c[0] === concepto_adulto) && (c[1] > 0))
        
        console.log(conceptos.filter(c => (c[0] === concepto_adulto)), conceptos)

        if((tipos_acomodacion_reserva.length === 0) || (concepto_adulto_reserva.length === 0)) {
            comprobacion = false
        }

        return comprobacion
    }

    /**
     * Función para eliminar una estancia
     */
    const funcionEliminarEstancia = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancia/eliminar/id/${estancia.estancia._id}`, { method: 'DELETE' })
        const data = await response.json()

        if(data.status === 'ok') {
            setMensaje(`${estancia.estancia_accion.estado} a nombre de ${nombre} eliminada correctamente`)
            modificarEstancia()
            setAccionAceptar(6)
        } else {
            setMensaje(data.message)
            setAccionAceptar(0)
        }
    }

    /**
     * Función para marcar una llegada de una reserva
     */
    const funcionMarcarEntradaOSalida = async (estado) => {
        const body = { 
            id_usuario: loginContext[0][0],
            tipo_usuario: loginContext[0][1] === 0 ? 'acomodador' : 'camping',
            fecha: formatearFecha(new Date()),
            comentarios: comentarios,
            estado: estado,
            parcela: parcela
        }

        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancia/marcar-${estado === 'entrada' ? 'llegada' : 'salida'}/id_estancia/${estancia.estancia._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()

        if(data.status === 'ok') {
            setMensaje(((estado === 'entrada') ? `Reserva a nombre de ${nombre} instalada en la parcela ${dataParcela?.results.nombre}` : `Estancia a nombre de ${nombre} ha dejado libre la parcela ${dataParcela?.results.nombre}`))
            (estado === 'entrada') ? navigate('/principal/entradas/entradas', { replace: true }) : navigate('/principal/salidas/salidas', { replace: true }) 
        } else if(data.status === 'not-allowed') {
            setMensaje(`Debes marcar antes la salida que hay prevista en la parcela "${dataParcela?.results.nombre}"`)
            setAccionAceptar(0)
        }
    }

    /**
     * Función para actualizar una estancia dada. Acción aceptar del botón guardar
     */
    const funcionEditarEstancia = async () => {
        const updates = new Object()

        // Comprobamos cambios
        if(nombre != estancia.estancia.nombre) updates.nombre = nombre
        if(telefono != estancia.estancia.telefono) updates.telefono = telefono
        updates.fecha_inicio = fechaInicio
        updates.fecha_fin = fechaFin
        if(comentarios != estancia.estancia_accion.comentarios) updates.comentarios = comentarios
        updates.parcela = parcela === "0" ? null : parcela
        updates.conceptos = conceptos
        updates.caracteristicas = caracteristicas

        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancia/editar/id/${estancia.estancia._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ updates, id_camping: dataCamping?.results._id, tipos: devolverTiposAcomodacionEstancia() })
        })
        const data = await response.json()

    
        if(data.status === 'ok') {
            setMensaje(`${estancia.estancia_accion.estado} a nombre de ${nombre} actualizada correctamente`)
            modificarEstancia()
        } else {
            setMensaje(data.message)
        }
        setAccionAceptar(0)
    }

    /**
     * Función de aceptar para maracar la llegada de una parcela sin parcela asignada
     */
    const funcionEditarEstanciaSinParcela = () => {
        // Dejamos de mostrar el mensaje
        setMensaje('')
        setAccionAceptar(0)

        // Activamos la modificación
        setModificar(true)
    }

    /**
     * Función que deshace la llegada o salida de una estancia
     */
    const funcionDeshacerLlegadaSalida = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancia/deshacer-accion/id_estancia_accion/${estancia.estancia_accion._id}`, { method: 'DELETE' })
        const data = await response.json()

        if(data.status === 'ok') {
            setMensaje(`${data.message} a nombre de ${nombre}`)
            setAccionAceptar(6)
        } else {
            setMensaje(data.message)
            setAccionAceptar(0)
        }
    }

    /**
     * Elimina una estancia
     */
    const eliminarEstancia = () => {
        setMensaje("¿Seguro que desea eliminar esta estancia?")
        setAccionAceptar(1)
    }

    /**
     * Marca la llegada de una reserva con parcela asignada
     */
    const marcarLlegadaSinParcela = () => {
        setMensaje(`Debes escoger una parcela para la reserva a nombre de ${nombre}`)
        setAccionAceptar(5)
    }

    /**
     * Marca la llegada de una reserva con parcela asignada
     */
    const marcarLlegadaConParcela = () => {
        setMensaje(`¿Seguro que deseas marcar que la reserva a nombre de ${nombre} se ha instalado en la parcela ${dataParcela?.results.nombre}?`)
        setAccionAceptar(2)
    }

    /**
     * Deshace una entrada o salida sin eliminar la estancia
     */
    const deshacerLlegadaSalida = () => {
        setMensaje(`¿Quieres deshacer ${estancia.estancia_accion.estado === 'entrada' ? 'la llegada al' : 'la salida del'} camping de la reserva de ${nombre}?`)
        setAccionAceptar(7)
    }

    /**
     * Edita una estancia
     */
    const editarEstancia = () => {
        if(!comprobarDatosValidos()) {
            setError(1)
            document.getElementById('datosReservaTitulo').scrollIntoView({ behavior: 'smooth' })
            return
        }

        if(!comprobarConceptosValidos()) {
            setError(2)
            document.getElementById('conceptosReservaTitulo').scrollIntoView({ behavior: 'smooth' })
            return
        }

        setMensaje(`¿Seguro que quieres editar esta estancia?`)
        setAccionAceptar(3)
    }

    /**
     * Marca la salida de una entrada
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

    /**
     * Volver a datos iniciales
     */
    const resetearEstancia = () => {
        setNombre(estancia.estancia.nombre || '')
        setTelefono(estancia.estancia.telefono || '-')
        setFechaInicio(estancia.estancia.fecha_inicio || '')
        setFechaFin(estancia.estancia.fecha_fin || '')
        setConceptos(estancia.estancia.conceptos || new Array())
        setCaracteristicas(estancia.estancia.caracteristicas || new Array())
        setParcela(estancia.estancia.parcela || "0")
        setComentarios(estancia.estancia.comentarios || '')
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${parcela || 0}`)
            .then(response => response.json())
            .then(data => setDataParcela(data))
    }, [parcela])

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

            estancia.estancia.conceptos.forEach(concepto => {
                const posicion = nuevos_conceptos.findIndex(c => c[0] === concepto[0])

                if(posicion != -1) {
                    nuevos_conceptos[posicion][1] = concepto[1]
                }
            })
            
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
                    <h2 id='datosReservaTitulo'>DATOS RESERVA</h2>
                    { error === 1 && <p className='estancia_error'>*Los campos nombre, telefono y las fechas deben estar rellenos</p> }
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
                    <h2 id='conceptosReservaTitulo'>CONCEPTOS</h2>
                    { error === 2 && <p className='estancia_error'>*Debes seleccionar mínimo un adulto y un tipo de acomodación</p> }
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
                                <section>
                                    <div className="estancia__estancia__informacion__parcela__parcela">
                                        {(parcela != "0") ? dataParcela?.results?.nombre : '-'}
                                    </div>
                                    {
                                        modificar && <button onClick={() => setModalParcelas(true)}>ASIGNAR PARCELAS</button>
                                    }
                                </section>
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
                {((dataEstanciaMasReciente?.results.estancia_accion.estado === estancia.estancia_accion.estado) && (estancia.estancia_accion.estado != 'salida')) && <button onClick={() => { modificar ? editarEstancia() : modificarEstancia() }}>{ modificar ? 'GUARDAR' : 'EDITAR' }</button>}
                {
                    !modificar ? (
                        <>
                            <button onClick={eliminarEstancia}>ELIMINAR</button>
                            { ((fechaInicio === formatearFecha(new Date())) && (dataEstanciaMasReciente?.results.estancia_accion.estado === 'reserva') && (dataEstanciaMasReciente?.results.estancia_accion.estado === estancia.estancia_accion.estado)) && <button onClick={() => { (parcela != '0') ? marcarLlegadaConParcela() : marcarLlegadaSinParcela() }}>MARCAR LLEGADA</button> }
                            { ((fechaFin === formatearFecha(new Date())) && (dataEstanciaMasReciente?.results.estancia_accion.estado === 'entrada')  && (dataEstanciaMasReciente?.results.estancia_accion.estado === estancia.estancia_accion.estado)) && <button onClick={marcarSalida}>MARCAR SALIDA</button> }
                            { ((dataEstanciaMasReciente?.results.estancia_accion.estado === estancia.estancia_accion.estado) && (estancia.estancia_accion.estado != 'reserva')) && <button onClick={deshacerLlegadaSalida}>DESHACER {estancia.estancia_accion.estado.toUpperCase()}</button> }
                        </>
                    ) : (
                        <button onClick={() => {modificarEstancia(); resetearEstancia(); setError(0)}}>CANCELAR</button>
                    )
                }
            </div>
            {
                mensaje && <Mensaje mensaje={mensaje} accionCancelar={() => {setMensaje(''); setAccionAceptar(0)}} accionAceptar={(accionAceptar === 0) ? () => {setMensaje('')} : (accionAceptar === 1) ? funcionEliminarEstancia : (accionAceptar === 2) ? () => {funcionMarcarEntradaOSalida('entrada')} : (accionAceptar === 3) ? funcionEditarEstancia : (accionAceptar === 4) ? () => {funcionMarcarEntradaOSalida('salida')} : (accionAceptar === 5) ? funcionEditarEstanciaSinParcela : (accionAceptar === 6) ? () => {navigate('..', { replace: true })} : (accionAceptar === 7) ? funcionDeshacerLlegadaSalida : null } />
            }
            {
                modalParcelas && <ModalParcelas fecha_inicio={fechaInicio} fecha_fin={fechaFin} tipos={devolverTiposAcomodacionEstancia()} caracteristicas={caracteristicas} id_camping={dataCamping?.results._id} handlerCerrarModal={() => {setModalParcelas(false)}} parcela={parcela} setParcela={setParcela} parcelaAsignada={estancia.estancia.parcela} /> 
            }
        </section>
    )
}