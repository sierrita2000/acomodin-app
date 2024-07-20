import { useContext, useState } from 'react'
import './PanelPassword.css'
import { LoginContext } from '../../../../context/LoginContext'
import { useNavigate } from 'react-router-dom'
import Mensaje from '../../../Mensaje/Mensaje'

export default function PanelPassword () {

    const [ error, setError ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const [ mensaje, setMensaje ] = useState(null)

    const loginContext = useContext(LoginContext)

    const navigate = useNavigate()

    /**
     * Cambia el input de tipo password a text y al revés.
     * @param {Event} e 
     * @param {Number} input 
     */
    const verPassword = (e, input) => {
        e.preventDefault()

        const btn_ojo = e.target
        const input_password = (input === 0) ? document.getElementById('perfil_password') : document.getElementById('perfil_password_repeat')
        
        const tipo = input_password.getAttribute('type') === 'password' ? 'text' : 'password'

        btn_ojo.classList.toggle('fa-eye-slash')
        btn_ojo.classList.toggle('fa-eye')
        input_password.setAttribute('type', tipo)
    }

    /**
     * Almacena en la BBDD la nueva contraseña.
     * @param {Event} e 
     */
    const guardarPassword = async (e) => {
        e.preventDefault()

        const input_password = document.getElementById('perfil_password')
        const input_password_repeat = document.getElementById('perfil_password_repeat')

        if (input_password.value != input_password_repeat.value) {
            setError('Las contraseñas no coinciden')
        } else {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodadores/' : 'camping/'}actualizar-password/id/${loginContext[0][0]}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ new_password: input_password.value })
            })
            const data = await response.json()
            
            setLoading(false)

            const obj_mensaje = new Object()
            obj_mensaje.accionAceptar = () => { setMensaje(null); navigate('..', { replace: true }) }

            if (data.status === 'ok') {
                obj_mensaje.mensaje = data.message
                obj_mensaje.warning = false
            } else {
                obj_mensaje.mensaje = 'No se ha podido actualizar la contraseña. Intentelo más tarde'
                obj_mensaje.warning = true
            }

            setMensaje(obj_mensaje)
        }
    }

    return(
        <div className="panel_password">
            <div className="panel_password__modal">
                <button onClick={() => navigate('..')} className="panel_password__modal__cerrar_btn"><i className="fa-solid fa-xmark"></i></button>
                <form>
                    <div className="panel_password__modal__campos__campo">
                        <label htmlFor="perfil_password">Nueva contraseña:</label>
                        <input type="password" name="perfil_password" id="perfil_password" />
                        <button onClick={e => verPassword(e, 0)}><i className="fa-solid fa-eye-slash"></i></button>
                    </div>
                    <div className="panel_password__modal__campos__campo">
                        <label htmlFor="perfil_password_repeat">Repita la nueva contraseña:</label>
                        <input type="password" name="perfil_password_repeat" id="perfil_password_repeat" />
                        <button onClick={e => verPassword(e, 1)}><i className="fa-solid fa-eye-slash"></i></button>
                    </div>
                    { error && <p className='panel_password__modal__error'>*{error}</p> }
                    <button onClick={e => guardarPassword(e)} type="submit">GUARDAR CONTRASEÑA</button>
                </form>
            </div>
            {
                    loading && (
                        <div className="panel_password__guardando">
                            <div className="dot-spinner">
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div> 
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                            </div>
                        </div>
                    )
            }
            {
                mensaje && <Mensaje mensaje={mensaje.mensaje} accionAceptar={mensaje.accionAceptar} warning={mensaje.warning} />
            }
        </div>
    )
}