import { useState } from 'react'
import './Registro.css'
import DatosCamping from '../../components/Registro/Datos-camping/DatosCamping'
import Parcelas from '../../components/Registro/Parcelas/Parcelas'
import Zonas from '../../components/Registro/Zonas/Zonas'

export default function Registro () {

    const pasos = [ "Datos del camping", "Parcelas", "Zonas", "Acomodadores", "Resumen" ]

    const [ paso, setPaso ] = useState(pasos[0])

    /* Atributos Datos camping */
    const [ imagen, setImagen ] = useState("")
    const [ usuario, setUsuario ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ correo, setCorreo ] = useState("")
    const [ nombre, setNombre ] = useState("")

    /* Atributos Parcelas */
    const [ pequenaAncho, setPequenaAncho ] = useState(0)
    const [ pequenaLargo, setPequenaLargo ] = useState(0)
    const [ mediaAncho, setMediaAncho ] = useState(0)
    const [ mediaLargo, setMediaLargo ] = useState(0)
    const [ grandeAncho, setGrandeAncho ] = useState(0)
    const [ grandeLargo, setGrandeLargo ] = useState(0)

    const [ tipos, setTipos ] = useState(new Array())

    const [ conceptosGenerales, setConceptosGenerales ] = useState(new Array())

    const [ caracteristicas, setCaracteristicas ] = useState(['cerca del baño', 'sombra', 'vistas mar', 'parking cerca'])

    /* Atributos zonas */

    const [ zonas, setZonas ] = useState([ { id: 0, nombre: '', tipos: [], parcelas: [] } ])

    return(
        <div className="registro">
            <div className="registro__cabecera">
                <img src="../../figura-logo-circulo.png" alt="LOGO-ACOMODIN" />
                <h1>ACOMODIN</h1>
                <div className="registro__cabecera__pasos">
                    <div className={`pasos__paso ${paso === pasos[0] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[0]} onClick={(e) => setPaso(e.target.value)}>{pasos[0]}</button></div>
                    <div className={`pasos__paso ${paso === pasos[1] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[1]} onClick={(e) => setPaso(e.target.value)}>{pasos[1]}</button></div>
                    <div className={`pasos__paso ${paso === pasos[2] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[2]} onClick={(e) => setPaso(e.target.value)}>{pasos[2]}</button></div>
                    <div className={`pasos__paso ${paso === pasos[3] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[3]} onClick={(e) => setPaso(e.target.value)}>{pasos[3]}</button></div>
                    <div className={`pasos__paso ${paso === pasos[4] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[4]} onClick={(e) => setPaso(e.target.value)}>{pasos[4]}</button></div>
                </div>
            </div>
            <div className="registro__pasos">
                { paso === pasos[0] && <DatosCamping imagen={imagen} setImagen={setImagen} usuario={usuario} setUsuario={setUsuario} password={password} setPassword={setPassword} correo={correo} setCorreo={setCorreo} nombre={nombre} setNombre={setNombre} /> } 
                { paso === pasos[1] && <Parcelas pequenaAncho={pequenaAncho} setPequenaAncho={setPequenaAncho} mediaAncho={mediaAncho} setMediaAncho={setMediaAncho} grandeAncho={grandeAncho} setGrandeAncho={setGrandeAncho} pequenaLargo={pequenaLargo} setPequenaLargo={setPequenaLargo} mediaLargo={mediaLargo} setMediaLargo={setMediaLargo} grandeLargo={grandeLargo} setGrandeLargo={setGrandeLargo} tipos={tipos} setTipos={setTipos} conceptosGenerales={conceptosGenerales} setConceptosGenerales={setConceptosGenerales} caracteristicas={caracteristicas} setCaracteristicas={setCaracteristicas} /> }
                { paso === pasos[2] && <Zonas zonas={zonas} setZonas={setZonas} tipos={tipos} caracteristicas={caracteristicas} luzCamping={conceptosGenerales.includes('electricidad')} /> }
            </div>
            <div className="registro__botones">
                { paso != pasos[0] && <button className='registro__botones__boton' onClick={() => setPaso(pasos[pasos.indexOf(paso) - 1])}>anterior</button> }
                { paso != pasos[4] && <button className='registro__botones__boton' onClick={() => setPaso(pasos[pasos.indexOf(paso) + 1])}>siguiente</button> }
                { paso === pasos[4] && <button className='registro__botones__boton'>finalizar</button> }
            </div>
        </div>
    )
}