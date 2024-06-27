import './Mensaje.css'

export default function Mensaje ({ mensaje, accionCancelar, accionAceptar }) {

    return(
        <div className="mensaje">
            <div className="mensaje__modal">
                <div><button className='boton_cancelar' onClick={accionCancelar}><i className="fa-solid fa-xmark"></i></button></div>
                <div><p>{mensaje}</p></div>
                <div className="mensaje__modal__botones">
                    <button className='boton_cancelar' onClick={accionCancelar}>CANCELAR</button>
                    <button onClick={accionAceptar}>ACEPTAR</button>
                </div>
            </div>
        </div>
    )
}