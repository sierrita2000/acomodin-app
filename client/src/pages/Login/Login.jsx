import { useContext, useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../../context/LoginContext'

export default function Login() {

    const [ tipoUsuario, setTiposUsuario ] = useState(0) // 0 --> acomodador, 1 --> camping

    const navigate = useNavigate()

    const loginContext = useContext(LoginContext)

    /**
     * Evento del icono ojo para poder cambiar el input de la contraseña de password a text.
     * @param {Event} e 
     */
    const verPassword = (e) => {
        e.preventDefault()

        const icono_ojo = e.target
        const input_password = document.getElementById("login_password")
        const tipo = input_password.getAttribute('type') === 'password' ? 'text' : 'password'
        
        icono_ojo.classList.toggle('fa-eye-slash')
        icono_ojo.classList.toggle('fa-eye')

        input_password.setAttribute('type', tipo)
    }

    /**
     * Controla el inicio de sesión de un usuario.
     */
    const loginUsuario = async (e) => {
        e.preventDefault()
        
        const usuario = document.getElementById('login_usuario')
        const password = document.getElementById('login_password')
    
        const response = await fetch(`${import.meta.env.VITE_API_HOST}${tipoUsuario === 0 ? `acomodadores/usuario/${usuario.value}/password/${password.value}` : `camping/usuario/${usuario.value}/password/${password.value}`}`)
        const data = await response.json()
    
        if (data.status === 'ok') {
            loginContext[1]([data.results._id, tipoUsuario])
            navigate('/principal/calendario-reservas')
        } else {
            alert(data.message)
        }
    }

    return(
        <section className="login">
            <section className="login__izq">
                <img src="../../figura-logo-circulo.png" alt="LOGO" />
                <h1>ACOMODIN</h1>
                <div className="login__izq__formulario">
                    <img src="../../logo.png" alt="LOGO" />
                    <p>¿Quién va a iniciar sesión?</p>
                    <div>
                        <button className={`button_login ${tipoUsuario === 0 && 'button_activado'}`} onClick={() => setTiposUsuario(0)}>ACOMODADOR</button>
                        <button className={`button_login ${tipoUsuario === 1 && 'button_activado'}`} onClick={() => setTiposUsuario(1)}>CAMPING</button>
                    </div>
                    <form>
                        <div className="login__form__usuario">
                            <input type="text" name="login_usuario" id="login_usuario" />
                            <label htmlFor="login_usuario">usuario</label>
                        </div>
                        <div className="login__form__password">
                            <input type="password" name="login_password" id="login_password" />
                            <label htmlFor="login_password">contraseña</label>
                            <button onClick={e => verPassword(e)}><i className="fa-solid fa-eye-slash"></i></button>
                        </div>
                        <button onClick={e => loginUsuario(e)} className='login__btn__iniciar' type="submit">INICIAR</button>
                    </form>
                </div>
            </section>
            <section className="login__der">
                <div>
                    <h2>Crea desde aquí la cuenta de tu camping</h2>
                    <a href='/registro-camping'>REGISTRATE</a>
                    <p>¿Aún no tienes cuenta?<br/><br/>Si eres acomodador deberás de pedirle al daministrador de tu camping que te cree una cuenta y acceder desde esta misma página.<br/><br/>Si por otro lado, quieres registrar tu camping, puedes hacerlo a través del botón de arriba.</p>
                    <img src="../../camper-artistica.png" alt="CAMPER-ARTISTICA" />
                </div>
            </section>
        </section>
    )
}