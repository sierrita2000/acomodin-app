import { useContext, useEffect, useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import './CalendarioReservas.css'
import { LoginContext } from '../../../context/LoginContext'
import Figura from '../../BotonFigura/Figura'

export default function CalendarioReservas () {

    /**
    * Formatea la fecha de hoy
    * @returns String
    */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
    }

    const [ fechaInicio, setFechaInicio ] = useState(formatearFecha(new Date()))
    const [ fechaFin, setFechaFin ] = useState(formatearFecha(new Date(new Date().setDate(new Date().getDate() + 31))))
    const [ caracteristicas, setCaracteristicas ] = useState(new Array())
    const [ conceptos, setConceptos ] = useState(new Array())
    const [ tamano, setTamano ] = useState('todos')

    const [ zonas, setZonas ] = useState(null)
    const [ loadingZonas, setLoadingZonas ] = useState(true)

    const loginContext = useContext(LoginContext)

    let [ dataCamping, errorCamping, loadingCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)
    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)

    const [ conceptosCamping, setConceptosCamping ] = useState(new Array())

    /**
     * Incluye o borra una caracteristica
     */
    const incluirBorrarCaracteristica = (e) => {
        const c = e.target.value 
        if (caracteristicas.includes(c)) {
            setCaracteristicas(caracteristicas.filter(caracteristica => caracteristica != c))
        } else {
            setCaracteristicas(caracteristicas.concat(c))
        }
    }

    /**
     * Devuelve los conceptos de acomodación y luz de un camping
     * @returns array
     */
    const tiposYLuzDelCamping = () => {
        const tipos_acomodacion_y_luz = dataConceptos?.results.filter(concepto => ['bungalows', 'tipis', 'autocaravanas', 'caravanas', 'tiendas', 'campers', 'carros tienda', 'electricidad'].includes(concepto.nombre))
        const conceptos_camping = tipos_acomodacion_y_luz.filter(tipo => dataCamping?.results.conceptos.includes(tipo._id))

        return conceptos_camping
    }

    const diferenciaDiasEntreFechas = (fecha_inicio, fecha_fin) => {
        const fecha_inicio_ = Date.parse(new Date(fecha_inicio))
        const fecha_fin_ = Date.parse(new Date(fecha_fin))

        const diferencia = (fecha_fin_ - fecha_inicio_) / (24 * 60 * 60 * 1000)

        return diferencia
    }

    /**
     * Cambia la fecha de inicio
     */
    const cambiarFechaInicio = (fecha_inicio) => {
        const fecha_incio_ = new Date(fecha_inicio)
        if(!fecha_inicio) {
            return
        }

        if(diferenciaDiasEntreFechas(fecha_inicio, fechaFin) > 31) {
            setFechaFin(formatearFecha(new Date(fecha_incio_.setDate(fecha_incio_.getDate() + 31))))
        }

        setFechaInicio(fecha_inicio)
    }

    /**
     * Cambia la fecha de fin
     */
    const cambiarFechaFin = (fecha_fin) => {
        const fecha_fin_ = new Date(fecha_fin)
        if(!fecha_fin) {
            return
        }

        if(diferenciaDiasEntreFechas(fechaInicio, fecha_fin) > 31) {
            setFechaInicio(formatearFecha(new Date(fecha_fin_.setDate(fecha_fin_.getDate() - 31))))
        }

        setFechaFin(fecha_fin)
    }

    /**
     * Recupera las zonas del camping con las parcelas que cumplen los filtros
     */
    const zonasYParcelasDelCampingFiltradas = async () => {
        setLoadingZonas(true)
        const obj_body = new Object()

        obj_body.caracteristicas = (caracteristicas.length > 0) ? caracteristicas : null
        obj_body.tipos = (conceptos.length > 0) ? conceptos.filter(c => c != dataConceptos?.results.find(concepto => concepto.nombre === 'electricidad')._id) : null
        obj_body.tamano = (tamano != 'todos') ? tamano : null
        obj_body.electricidad = (conceptos.includes(dataConceptos?.results.find(concepto => concepto.nombre === 'electricidad')._id)) ? true : null

        const response = await fetch(`${import.meta.env.VITE_API_HOST}parcelas/zonas-parcelas-filtradas/id_camping/${dataCamping?.results._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...obj_body })
        })
        const data = await response.json()

        if(data.status === 'ok') {
            setZonas(data.results)
        }
        setLoadingZonas(false)
    }

    useEffect(() => {
        if(dataCamping && dataConceptos) {
            setConceptosCamping(tiposYLuzDelCamping())

            // Recupera las zonas del camping con las parcelas que cumplen los filtros
            zonasYParcelasDelCampingFiltradas()
        }
    }, [dataCamping, dataConceptos])

    return(
        <div className="calendario_reservas">
            {
                loadingCamping ? (
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
                    <section>
                        <section className='calendario_reservas__filtros'>
                            <div className="calendario_reservas__filtros__filtros">
                                <h2>FILTROS</h2>
                                <h4>fechas</h4>
                                <section className='calendario_reservas__filtros__filtros__fechas'>
                                    <input type="date" name="calendarioFiltrosFechaInicio" id="calendarioFiltrosFechaInicio"  value={fechaInicio} onChange={e => cambiarFechaInicio(e.target.value)} />
                                    <p>-</p>
                                    <input type="date" name="calendarioFiltrosFechaFin" id="calendarioFiltrosFechaFin"  value={fechaFin} onChange={e => cambiarFechaFin(e.target.value)} />
                                </section>
                                <h4>características</h4>
                                {
                                    dataCamping?.results.caracteristicas.map(caracteristica => {
                                        return(
                                            <div key={`caracteristica-${caracteristica.toLowerCase().replaceAll(' ', '')}`} className="filtros__caracteristica">
                                                <label><input type="checkbox" className='checkbox_caracteristica' value={caracteristica} onChange={e => incluirBorrarCaracteristica(e)} /><div><i className="fa-solid fa-check"></i></div></label>
                                                <p>{caracteristica}</p>
                                            </div>
                                        )
                                    })
                                }
                                <h4>conceptos</h4>
                                <div className="filtros__conceptos">
                                    {
                                        conceptosCamping.map(concepto => {
                                            return <Figura id={concepto._id} imagen={concepto.imagen} titulo={concepto.nombre} tipos={conceptos} setTipos={setConceptos} />
                                        })
                                    }
                                </div>
                                <h4>tamaños</h4>
                                <select name="calendarioFiltrosTamanos" id="calendarioFiltrosTamanos" value={tamano} onChange={e => setTamano(e.target.value)}>
                                    <option value="todos">todos</option>
                                    <option value="pequeña">pequeñas</option>
                                    <option value="media">medias</option>
                                    <option value="grande">grandes</option>
                                </select>
                                <button>APLICAR FILTROS</button>
                            </div>
                        </section>
                        <section className='calendario_reservas__calendario'>
                            <section className="calendario_reservas__calendario__leyenda">
                                <div className='fondo-2'></div>
                                <p>reservada</p>
                                <div className='fondo-0'></div>
                                <p>libre</p>
                                <div className='fondo-1'></div>
                                <p>ocupada</p>
                                <div className='fondo-3'></div>
                                <p>último día</p>
                            </section>
                            {
                                loadingZonas ? (
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
                                    zonas?.map(zona => {
                                        return <ZonaParcelas key={zona.zona.nombre} zona={zona} fecha_inicio={fechaInicio} fecha_fin={fechaFin} />
                                    })
                                )
                            }
                        </section>
                    </section>
                )
            }
        </div>
    )
}

function ZonaParcelas ({ zona, fecha_inicio, fecha_fin }) {

    /**
     * Devuelve si el mes de febrero es bisiesto
     * @param {Number} ano 
     * @returns Boolean
     */
    const esBisiesto = (ano) => {
        return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0)
    }

    const meses = [
        { nombre: 'Enero', dias: 31 },
        { nombre: 'Febrero', dias: 28 },
        { nombre: 'Marzo', dias: 31 },
        { nombre: 'Abril', dias: 30 },
        { nombre: 'Mayo', dias: 31 },
        { nombre: 'Junio', dias: 30 },
        { nombre: 'Julio', dias: 31 },
        { nombre: 'Agosto', dias: 31 },
        { nombre: 'Septiembre', dias: 30 },
        { nombre: 'Octubre', dias: 31 },
        { nombre: 'Noviembre', dias: 30 },
        { nombre: 'Diciembre', dias: 31 }
    ]

    const [ dias, setDias ] = useState(new Array())

    useEffect(() => {
        if(new Date(fecha_inicio).getMonth() === new Date(fecha_fin).getMonth()) {
            let dia_inicial = new Date(fecha_inicio).getDate()
            let dia_final = new Date(fecha_fin).getDate()

            let mes = new Date(fecha_inicio).getMonth() + 1

            const dias_ = new Array()

            while(dia_inicial <= dia_final) {
                dias_.push(dia_inicial)
                dia_inicial++
            }

            setDias([ { ano: new Date(fecha_inicio).getFullYear(), mes: (mes < 10 ? `0${mes}` : mes), dias: dias_ } ])
        } else {
            const dias_1 = []
            const dias_2 = []
            const fechas = [new Date(fecha_inicio), new Date(fecha_fin)]

            fechas.forEach((fecha, indice) => {
                let dias_del_mes = ((fecha.getMonth() + 1) === 2) ? (esBisiesto(fecha.getFullYear()) ? 29 : 28) : meses[fecha.getMonth()].dias

                if(indice === 0) {
                    let dia_inicial = fecha.getDate()
                    while(dia_inicial <= dias_del_mes) {
                        dias_1.push(dia_inicial)
                        dia_inicial++
                    }
                } else {
                    let dia_inicial = 1
                    while(dia_inicial <= fecha.getDate()) {
                        dias_2.push(dia_inicial)
                        dia_inicial++
                    }
                }
            })

            let mes_inicio = new Date(fecha_inicio).getMonth() + 1
            let mes_fin = new Date(fecha_fin).getMonth() + 1

            setDias([ { ano: new Date(fecha_inicio).getFullYear(), mes: (mes_inicio < 10 ? `0${mes_inicio}` : mes_inicio), dias: dias_1 }, { ano: new Date(fecha_fin).getFullYear(), mes: (mes_fin < 10 ? `0${mes_fin}` : mes_fin), dias: dias_2 } ])
        }
    }, [fecha_inicio, fecha_fin])

    return(
        <section className="calendario__zona_parcelas">
            <h6>{zona.zona.nombre}</h6>
            <div className="calendario__zona_parcelas__parcelas">
                <section className='calendario__zona_parcelas__parcelas__nombres'>
                    {
                        zona.parcelas.map(parcela => {
                            return <p>{parcela.nombre}</p>
                        })
                    }
                </section>
                <section className='calendario__zona_parcelas__parcelas__dias'>
                    <div className="calendario__zona_parcelas__parcelas__dias__meses">
                        {
                            dias.map(dias_ => {
                                return(
                                    <div className="meses_mes" style={{width: `calc(${dias_.dias.length} * 2.4rem)`}}>
                                        <div></div>
                                        <p>{meses[parseInt(dias_.mes) - 1].nombre}</p>
                                        <div></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="calendario__zona_parcelas__parcelas__dias__dias">
                        {
                            zona.parcelas.map(parcela => {
                                return(
                                    <section className="dias_parcela">
                                        {
                                            dias?.map(dias_ => {
                                                return(
                                                    <div className="dias_parcela__dias">
                                                        {
                                                            dias_.dias.map(dia => {
                                                                return <DiaCuadrado mes={dias_.mes} dia={dia} ano={dias_.ano} parcela={parcela} />
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </section>
                                )
                            })
                        }
                    </div>
                </section>
            </div>
        </section>
    )
}

function DiaCuadrado ({ mes, dia, ano, parcela }) {

    const [ estado, setEstado ] = useState(0) // 0 --> libre; 1 --> ocupada; 2 --> reservada; 3 --> ultimo día; 4 --> último día//reservada; 5 --> último día//ocupada 

    let [ dataParcela ] = useFetch(`${import.meta.env.VITE_API_HOST}estancia/id_parcela/${parcela._id}/fecha/${ano}-${mes}-${(dia < 9) ? `0${dia}` : dia}`)

    useEffect(() => {
        if(dataParcela) {
            if(dataParcela.results.length === 1) {
                if(dataParcela.results[0] === 'libre') setEstado(0)
                else if(dataParcela.results[0] === 'reservada') setEstado(2)
                else if(dataParcela.results[0] === 'fin de reserva hoy') setEstado(3)
                else if(dataParcela.results[0] === 'ocupada') setEstado(1)  
                else if(dataParcela.results[0] === 'salida prevista para hoy') setEstado(3)
            } else {
                if((dataParcela.results.includes('fin de reserva hoy') || dataParcela.results.includes('salida prevista para hoy')) && dataParcela.results.includes('reservada')) setEstado(4)
                else if((dataParcela.results.includes('fin de reserva hoy') || dataParcela.results.includes('salida prevista para hoy')) && dataParcela.results.includes('ocupada')) setEstado(5)
            }
        }
    }, [dataParcela])

    return(
        <div className={`cuadrado_dia fondo-${estado}`}>
            <p>{dia}</p>
        </div>
    )
}