import { useRef } from 'react'
import './Figura.css'

export default function Figura ({ imagen, titulo, tipos, setTipos }) {

    const imagenRef = useRef(null)

    const clickTipo = () => {
        let copia_tipos = tipos
        // const figura = document.getElementById(`img_figura_${titulo}`)

        imagenRef.current.classList.toggle('figura__imagen__activada')

        if (tipos.includes(titulo)) {
            copia_tipos.splice(tipos.indexOf(titulo), 1)
            setTipos(copia_tipos)
        } else {
            copia_tipos.push(titulo)
            setTipos(copia_tipos)
        }
    }

    return(
        <div ref={imagenRef} id={`img_figura_${titulo}`} className={`figura ${tipos.includes(titulo) && 'figura__imagen__activada'}`} onClick={clickTipo}>
            <img className='figura__imagen' src={imagen} alt={`FIGURA-${titulo.toUpperCase()}`} />
            <h6>{titulo.toUpperCase()}</h6>
            <div className='figura__check'><i className="fa-solid fa-check"></i></div>
        </div>
    )
}