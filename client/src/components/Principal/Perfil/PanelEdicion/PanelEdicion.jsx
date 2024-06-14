import { useFetch } from '../../../../hooks/useFetch'
import './PanelEdicion.css'
import { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext'
import { useNavigate } from 'react-router-dom'

export default function PanelEdicion () {

    const loginContext = useContext(LoginContext)
    const navigate = useNavigate()

    const [ imagen, setImagen ] = useState(null)
    const [ usuario, setUsuario ] = useState(null)
    const [ correo, setCorreo ] = useState(null)
    const [ nombre, setNombre ] = useState(null)
    const [ apellidos, setApellidos ] = useState(null)
    const [ telefono, setTelefono ] = useState(null)


    const [ data ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador': 'camping'}/id/${loginContext[0][0]}`)


    const restablecerDatos = () => {
        setImagen(null)
        setUsuario(data?.results.usuario || null)
        setCorreo(data?.results.correo || null)
        setNombre(data?.results.nombre || null)
        setApellidos(data?.results.apellidos || null)
        setTelefono(data?.results.telefono === '000000000' ? null : data?.results.telefono)
    }

    const guardarDatos = async () => {
        let objDatos = new Object()

        if (loginContext[0][1] === 0) {
            objDatos
        }

        const formData = new FormData()
        formData.append('datos', JSON.stringify())
    }

    useEffect(() => {
        restablecerDatos()
    }, [data])

    return(
        <div className="panel_edicion">
            <div className="panel_edicion__modal">
                <button onClick={() => navigate('..')} className="panel_edicion__modal__cerrar_btn"><i className="fa-solid fa-xmark"></i></button>
                <div>
                    <label htmlFor="panel_imagen">
                        <div className='panel_edicion__modal__imagen'>
                            {
                                data?.results.imagen ? (
                                    <img src={imagen ? URL.createObjectURL(imagen) : `${import.meta.env.VITE_API_HOST}static/${data?.results.imagen}`} alt="IMAGEN-PERFIL" />
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
                    <button onClick={restablecerDatos} className='panel_edicion__modal__btn'>RESTABLECER</button>
                    <button onClick={guardarDatos} className='panel_edicion__modal__btn'>GUARDAR</button>
                </div>
            </div>
        </div>
    )
}