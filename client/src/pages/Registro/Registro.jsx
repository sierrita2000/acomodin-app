import { useState } from 'react'
import './Registro.css'
import DatosCamping from '../../components/Registro/Datos-camping/DatosCamping'
import Parcelas from '../../components/Registro/Parcelas/Parcelas'
import Zonas from '../../components/Registro/Zonas/Zonas'
import Acomodadores from '../../components/Registro/Acomodadores/Acomodadores'
import Finalizar from '../../components/Registro/Finalizar/Finalizar'

export default function Registro () {

    const pasos = [ "Datos del camping", "Parcelas", "Zonas", "Acomodadores", "Finalizar" ]

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

    /* Atributos acomodadores */

    const [ acomodadores, setAcomodadores ] = useState([{ id: 1, correo: "", nombre: "" }])

    const pasoDatosCampingCorrecto = () => {
        if (usuario && password && correo && nombre) {
            return true
        } 

        alert("Los campos de usuario, contraseña, correo y nombre del camping son obligatorios.")
        return false
    }

    const pasoParcelasCorrecto = () => {
        if (tipos.length >= 1) {
            return true
        }

        alert("Debes seleccionar al menos un tipo de acomodación para tu camping.")
        return false
    }

    const pasoZonasCorrecto = () => {
        let resultado = true
        let mensaje = ""
        zonas.forEach(zona => {
            if(zona.nombre === '' || zona.tipos.length < 1) {
                mensaje = "Cada zona debe tener un nombre y al menos un tipo de acomodación."
                resultado = false
            } else {
                if (zona.parcelas.length < 1) {
                    mensaje = "Debe de haber mínimo una parcela por zona."
                    resultado = false
                } else {
                    zona.parcelas.forEach(parcela => {
                        if (parcela.nombre === '' || parcela.tipos.length < 1) {
                            mensaje = "Cada parcela debe tener un nombre y al menos un tipo de acomodación."
                            resultado = false
                        }
                    })
                }
            }
        })
        
        !resultado && alert(mensaje + " Recuerda guardar los cambios")
        return resultado
    }

    const pasoAcomodadoresCorrecto = () => {
        let resultado = true
        let mensaje = ""
        acomodadores.forEach(acomodador => {
            if(acomodador.correo === '' || acomodador.nombre === '') {
                mensaje = "Debes rellenar los campos nombre y correo de todos los acomodadores que crees."
                resultado = false
            }
        })
        
        !resultado && alert(mensaje + " Recuerda guardar los cambios")
        return resultado
    }

    const comprobarSiguientePaso = (nextPaso) => {
        if (nextPaso < pasos.indexOf(paso)) {
            return true
        } else {
            switch (nextPaso) {
                case 1:
                    return pasoDatosCampingCorrecto()
                case 2:
                    if (pasoDatosCampingCorrecto()) {
                        return pasoParcelasCorrecto()
                    }
                    return false
                case 3:
                    if (pasoDatosCampingCorrecto()) {
                        if(pasoParcelasCorrecto()) {
                            return pasoZonasCorrecto()
                        }
                    }
                    return false
                case 4:
                    if (pasoDatosCampingCorrecto()) {
                        if(pasoParcelasCorrecto()) {
                            if(pasoZonasCorrecto()) {
                                return pasoAcomodadoresCorrecto()
                            }
                        }
                    }
                    return false
                default:
                    break;
            }
        }
    }

    return(
        <div className="registro">
            <div className="registro__cabecera">
                <img src="../../figura-logo-circulo.png" alt="LOGO-ACOMODIN" />
                <h1>ACOMODIN</h1>
                <div className="registro__cabecera__pasos">
                    <div className={`pasos__paso ${paso === pasos[0] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[0]} onClick={(e) => setPaso(e.target.value)}>{pasos[0]}</button></div>
                    <div className={`pasos__paso ${paso === pasos[1] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[1]} onClick={(e) => comprobarSiguientePaso(1) && setPaso(e.target.value)}>{pasos[1]}</button></div>
                    <div className={`pasos__paso ${paso === pasos[2] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[2]} onClick={(e) => comprobarSiguientePaso(2) && setPaso(e.target.value)}>{pasos[2]}</button></div>
                    <div className={`pasos__paso ${paso === pasos[3] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[3]} onClick={(e) => comprobarSiguientePaso(3) && setPaso(e.target.value)}>{pasos[3]}</button></div>
                    <div className={`pasos__paso ${paso === pasos[4] && 'pasos__paso__activo'}`}><button className='pasos__paso__boton' value={pasos[4]} onClick={(e) => comprobarSiguientePaso(4) && setPaso(e.target.value)}>{pasos[4]}</button></div>
                </div>
            </div>
            <div className="registro__pasos">
                { paso === pasos[0] && <DatosCamping imagen={imagen} setImagen={setImagen} usuario={usuario} setUsuario={setUsuario} password={password} setPassword={setPassword} correo={correo} setCorreo={setCorreo} nombre={nombre} setNombre={setNombre} /> } 
                { paso === pasos[1] && <Parcelas pequenaAncho={pequenaAncho} setPequenaAncho={setPequenaAncho} mediaAncho={mediaAncho} setMediaAncho={setMediaAncho} grandeAncho={grandeAncho} setGrandeAncho={setGrandeAncho} pequenaLargo={pequenaLargo} setPequenaLargo={setPequenaLargo} mediaLargo={mediaLargo} setMediaLargo={setMediaLargo} grandeLargo={grandeLargo} setGrandeLargo={setGrandeLargo} tipos={tipos} setTipos={setTipos} conceptosGenerales={conceptosGenerales} setConceptosGenerales={setConceptosGenerales} caracteristicas={caracteristicas} setCaracteristicas={setCaracteristicas} /> }
                { paso === pasos[2] && <Zonas zonas={zonas} setZonas={setZonas} tipos={tipos} caracteristicas={caracteristicas} luzCamping={conceptosGenerales.includes('electricidad')} /> }
                { paso === pasos[3] && <Acomodadores acomodadores={acomodadores} setAcomodadores={setAcomodadores} /> }
                { paso === pasos[4] && <Finalizar /> }
            </div>
            <div className="registro__botones">
                { paso != pasos[0] && <button className='registro__botones__boton' onClick={() => setPaso(pasos[pasos.indexOf(paso) - 1])}>anterior</button> }
                { paso != pasos[4] && <button className='registro__botones__boton' onClick={() => comprobarSiguientePaso(pasos.indexOf(paso) + 1) && setPaso(pasos[pasos.indexOf(paso) + 1])}>siguiente</button> }
            </div>
        </div>
    )
}