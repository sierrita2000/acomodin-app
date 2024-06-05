import './DatosCamping.css'

export default function DatosCamping ( props ) {

    /**
     * Evento del icono ojo para poder cambiar el input de la contraseña de password a text.
     * @param {Event} e 
     */
    const verPassword = (e) => {
        e.preventDefault()

        const icono_ojo = e.target
        const input_password = document.getElementById("camping_password")
        const tipo = input_password.getAttribute('type') === 'password' ? 'text' : 'password'
        
        icono_ojo.classList.toggle('fa-eye-slash')  
        icono_ojo.classList.toggle('fa-eye')

        input_password.setAttribute('type', tipo)
    }

    return(
        <div className="datos_camping">
            <div className="datos_camping__form">
                <form>
                    { props.errorPaso && <p className='datos_camping_error'>* Debes rellenar los campos con el asterisco en rojo para avanzar</p> }
                    <div className="datos_camping__form__usuario">
                        {(props.errorPaso && props.usuario === "") && <p className='asterisco_error'>*</p>}
                        <label htmlFor="camping_usuario">usuario:</label>
                        <input className={`datos_camping__form__input ${(props.errorPaso && props.usuario === "") && 'input_incorrecto'}`} type="text" name="camping_usuario" id="camping_usuario" value={props.usuario} onChange={e => props.setUsuario(e.target.value)} />
                    </div>
                    <div className="datos_camping__form__password">
                        {(props.errorPaso && props.password === "") && <p className='asterisco_error'>*</p>}
                        <label htmlFor="camping_password">contraseña:</label>
                        <input className={`datos_camping__form__input ${(props.errorPaso && props.password === "") && 'input_incorrecto'}`} type="password" name="camping_password" id="camping_password" value={props.password} onChange={e => props.setPassword(e.target.value)} />
                        <button onClick={e => verPassword(e)}><i className="fa-solid fa-eye-slash"></i></button>
                    </div>
                    <div className="datos_camping__form__correo">
                        {(props.errorPaso && props.correo === "") && <p className='asterisco_error'>*</p>}
                        <label htmlFor="camping_correo">correo:</label>
                        <input className={`datos_camping__form__input ${(props.errorPaso && props.correo === "") && 'input_incorrecto'}`} type="text" name="camping_correo" id="camping_correo" value={props.correo} onChange={e => props.setCorreo(e.target.value)} />
                    </div>
                    <div className="datos_camping__form__nombre">
                        {(props.errorPaso && props.nombre === "") && <p className='asterisco_error'>*</p>}
                        <label htmlFor="camping_nombre">nombre de tu camping:</label>
                        <input className={`datos_camping__form__input ${(props.errorPaso && props.nombre === "") && 'input_incorrecto'}`} type="text" name="camping_nombre" id="camping_nombre" value={props.nombre} onChange={e => props.setNombre(e.target.value)} />
                    </div>
                    <div className="datos_camping__form__logo">
                        <label>logo de tu camping:</label>
                        <label htmlFor="camping_logo">
                            <div className='camping_logo__input'>
                                {
                                    props.imagen ? (
                                        <img src={URL.createObjectURL(props.imagen)} alt='LOGO-IMAGEN' />
                                    ) : (
                                        <i className="fa-solid fa-plus"></i>
                                    )
                                }
                            </div>
                        </label>
                        <input type="file" name="camping_logo" id="camping_logo" accept=".jpg, .jpeg, .png" onChange={(e) => props.setImagen(e.target.files[0])} />
                    </div>
                </form>
            </div>
            <div className="datos_camping__imagen">
                <img src="../../../figura-tienda-cesped.png" alt="FIGURA-TIENDA" />
            </div>
        </div>
    )
}