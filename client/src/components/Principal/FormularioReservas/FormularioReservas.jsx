import { Form, useNavigate, useParams } from 'react-router-dom'
import './FormularioReservas.css'
import { useContext, useEffect, useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { LoginContext } from '../../../context/LoginContext'
import Mensaje from '../../Mensaje/Mensaje'
import Concepto from './Concepto/Concepto'

export default function FormularioReservas ({ reserva }) {

    const { id_parcela } = useParams()
    const navigate = useNavigate()

    const loginContext = useContext(LoginContext)

    const [ nombre, setNombre ] = useState('')
    const [ telefono, setTelefono ] = useState('')
    const [ fechaInicio, setFechaInicio ] = useState('')
    const [ fechaFin, setFechaFin ] = useState('')
    const [ conceptos, setConceptos ] = useState(new Array())
    const [ preferencias, setPreferencias ] = useState(new Array())
    const [ comentarios, setComentarios ] = useState('')

    const [ loadingReserva, setLoadingReserva ] = useState(false)
    const [ errorReserva, setErrorReserva ] = useState(0) // 0: no hay error; 1: error de campos vacíos; 2: error de conceptos

    const [ mensaje, setMensaje ] = useState(null)

    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)
    let [ dataParcela ] = id_parcela ? useFetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${id_parcela}`) : null
    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)

    /**
     * Handler del botón de añadir preferencia
     * @param {String} preferencia 
     */
    const addPreferencia = (preferencia) => {
        const preferencias_copia = preferencias.slice()
        preferencias_copia.push(preferencia)

        setPreferencias(preferencias_copia)
    }

    /**
     * Handler del botón basura para quitar una preferencia
     * @param {String} preferencia 
     */
    const quitarPreferencia = (preferencia) => {
        const preferencias_copia = preferencias.filter(p => p != preferencia)

        setPreferencias(preferencias_copia)
    } 

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
    }

    /**
     * Devuelve la fecha del día siguiente de la fecha mínima.
     * @returns String
     */
    const fechaMinimaSalida = () => {
        let fecha_minima = fechaInicio ? new Date(fechaInicio) : new Date()
        fecha_minima.setDate(fecha_minima.getDate() + 1)
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
     * Comprueba que al menos en la reserva hay seleccionado un adulto y un tipo de acomodación
     * @returns Boolean
     */
    const comprobarConceptosValidos = () => {
        let comprobacion = true

        const tipos_acomodacion = dataConceptos?.results.filter(concepto => ['bungalows', 'tipis', 'autocaravanas', 'caravanas', 'tiendas', 'campers', 'carros tienda'].includes(concepto.nombre)).map(tipo => tipo._id)
        const concepto_adulto = dataConceptos?.results.filter(concepto => concepto.nombre === 'adultos')[0]._id

        const tipos_acomodacion_reserva = conceptos.filter(c => tipos_acomodacion.includes(c[0]) && (c[1] > 0))
        const concepto_adulto_reserva = conceptos.filter(c => (c[0] === concepto_adulto) && (c[1] > 0))
        
        if((tipos_acomodacion_reserva.length === 0) && concepto_adulto_reserva.length === 0) {
            comprobacion = false
        }

        return comprobacion
    }

    /**
     * Crea una estancia en la BBDD
     */
    const crearEstancia = async () => {
        if (nombre === '' || fechaInicio === '' || fechaFin === '') {
            setErrorReserva(1)
            document.getElementById('formularioReservas').scrollIntoView({ behavior: 'smooth' })
            return
        }

        if(!comprobarConceptosValidos()) {
            setErrorReserva(2)
            document.getElementById('formularioReservas').scrollIntoView({ behavior: 'smooth' })
            return
        }

        setLoadingReserva(true)

        const obj_estancia = { nombre, telefono, fecha_inicio: fechaInicio, fecha_fin: fechaFin, conceptos, parcela: id_parcela, id_camping: dataCamping?.results._id }
        const obj_estancia_accion = { id_usuario: loginContext[0][0], tipo_usuario: (loginContext[0][1] === 0 ? 'acomodador' : 'camping'), fecha: formatearFecha(new Date()), estado: 'reserva', comentarios }
        
        const response = await fetch(`${import.meta.env.VITE_API_HOST}estancias/crear-estancia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estancia: obj_estancia, estancia_accion: obj_estancia_accion })
        })
        const data = await response.json()

        if(data) { 
            setLoadingReserva(false)
            setMensaje({ mensaje: data.message, accionAceptar: () => { navigate(-1, {replace: true, state: { actualizacion: true }}) } }) 
        }
    }

    useEffect(() => {
        if (id_parcela) {
            const adultos_nenes = dataConceptos?.results.filter(c => (c.nombre === 'adultos' || c.nombre === 'niños')).map(c => c._id)
            const conceptos_generales = dataCamping?.results.conceptos.filter(c => ['665a0165c5f8973c88844b8a', '665a0165c5f8973c88844b89', '665a0165c5f8973c88844b88'].includes(c))
            if (dataParcela?.results.electricidad) conceptos_generales?.push('665a0165c5f8973c88844b8b')
            const array_conceptos = conceptos_generales ? dataParcela?.results.tipos.concat(conceptos_generales).concat(adultos_nenes).map(c => [c, 0]) : null
            setConceptos(array_conceptos)
        } else {
            const array_conceptos = dataConceptos?.results.map(concepto => [concepto._id, 0])
            setConceptos(array_conceptos)
        }
    }, [dataParcela, dataConceptos, dataCamping])

    return(
        <div className="formulario_reservas">
            <div className="formulario_reservas__modal">
                <section className="formulario_reservas__modal__btn_cerrar">
                    <button onClick={() => navigate(-1, {replace: true})}><i className="fa-solid fa-xmark"></i></button>
                </section>
                <form id='formularioReservas' className='formulario_reservas__modal__formulario'>
                    { errorReserva === 1 && <p className='texto_error'>Debes rellenar los campos obligatorios</p> }
                    <section className='formulario_reservas__section_datos'>
                        <div>
                            <label htmlFor="formReservaNombre">nombre<p>*</p></label>
                            <input className={`formulario_reservas__input ${(errorReserva === 1 && nombre === '') && 'error_campo_vacio'}`} type="text" name="formReservaNombre" id="formReservaNombre" value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="formReservaTelefono">telefono</label>
                            <input className='formulario_reservas__input' type="text" name="formReservaTelefono" id="formReservaTelefono" maxLength={9} value={telefono} onChange={e => (new RegExp('^[0-9]+$').test(e.target.value) || e.target.value === '') && setTelefono(e.target.value)} />
                        </div>
                    </section>
                    <section className='formulario_reservas__section_datos'>
                        <div>
                            <label htmlFor="formReservaFechaInicio">fecha inicio<p>*</p></label>
                            <input className={`formulario_reservas__input__fechas ${(errorReserva === 1 && fechaInicio === '') && 'error_campo_vacio'}`} type="date" name="formReservaFechaInicio" id="formReservaFechaInicio" min={formatearFecha(new Date())} value={fechaInicio} onChange={e => cambiarFechaInicio(e)} />
                        </div>
                        <div>
                            <label htmlFor="formReservaFechaFin">fecha fin<p>*</p></label>
                            <input className={`formulario_reservas__input__fechas ${(errorReserva === 1 && fechaFin === '') && 'error_campo_vacio'}`} type="date" name="formReservaFechaFin" id="formReservaFechaFin" min={fechaMinimaSalida()} value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                        </div>
                    </section>
                    { errorReserva === 2 && <p className='texto_error'>Debes seleccionar al menos un adulto, y un tipo de acampada</p> }
                    <section className='formulario_reserva__section__column'>
                        <label htmlFor="formReservaConceptos">conceptos<p>*</p></label>
                        <div id="formReservaConceptos" name="formReservaConceptos">
                            {
                                dataConceptos?.results.filter(c => conceptos?.map(con => con[0]).includes(c._id)).map((concepto, indice) => {
                                    return <Concepto key={concepto._id} nombre={concepto.nombre} imagen={concepto.imagen} conceptos={conceptos} setConceptos={setConceptos} indice={indice} disabled={false} />
                                })
                            }
                        </div>
                    </section>
                    {
                        !id_parcela && (
                            <section className='formulario_reserva__section__column'>
                                <label htmlFor="formReservaPreferencias">preferencias</label>
                                <div id="formReservaPreferencias" name="formReservaPreferencias" >
                                    <div>
                                        {
                                            dataParcela?.results.caracteristicas.filter(caracteristica => !preferencias.includes(caracteristica)).map(preferencia => {
                                                return(
                                                    <div className="formulario_reserva__preferencia">
                                                        <p>{preferencia}</p>
                                                        <button onClick={e => { e.preventDefault(); addPreferencia(preferencia) }}><i className="fa-solid fa-circle-arrow-right"></i></button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div>
                                        {
                                            preferencias.map(preferencia => {
                                                return(
                                                    <div className="formulario_reserva__preferencia">
                                                        <p>{preferencia}</p>
                                                        <button onClick={e => { e.preventDefault(); quitarPreferencia(preferencia) }}><i className="fa-solid fa-trash-can"></i></button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </section>
                        )
                    }
                    <section className='formulario_reserva__section__column'>
                        <label htmlFor="formReservaParcelas">parcelas</label>
                        <div id="formReservaParcelas" name="formReservaParcelas">
                            {dataParcela?.results.nombre}
                        </div>
                    </section>
                    <section className='formulario_reserva__section__column'>
                        <label htmlFor='forReservaComentarios'>comentarios del acomodador</label>
                        <textarea name="forReservaComentarios" id="forReservaComentarios" placeholder='Escribe aquí los comentarios que quieras...' value={comentarios} onChange={e => setComentarios(e.target.value)}></textarea>
                    </section>
                    <div className='form_reservas_boton'>
                        <button type='submit' onClick={e => {e.preventDefault(); crearEstancia()}} >
                            { loadingReserva ? 
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
                                : 
                                    reserva ? 'AÑADIR RESERVA' : 'AÑADIR ENTRADA'
                            }
                        </button>
                    </div>
                </form>
            </div>
            {
                mensaje && <Mensaje mensaje={mensaje.mensaje} accionAceptar={mensaje.accionAceptar} />
            }
        </div>
    )
}