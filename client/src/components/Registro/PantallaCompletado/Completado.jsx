import { Link, useOutletContext } from 'react-router-dom'
import './Completado.css'

export default function Completado () {

    const [ nombre ] = useOutletContext()

    return(
        <div className="completado">
            <h1>¡Enhorabuena!</h1>
            <img src="../../../figura-logo-circulo.png" alt="LOGO-ACOMODIN" />
            <h4>Los datos de "{nombre}" han sido registrados correctamente</h4>
            <p>Empieza a usar nuestros servicios</p>
            <Link className='completado__link' to={"/login"}>INICIAR SESIÓN</Link>
        </div>
    )
}