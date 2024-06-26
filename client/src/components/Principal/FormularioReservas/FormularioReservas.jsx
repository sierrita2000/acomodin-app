import { Form, useNavigate, useParams } from 'react-router-dom'
import './FormularioReservas.css'
import { useContext, useEffect, useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { LoginContext } from '../../../context/LoginContext'

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

    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)
    let [ dataParcela ] = id_parcela ? useFetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${id_parcela}`) : null
    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)
    
    /**
     * Handler para controlar la cantidad de cada concepto
     * @param {Number} accion 
     * @param {Number} indice 
     * @returns 
     */
    const sumarRestarConcepto = (accion, indice) => {
        const copia_conceptos = conceptos.slice()
        if (accion === 0){
            copia_conceptos[indice][1] = copia_conceptos[indice][1] + 1
        } else {
            if (copia_conceptos[indice][1] === 0) {
                return
            } else {
                copia_conceptos[indice][1] = copia_conceptos[indice][1] - 1
            }
        } 

        setConceptos(copia_conceptos)
    }

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
    const formatearFechaHoy = () => {
        const hoy = new Date()
        return `${hoy.getFullYear()}/${(hoy.getMonth() + 1 < 10) ? '0' : ''}${hoy.getMonth() + 1}/${(hoy.getDate() + 1 < 10) ? '0' : ''}${hoy.getDate()}`
    }

    /**
     * Crea una estancia en la BBDD
     */
    const crearEstancia = async () => {
        setLoadingReserva(true)

        const obj_estancia = { nombre, telefono, fecha_inicio: fechaInicio, fecha_fin: fechaFin, conceptos, parcela: id_parcela, id_camping: dataCamping?.results._id }
        const obj_estancia_accion = { id_usuario: loginContext[0][0], tipo_usuario: (loginContext[0][1] === 0 ? 'acomodador' : 'camping'), fecha: formatearFechaHoy(), estado: 'reserva', comentarios }
        
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
            alert(data.message)
            navigate(-1, {replace: true, state: { actualizacion: true }})
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
                <form className='formulario_reservas__modal__formulario'>
                    <section>
                        <div>
                            <label htmlFor="formReservaNombre">nombre</label>
                            <input type="text" name="formReservaNombre" id="formReservaNombre" value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="formReservaTelefono">telefono</label>
                            <input type="text" name="formReservaTelefono" id="formReservaTelefono" maxLength={9} value={telefono} onChange={e => (new RegExp('^[0-9]+$').test(e.target.value) || e.target.value === '') && setTelefono(e.target.value)} />
                        </div>
                    </section>
                    <section>
                        <div>
                            <label htmlFor="formReservaFechaInicio">fecha inicio</label>
                            <input type="date" name="formReservaFechaInicio" id="formReservaFechaInicio" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="formReservaFechaFin">fecha fin</label>
                            <input type="date" name="formReservaFechaFin" id="formReservaFechaFin" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                        </div>
                    </section>
                    <section>
                        <label htmlFor="formReservaConceptos">conceptos</label>
                        <div id="formReservaConceptos" name="formReservaConceptos">
                            {
                                dataConceptos?.results.filter(c => conceptos?.map(con => con[0]).includes(c._id)).map((concepto, indice) => {
                                    return (
                                        <div className="formulario_reserva__concepto">
                                            <img title={concepto.nombre} src={`${import.meta.env.VITE_API_HOST}static/${concepto.imagen}`} alt={`FIGURA-${concepto.nombre}`} />
                                            <div>
                                                <input type="text" name={`formReservaConcepto${nombre}`} id={`formReservaConcepto${nombre}`} disabled value={conceptos[indice][1]} />
                                                <div className="botones">
                                                    <button onClick={e => {e.preventDefault(); sumarRestarConcepto(0, indice)}}><i className="fa-solid fa-caret-up"></i></button>
                                                    <button onClick={e => {e.preventDefault(); sumarRestarConcepto(1, indice)}}><i className="fa-solid fa-caret-down"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </section>
                    {
                        !id_parcela && (
                            <section>
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
                    <section>
                        <label htmlFor="formReservaParcelas">parcelas</label>
                        <div id="formReservaParcelas" name="formReservaParcelas">
                            {dataParcela?.results.nombre}
                        </div>
                    </section>
                    <section>
                        <label htmlFor='forReservaComentarios'>comentarios del acomodador</label>
                        <textarea name="forReservaComentarios" id="forReservaComentarios" placeholder='Escribe aquí los comentarios que quieras...' value={comentarios} onChange={e => setComentarios(e.target.value)}></textarea>
                    </section>
                    <div className='form_reservas_boton'>
                        <button type='submit' onClick={e => {e.preventDefault(); crearEstancia()}} >{ reserva ? 'AÑADIR RESERVA' : 'AÑADIR ENTRADA'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}