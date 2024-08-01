import { useState } from 'react'
import './Finalizar.css'
import { Link, useNavigate } from 'react-router-dom'

export default function Finalizar ( props ) {

    const [ cargando, setCargando ] = useState(false)
    const [ error, setError ] = useState(null)

    const navigate = useNavigate()

    const registrarCamping = async () => {
        setCargando(true)

        const formDataCamping = new FormData()
        formDataCamping.append('imagenCamping', props.imagenCamping)
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
                setError([dataZonas, "Zonas"])
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
                setError([dataAcomodadores, "Acomodadores"])
                setCargando(false)
            }

            if (dataZonas.status === 'ok' && dataAcomodadores.status === 'ok') {
                setCargando(false)
                props.setProcesoFinalizado(true)
                navigate('/registro-camping/completado')
            }
        } else {
            setCargando(false)
            setError([dataCamping, "Datos del camping"])
        }
    }

    const handleError = (paso) => {
        setError(null)
        props.setPaso(paso)
    }

    return(
        <div className="finalizar">
            <img src="/figura-carro-cesped.png" alt="FIGURA-CARRO-TIENDA" />
            <p>Para terminar de registrar tu cuenta de camping pulsa el botón de "Finalizar"</p>
            <button onClick={registrarCamping}>
                {
                    cargando ? (
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
                        'FINALIZAR'
                    )
                }
            </button>
            { error && (
                <div className='finalizar__error'>
                    <div className="finalizar__error__modal">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <p>Error al registrar tu camping</p>
                        <p>{error[0].message}</p>
                        <button onClick={() => handleError(error[1])} className='finalizar__error__link'>ACEPTAR</button>
                    </div>
                </div>
            )}
        </div>
    )
}