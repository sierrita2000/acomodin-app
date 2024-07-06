import { useContext, useEffect, useState } from 'react'
import './Estado.css'
import { LoginContext } from '../../../context/LoginContext'
import { useFetch } from '../../../hooks/useFetch'
import EstanciaSimple from '../Estancia/EstanciaSimple/EstanciaSimple'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Estado () {

    const loginContext = useContext(LoginContext)

    const navigate = useNavigate()

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() < 10) ? '0' : ''}${fecha.getDate()}`
    }

    const [ fecha, setFecha ] = useState(formatearFecha(new Date()))

    const [ totalParcelas, setTotalParcelas ] = useState(0)
    const [ parcelasOcupadas, setParcelasOcupadas ] = useState(0)

    const [ reservasSinLlegar, setReservasSinLlegar ] = useState(null)
    const [ reservasEnCamping, setReservasEnCamping ] = useState(null)

    let [ dataCamping ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? `acomodador/${loginContext[0][0]}/devolver-camping` : `camping/id/${loginContext[0][0]}`}`)
    
    /**
     * Calcula el total de parcelas del camping
     */
    const totalParcelasCamping = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}parcelas/devolver-parcelas/id_camping/${dataCamping?.results._id}`)
        const data = await response.json()

        if(data.status === 'ok') {
            setTotalParcelas(data.results.length)
        }
    }

    /**
     * Calcula el total de parcelas del camping
     */
    const totalParcelasOcupadasCamping = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}parcelas/ocupadas/id_camping/${dataCamping?.results._id}/fecha/${fecha}`)
        const data = await response.json()

        if(data.status === 'ok') {
            setParcelasOcupadas(data.results)
        }
    }

    /**
     * Busca las reservas de un día que no han llegado al camping
     */
    const calcularReservasDelDia = async () => {
        // Reservas del día
        const responseReservas = await fetch(`${import.meta.env.VITE_API_HOST}estancias/devolver-estancias-filtros/id_camping/${dataCamping?.results._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filtros: { fecha_inicio: fecha }, estado: 'reserva' })
        })
        const dataReservas = await responseReservas.json()

        // Entradas del día
        const responseEntradas = await fetch(`${import.meta.env.VITE_API_HOST}estancias/devolver-estancias-filtros/id_camping/${dataCamping?.results._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filtros: { fecha_inicio: fecha }, estado: 'entrada' })
        })
        const dataEntradas = await responseEntradas.json()

        let reservas_sin_llegar = new Array()
        let reservas_en_camping = new Array()

        if(dataReservas.status != 'error' && dataEntradas.status != 'error') {
            dataReservas.results.forEach(reserva => {
                const entrada = dataEntradas.results.find(entrada => entrada.estancia._id === reserva.estancia._id)
                if(entrada) {
                    reservas_en_camping.push(entrada)
                } else {
                    reservas_sin_llegar.push(reserva)
                }
            })

            setReservasSinLlegar(reservas_sin_llegar)
            setReservasEnCamping(reservas_en_camping)
        }
    }

    /**
     * Actualizar datos
     */
    const actualizarDatosEstado = () => {
        // Calcula el total de parcelas del camping
        totalParcelasCamping()

        // Calcula el total de parcelas ocupadas del camping
        totalParcelasOcupadasCamping()

        // Calcula las reservas del día
        calcularReservasDelDia()
    }

    useEffect(() => {
        if(dataCamping) {
            actualizarDatosEstado()
        }
    }, [dataCamping])

    return(
        <div className="estado">
            <section className="estado__fecha">
                <div>
                    <label htmlFor="estadoFecha">fecha:</label>
                    <input type="date" name="estadoFecha" id="estadoFecha" value={fecha} onChange={e => setFecha(e.target.value)} />
                </div>
                <button onClick={actualizarDatosEstado}>BUSCAR</button>
            </section>
            <section className="estado__parcelas_reservas">
                <section className='estado__parcelas'>
                    <div className="estado__parcelas__caja">
                        <div className="estado__parcelas__caja__imagen">
                            <img src={`${import.meta.env.VITE_API_HOST}static/${dataCamping?.results.imagen}`} alt="LOGO-CAMPING" />
                        </div>
                        <div className="estado__parcelas__caja__campo">
                            <h4>TOTAL PARCELAS</h4>
                            <div className="estado__parcelas__caja__campo__cantidad">
                                {totalParcelas}
                            </div>
                        </div>
                        <div className="estado__parcelas__caja__campo">
                            <h4>PARCELAS OCUPADAS</h4>
                            <div className="estado__parcelas__caja__campo__cantidad">
                                {parcelasOcupadas}
                            </div>
                        </div>
                        <div className="estado__parcelas__caja__campo">
                            <h4>PARCELAS LIBRES</h4>
                            <div className="estado__parcelas__caja__campo__cantidad">
                                {totalParcelas - parcelasOcupadas}
                            </div>
                        </div>
                    </div>
                </section>
                <section className='estado_reservas'>
                    <h2>RESERVAS</h2>
                    <section>
                        <section className="estado_reservas__sin_llegar">
                            <h2>RESERVAS SIN LLEGAR</h2>
                            <div className="estado_reservas__listado">
                                {
                                    (reservasSinLlegar?.length > 0) ? (
                                        reservasSinLlegar.map(reserva => {
                                            return <EstanciaSimple { ...reserva } handlerEstancia={() => { navigate(`/principal/camping/estado/${reserva.estancia_accion._id}`) }} />
                                        })
                                    ) : (
                                        <div className="estado_reservas__listado__vacio">
                                            <p>NO HAY RESERVAS SIN LLEGAR</p>
                                            <img src="../../../../figura-hoguera.png" alt="FIGURA-HOGUERA" />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="estado_reservas__total">
                                <p>TOTAL:</p>
                                <div>{reservasSinLlegar ? reservasSinLlegar.length : 0}</div>
                            </div>
                        </section>
                        <section className="estado_reservas__instaladas">
                            <h2>RESERVAS EN EL CAMPING</h2>
                            <div className="estado_reservas__listado">
                                {
                                    (reservasEnCamping?.length > 0) ? (
                                        reservasEnCamping.map(reserva => {
                                            return <EstanciaSimple { ...reserva } handlerEstancia={() => { navigate(`/principal/camping/estado/${reserva.estancia_accion._id}`) }} />
                                        })
                                    ) : (
                                        <div className="estado_reservas__listado__vacio">
                                            <p>NO HAY RESERVAS QUE HAYAN LLEGADO</p>
                                            <img src="../../../../figura-hoguera.png" alt="FIGURA-HOGUERA" />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="estado_reservas__total">
                                <p>TOTAL:</p>
                                <div>{reservasEnCamping ? reservasEnCamping.length : 0}</div>
                            </div>
                        </section>
                    </section>
                </section>
            </section>
            <Outlet />
        </div>
    )
}