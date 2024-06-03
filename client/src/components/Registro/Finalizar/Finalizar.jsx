import { useState } from 'react'
import './Finalizar.css'

export default function Finalizar ( props ) {

    const [ cargando, setCargando ] = useState(false)
    const [ error, setError ] = useState(null)

    const registrarCamping = async () => {
        setCargando(true)

        const formDataCamping = new FormData()
        formDataCamping.append('logoCamping', props.logoCamping)
        formDataCamping.append('datosCamping', JSON.stringify(props.datosCamping))
        formDataCamping.append('tamanos', props.tamanos)
        formDataCamping.append('tipos', props.tipos)
        formDataCamping.append('caracteristicas', props.caracteristicas)

        const responseCamping = await fetch(`${import.meta.env.VITE_API_HOST}camping/registrar-camping`, {
            method: 'POST',
            body: formDataCamping
        })
        const dataCamping = await responseCamping.json()

        if (dataCamping.status === 'ok') {
            const id_camping = dataCamping.results._id
            const nombre_camping = dataCamping.results.nombre

            // Creando zonas y parcelas

            const responseZonas = await fetch(`${import.meta.env.VITE_API_HOST}zonas/registrar-zonas`, {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "zonas": props.zonas,
                    "id_camping": id_camping
                })
            })
            const dataZonas = await responseZonas.json()

            if (dataZonas.status != 'ok') {
                setError(dataZonas.results)
                setCargando(false)
            }

            // Creando acomodadores
            const responseAcomodadores = await fetch(`${import.meta.env.VITE_API_HOST}acomodadores/registrar-acomodadores`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "acomodadores": props.acomodadores,
                    "id_camping": id_camping,
                    "nombre_camping": nombre_camping
                })
            })
            const dataAcomodadores = await responseAcomodadores.json()

            if (dataAcomodadores.status != 'ok') {
                setError(dataAcomodadores.results)
                setCargando(false)
            }

            if (dataZonas.status === 'ok' && dataAcomodadores.status === 'ok') {
                setCargando(false)
                props.setProcesoFinalizado(true)
            }
        }
    }

    return(
        <div className="finalizar">
            <img src="../../../figura-carro-cesped.png" alt="FIGURA-CARRO-TIENDA" />
            <p>Para terminar de registrar tu cuenta de camping pulsa el botón de "Finalizar"</p>
            <button onClick={registrarCamping}>FINALIZAR</button>
        </div>
    )
}