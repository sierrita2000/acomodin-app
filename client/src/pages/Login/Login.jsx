import './Login.css'

export default function Login() {

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

    return(
        <section className="login">
            <section className="login__izq">
                <img src="../../figura-logo-circulo.png" alt="LOGO" />
                <h1>ACOMODIN</h1>
                <div className="login__izq__formulario">
                    <img src="../../logo.png" alt="LOGO" />
                    <form>
                        <div className="login__form__usuario">
                            <input type="text" name="login_usuario" id="login_usuario" minLength={1} />
                            <label htmlFor="login_usuario">usuario</label>
                        </div>
                        <div className="login__form__password">
                            <input type="password" name="login_password" id="login_password" minLength={1} />
                            <label htmlFor="login_password">contraseña</label>
                            <button onClick={e => verPassword(e)}><i className="fa-solid fa-eye-slash"></i></button>
                        </div>
                        <button className='login__btn__iniciar' type="submit">INICIAR</button>
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