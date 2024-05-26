import { useState } from 'react'
import './Zonas.css'

export default function Zonas () {

    const [ dividir, setDividir ] = useState(false)

    return(
        <div className="zonas">
            <div className="zonas__zonas">
                <div>
                    <p>¿Quieres dividir tu camping por zonas?</p>
                    <label class="toggle-switch">
                        <input type="checkbox" onChange={() => setDividir(!dividir)} />
                        <div class="toggle-switch-background">
                            <div class="toggle-switch-handle"></div>
                        </div>
                    </label>
                </div>
                <div className="zonas__zonas__raya"></div>
            </div>
            <div className="zonas__imagen">
                <img src="../../../figura-bungalow-cesped.png" alt="FIGURA-BUNGALOW" />
            </div>
        </div>
    )
}