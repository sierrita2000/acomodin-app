import { LoginContext } from '../../../context/LoginContext'
import { useContext, useEffect } from 'react'
import './Perfil.css'
import { useFetch } from '../../../hooks/useFetch'
import { Link, Outlet, useOutletContext } from 'react-router-dom'

export default function Perfil () {

    const loginContext = useContext(LoginContext)

    console.log(loginContext[0])

    const [ actualizacion, setActualizacion ] = useOutletContext()

    let [ data, error, loading ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador': 'camping'}/id/${loginContext[0][0]}`)

    return(
        <div className="perfil">
            {
                loading ? (
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
                ) : (
                    <>
                        <div className="perfil__izq">
                            <div className='perfil__izq__imagen'>
                                {
                                    data?.results.imagen ? (
                                        <img src={`${import.meta.env.VITE_API_HOST}static/${data?.results.imagen}`} alt="IMAGEN-PERFIL" />
                                    ) : (
                                        <i className="fa-solid fa-user"></i>
                                    )
                                    }
                            </div>
                            <Link to={`/principal/perfil/editar`} className='perfil__izq__boton_editar'>EDITAR</Link>
                            <Link to={`/principal/perfil/cambiar-contraseña`} className='perfil__izq__boton_contrasena'>Cambiar contraseña</Link>
                        </div>
                        <div className="perfil__der">
                            <div className="perfil__der__campo">
                                <label htmlFor="perfil_usuario">Usuario:</label>
                                <div>{data?.results.usuario || ''}</div>
                            </div>
                            <div className="perfil__der__campo">
                                <label htmlFor="perfil_correo">Correo:</label>
                                <div>{data?.results.correo || ''}</div>
                            </div>
                            <div className="perfil__der__campo">
                                <label htmlFor="perfil_nombre">Nombre:</label>
                                <div>{data?.results.nombre || ''}</div>
                            </div>
                            {
                                loginContext[0][1] === 0 &&
                                (
                                    <>
                                        <div className="perfil__der__campo">
                                            <label htmlFor="perfil_apellidos">Apellidos:</label>
                                            <div>{data?.results.apellidos || '-'}</div>
                                        </div>
                                        <div className="perfil__der__campo">
                                            <label htmlFor="perfil_telefono">Teléfono:</label>
                                            <div>{(data?.results.telefono === '000000000') ? '-' : data?.results.telefono}</div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        <Outlet context={[ actualizacion, setActualizacion ]} />
                    </>
                )
            }
        </div>
    )
}   