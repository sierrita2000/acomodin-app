import { useState } from 'react'
import './Registro.css'

export default function Registro () {

    const pasos = [ "Datos del camping", "Parcelas", "Zonas", "Acomodadores", "Resumen" ]

    const [ paso, setPaso ] = useState(pasos[0])

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
            <div className="registro__outlet">
                {/* Renderizado condicional --> Cada componente de paso */}
            </div>
            <div className="registro__botones">
                <button>anterior</button>
                <button>siguiente</button>
                <button>finalizar</button>
            </div>
        </div>
    )
}