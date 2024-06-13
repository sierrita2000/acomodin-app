import './Error.css'
import { useRouteError } from "react-router-dom"

export default function Error (props) {

    const error = useRouteError()
    console.error(error)

    return(
        <div className="error">
            <div className="error__dibujo">
                <p>{props.primerNumero}</p>
                <img src="../../figura-hoguera.png" alt="FIGURA-HOGUERA" />
                <p>{props.segundoNumero}</p>
            </div>
            <h1>{props.mensaje}</h1>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <a href={props.ruta}>{props.textoBoton}</a>
        </div>
    )
}