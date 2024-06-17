import { useFetch } from '../../../../hooks/useFetch'
import './PanelEdicion.css'
import { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext'
import { useNavigate, useOutletContext } from 'react-router-dom'

export default function PanelEdicion () {

    const loginContext = useContext(LoginContext)
    const navigate = useNavigate()
    
    const [ actualizacion, setActualizacion ] = useOutletContext()

    const [ imagen, setImagen ] = useState('')
    const [ usuario, setUsuario ] = useState('')
    const [ correo, setCorreo ] = useState('')
    const [ nombre, setNombre ] = useState('')
    const [ apellidos, setApellidos ] = useState('')
    const [ telefono, setTelefono ] = useState('')

    const [ guardando, setGuardando ] = useState(false)


    const [ data ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador': 'camping'}/id/${loginContext[0][0]}`)

    /**
     * Volver a los datos inciales.
     */
    const restablecerDatos = () => {
        setImagen(data?.results.imagen || null)
        setUsuario(data?.results.usuario || null)
        setCorreo(data?.results.correo || null)
        setNombre(data?.results.nombre || null)
        setApellidos(data?.results.apellidos || null)
        setTelefono(data?.results.telefono === '000000000' ? null : data?.results.telefono)
    }

    /**
     * Actualiza los datos de un usuario.
     * @param {Event} e 
     */
    const guardarDatos = async (e) => {
        e.preventDefault()
        setGuardando(true)

        let objDatos = new Object()
        objDatos.usuario = usuario
        objDatos.correo = correo
        objDatos.nombre = nombre

        if (loginContext[0][1] === 0) { // acomodador
            objDatos.apellidos = apellidos
            objDatos.telefono = telefono
        }

        console.log(objDatos)
        const formData = new FormData()
        formData.append('datos', JSON.stringify(objDatos))
        if ((typeof imagen != 'string') && imagen) {
            formData.append('imagen', imagen)
        }

        const response = await fetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodadores/actualizar-acomodador' : 'camping/actualizar-camping'}/id/${loginContext[0][0]}`, {
            method: 'PUT',
            body: formData
        })
        const data = await response.json()

        if (data.status === 'ok') {
            alert('usuario actualizado correctamente')
            setGuardando(false)
            setActualizacion(!actualizacion)
            navigate('..')
        } else {
            alert(data.message)
        }
    }

    useEffect(() => {
        restablecerDatos()
    }, [data])

    return(
        <div className="panel_edicion">
            <div className="panel_edicion__modal">
                <button onClick={() => navigate('..')} className="panel_edicion__modal__cerrar_btn"><i className="fa-solid fa-xmark"></i></button>
                <form>
                    <div>
                        <label htmlFor="panel_imagen">
                            <div className='panel_edicion__modal__imagen'>
                                {
                                    imagen ? (
                                        <img src={(typeof imagen) != "string" ? URL.createObjectURL(imagen) : `${import.meta.env.VITE_API_HOST}static/${data?.results.imagen}`} alt="IMAGEN-PERFIL" />
                                    ) : (
                                        <i className="fa-solid fa-user"></i>
                                    )
                                    }
                            </div>
                        </label>
                        <input type="file" name="panel_imagen" id="panel_imagen" accept=".jpg, .jpeg, .png" onChange={(e) => setImagen(e.target.files[0])} />
                    </div>
                    <div className="panel_edicion__modal__campos">
                        <div className="panel_edicion__modal__campos__campo">
                            <label htmlFor="perfil_usuario">Usuario:</label>
                            <input type="text" name="perfil_usuario" id="perfil_usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
                        </div>
                        <div className="panel_edicion__modal__campos__campo">
                            <label htmlFor="perfil_correo">Correo:</label>
                            <input type="text" name="perfil_correo" id="perfil_correo" value={correo} onChange={e => setCorreo(e.target.value)} />
                        </div>
                        <div className="panel_edicion__modal__campos__campo">
                            <label htmlFor="perfil_nombre">Nombre:</label>
                            <input type="text" name="perfil_nombre" id="perfil_nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
                        </div>
                        {
                            loginContext[0][1] === 0 &&
                            (
                                <>
                                    <div className="panel_edicion__modal__campos__campo">
                                        <label htmlFor="perfil_apellidos">Apellidos:</label>
                                        <input type="text" name="perfil_apellidos" id="perfil_apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} />
                                    </div>
                                    <div className="panel_edicion__modal__campos__campo">
                                        <label htmlFor="perfil_telefono">Teléfono:</label>
                                        <input type="text" name="perfil_telefono" id="perfil_telefono" value={telefono} onChange={e => setTelefono(e.target.value)} />
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className="panel_edicion__modal__botones">
                        <button onClick={e => { e.preventDefault(); restablecerDatos() }} className='panel_edicion__modal__btn'>RESTABLECER</button>
                        <button onClick={e => guardarDatos(e)} className='panel_edicion__modal__btn'>GUARDAR</button>
                    </div>
                </form>
                {
                    guardando && (
                        <div className="panel_edicion__guardando">
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
            </div>
        </div>
    )
}