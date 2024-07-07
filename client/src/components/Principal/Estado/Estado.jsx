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

    const [ entradas, setEntradas ] = useState(null)

    const [ salidasSinSalir, setSalidasSinSalir ] = useState(null)
    const [ salidasRegistradas, setSalidasRegistradas ] = useState(null)

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
     * Calcula el total de parcelas del camping ocupadas actualmente
     */
    const totalParcelasOcupadasCamping = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}parcelas/ocupadas/id_camping/${dataCamping?.results._id}/fecha/${fecha}`)
        const data = await response.json()

        if(data.status === 'ok') {
            setParcelasOcupadas(data.results)
        }
    }

    /**
     * Devuelve las reservas y entradas del día
     * @returns Promise
     */
    const devolverReservasYEntradasDelDia = async () => {
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

        return Promise.all([dataReservas, dataEntradas])
    }

    /**
     * Busca las reservas de un día que no han llegado al camping
     */
    const calcularReservasDelDia = async () => {
        const [ dataReservas, dataEntradas ] = await devolverReservasYEntradasDelDia()

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
     * Busca las entradas del día
     */
    const calcularEntradasDelDia = async () => {
        const [ dataReservas, dataEntradas ] = await devolverReservasYEntradasDelDia()

        let entradas = new Array()

        if(dataReservas.status != 'error' && dataEntradas.status != 'error') {
            dataEntradas.results.forEach(entrada => {
                if(!dataReservas.results.find(reserva => reserva.estancia._id === entrada.estancia._id)) {
                    entradas.push(entrada)
                }
            })

            setEntradas(entradas)
        }
    }

    /**
     * Calcula las salidas del día
     */
    const calcularSalidas = async () => {
        const responseSalidasTotal = await fetch(`${import.meta.env.VITE_API_HOST}estancias/devolver-estancias-filtros/id_camping/${dataCamping?.results._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filtros: { fecha_fin: fecha }, estado: 'entrada' })
        })
        const dataSalidasTotal = await responseSalidasTotal.json()

        const responseSalidasRegistradas = await fetch(`${import.meta.env.VITE_API_HOST}estancias/devolver-estancias-filtros/id_camping/${dataCamping?.results._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filtros: { fecha_fin: fecha }, estado: 'salida' })
        })
        const dataSalidasRegistradas = await responseSalidasRegistradas.json()

        if(dataSalidasTotal.status != 'error' && dataSalidasRegistradas.status != 'error') {
            let salidas_sin_registrar = new Array()
            let salidas_registradas = new Array()

            console.log(dataSalidasTotal, dataSalidasRegistradas)

            dataSalidasTotal.results.forEach(estancia => {
                const salida = dataSalidasRegistradas.results.find(salida => salida.estancia._id === estancia.estancia._id)
                if(salida) {
                    salidas_registradas.push(salida)
                } else {
                    salidas_sin_registrar.push(estancia)
                }
            })

            setSalidasSinSalir(salidas_sin_registrar)
            setSalidasRegistradas(salidas_registradas)
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

        // Calcula las entradas del día
        calcularEntradasDelDia()

        // Calcula las salidas del día
        calcularSalidas()
    }

    useEffect(() => {
        if(dataCamping) actualizarDatosEstado()
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
                        <EstadoEstancias titulo={'RESERVAS SIN LLEGAR'} texto_estancias_vacias={'NO HAY RESERVAS SIN LLEGAR'} estancias={reservasSinLlegar} />
                        <EstadoEstancias titulo={'RESERVAS EN EL CAMPING'} texto_estancias_vacias={'NO HAY RESERVAS QUE HAYAN LLEGADO'} estancias={reservasEnCamping} />
                    </section>
                </section>
            </section>
            <section className="estado__salidas_entradas">
                <section className='estado_entradas'>
                    <EstadoEstancias titulo={'ENTRADAS'} texto_estancias_vacias={'NO HAY ENTRADAS'} estancias={entradas} />
                </section>
                <section className='estado_reservas'>
                    <h2>SALIDAS</h2>
                    <section>
                        <EstadoEstancias titulo={'SALIDAS SIN REGISTRAR'} texto_estancias_vacias={'NO HAY SALIDAS PREVISTAS PARA EL DÍA'} estancias={salidasSinSalir} />
                        <EstadoEstancias titulo={'SALIDAS REGISTRADAS'} texto_estancias_vacias={'NO HAY SALIDAS REGISTRADAS'} estancias={salidasRegistradas} />
                    </section>
                </section>
            </section>
            <Outlet />
        </div>
    )
}

function EstadoEstancias ({ titulo, texto_estancias_vacias, estancias }) {

    return(
            <section className="estado_estancias">
                <h2>{titulo}</h2>
                <div className="estado_estancias__listado">
                    {
                        (estancias?.length > 0) ? (
                            estancias.map(estancia => {
                                return <EstanciaSimple { ...estancia } handlerEstancia={() => { navigate(`/principal/camping/estado/${estancia.estancia_accion._id}`) }} />
                            })
                        ) : (
                            <div className="estado_estancias__listado__vacio">
                                <p>{texto_estancias_vacias}</p>
                                <img src="../../../../figura-hoguera.png" alt="FIGURA-HOGUERA" />
                            </div>
                        )
                    }
                </div>
                <div className="estado_estancias__total">
                    <p>TOTAL:</p>
                    <div>{estancias ? estancias.length : 0}</div>
                </div>
            </section>
    )
}