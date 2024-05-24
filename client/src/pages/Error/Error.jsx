import './Error.css'
import { useRouteError } from "react-router-dom"

export default function Error () {

    const error = useRouteError()
    console.error(error)

    return(
        <div className="error">
            <div className="error__dibujo">
                <p>4</p>
                <img src="../../figura-hoguera.png" alt="FIGURA-HOGUERA" />
                <p>4</p>
            </div>
            <h1>Opssss!, Página no encontrada</h1>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <a href="/">Volver al inicio</a>
        </div>
    )
}