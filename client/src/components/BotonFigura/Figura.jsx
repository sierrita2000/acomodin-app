import { useRef } from 'react'
import './Figura.css'

export default function Figura ({ id, imagen, titulo, tipos, setTipos }) {

    const imagenRef = useRef(null)

    const clickTipo = () => {
        let copia_tipos = tipos
        // const figura = document.getElementById(`img_figura_${titulo}`)

        imagenRef.current.classList.toggle('figura__imagen__activada')

        if (tipos.includes(id)) {
            copia_tipos.splice(tipos.indexOf(id), 1)
            setTipos(copia_tipos)
        } else {
            copia_tipos.push(id)
            setTipos(copia_tipos)
        }
    }

    return(
        <div ref={imagenRef} id={`img_figura_${titulo}`} className={`figura ${tipos.includes(id) && 'figura__imagen__activada'}`} onClick={clickTipo}>
            <img className='figura__imagen' src={`${import.meta.env.VITE_API_HOST}static/${imagen}`} alt={`FIGURA-${titulo.toUpperCase()}`} />
            <h6>{titulo.toUpperCase()}</h6>
            <div className='figura__check'><i className="fa-solid fa-check"></i></div>
        </div>
    )
}