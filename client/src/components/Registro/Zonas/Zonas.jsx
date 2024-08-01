import { useEffect, useState } from 'react'
import './Zonas.css'
import Zona from './Zona/Zona'

export default function Zonas ( props ) {
    const [ guardar, setGuardar ] = useState(false)

    const guardarCambios = () => {
        setGuardar(true)
        setTimeout(() => setGuardar(false), 1000)
    }

    const crearNuevaZona = () => {
        const id_zona = props.zonas[props.zonas.length - 1].id + 1

        const objZona = {
            id: id_zona,
            nombre: '',
            tipos: [],
            parcelas: []
        }

        props.setZonas(props.zonas.concat(objZona))
    }

    useEffect(() => {
        guardarCambios()
    }, [props.zonas])

    return(
        <div className="zonas">
            <div className="zonas__zonas">
                <div className="zonas__zonas__raya"></div>
                <p>¡ES MUY IMPORTANTE GUARDAR LOS CAMBIOS ANTES DE PASAR O RETROCEDER ALGÚN PASO!</p>
                <div className='zonas__zonas__lista'>
                    {
                        props?.zonas.map(zona => {
                            return <Zona key={zona.id} guardar={guardar} { ...zona } tiposCamping={props?.tipos} setZonas={props.setZonas} zonas={props.zonas} handleGuardarCambios={guardarCambios} caracteristicasCamping={props.caracteristicas} luzCamping={props.luzCamping} />
                        })
                    }
                    <div className="zonas__zonas__lista__boton_anadir">
                        <button onClick={crearNuevaZona}><i className="fa-solid fa-plus"></i></button>
                        <p>añadir zona</p>
                    </div>
                </div>
            </div>
            <div className="zonas__imagen">
                <img src="/figura-bungalow-cesped.png" alt="FIGURA-BUNGALOW" />
                <button onClick={guardarCambios}><p>GUARDAR CAMBIOS</p>{ guardar && <div><i className="fa-solid fa-thumbs-up"></i></div> }</button>
            </div>
        </div>
    )
}