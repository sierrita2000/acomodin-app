import { useState } from 'react'
import './RegistroActividad.css'

export default function RegistroActividad () {

    /**
     * Formatea la fecha de hoy
     * @returns String
     */
    const formatearFecha = (fecha) => {
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1 < 10) ? '0' : ''}${fecha.getMonth() + 1}-${(fecha.getDate() + 1 < 10) ? '0' : ''}${fecha.getDate()}`
    }

    const [ fecha, setFecha ] = useState(formatearFecha(new Date()))
    const [ estado, setEstado ] = useState('todos')

    return(
        <div className="registro_actividad">
            <div className="registro_actividad__filtros">
                <section>
                    <div className="filtros__fecha">
                        <label htmlFor="filtrosFecha">fecha:</label>
                        <input type="date" name="filtrosFecha" id="filtrosFecha" value={fecha} onChange={e => setFecha(e.target.value)} />
                    </div>
                    <div className="filtros__estado">
                        <label htmlFor="filtrosEstado">estado:</label>
                        <select name="filtrosEstado" id="filtrosEstado">
                            <option value="todos" selected>todos</option>
                            <option value="entrada">entrada</option>
                            <option value="reserva">reserva</option>
                            <option value="salida">salida</option>
                        </select>
                    </div>
                </section>
                <button className='filtros__boton'>APLICAR FILTROS</button>
            </div>
        </div>
    )
}