import { useContext, useEffect, useState } from 'react'
import './Principal.css'
import { LoginContext } from '../../context/LoginContext'
import { useFetch } from '../../hooks/useFetch'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import Mensaje from '../../components/Mensaje/Mensaje'

export default function Principal () {

    const loginContext = useContext(LoginContext)

    const [ actualizacion, setActualizacion ] = useState(false)

    const [ mostrarMensaje, setMostrarMensaje ] = useState(false)

    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    const navigate = useNavigate()
    
    /**
     * Desplegar el panel del perfil y cerrar sesión al pulsar sobre la imagen del usuario.
     */
    const desplegarPanelPerfil = (e) => {
        const panel = document.querySelector('.principal__cabecera__perfil__links')
        const imagen = document.querySelector('.principal__cabecera__perfil__circulo')
        const links = document.querySelectorAll('.principal__cabecera__perfil__links .principal__cabecera__nav_boton')

        imagen.classList.toggle('principal__cabecera__perfil__circulo__accionador-hover')
        panel.classList.toggle('principal__cabecera__perfil__links__desplegado')
        links.forEach(link => link.classList.toggle('principal__cabecera__nav_boton__desplegado'))
    }

    /**
     * Cierra la sesión de un usuario.
     */
    const cerrarSesion = () => {
        loginContext[1](null)
        sessionStorage.clear()
        navigate('/login', { replace: true })
    }

    useEffect(() => {
        setLoading(true)

        fetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador': 'camping'}/id/${loginContext[0][0]}`)
            .then(response => response.json())
            .then(data => setData(data))
            .finally(() => setLoading(false))
    }, [actualizacion])

    return(
        <div className="principal">
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
                        <div className="principal__cabecera">
                            <button className='principal__cabecera__btn_menu-bars'><i className="fa-solid fa-bars"></i></button>
                            <nav>
                                <div className='principal__cabecera__nav__boton_hoy'>
                                    <p>CAMPING</p>
                                    <div className='principal__cabecera__nav__boton_hoy__links'>
                                        <NavLink to='/principal/camping/estado' className='principal__cabecera__nav_boton'>ESTADO</NavLink>
                                        <NavLink to='/principal/camping/calendario' className='principal__cabecera__nav_boton'>CALENDARIO</NavLink>
                                    </div>
                                </div>
                                <NavLink to='/principal/parcelas' className='principal__cabecera__nav_boton'>PARCELAS</NavLink>
                                <NavLink to='/principal/registro-actividad' className='principal__cabecera__nav_boton'>REGISTRO ACTIVIDAD</NavLink>
                                <NavLink to='/principal/reservas' className='principal__cabecera__nav_boton'>RESERVAS</NavLink>
                                <div className='principal__cabecera__nav__boton_hoy'>
                                    <p>HOY</p>
                                    <div className='principal__cabecera__nav__boton_hoy__links'>
                                        <NavLink to='/principal/entradas/reservas-sin-llegar' className='principal__cabecera__nav_boton'>ENTRADAS</NavLink>
                                        <NavLink to='/principal/salidas/salidas-sin-realizar' className='principal__cabecera__nav_boton'>SALIDAS</NavLink>
                                    </div>
                                </div>
                                { loginContext[0][1] === 1 && <NavLink to='/principal/mi-camping' className='principal__cabecera__nav_boton'>MI CAMPING</NavLink> }
                                <NavLink to='/principal/pendiente' className='principal__cabecera__nav_boton boton_pendiente'>PENDIENTE</NavLink>
                            </nav>
                            <div className="principal__cabecera__perfil">
                                <div className="principal__cabecera__perfil__circulo principal__cabecera__perfil__circulo__accionador-hover" onClick={e => desplegarPanelPerfil(e)}>
                                    {
                                        data?.results.imagen ? (
                                            <img src={`${import.meta.env.VITE_API_HOST}static/${data?.results.imagen}`} alt="IMAGEN-PERFIL" />
                                        ) : (
                                            <i className="fa-solid fa-user"></i>
                                        )
                                    }
                                </div>
                                <div className='principal__cabecera__perfil__links'>
                                    <Link to='/principal/perfil' className='principal__cabecera__nav_boton' onClick={desplegarPanelPerfil} >PERFIL</Link>
                                    <div></div>
                                    <button onClick={() => setMostrarMensaje(true)} className='principal__cabecera__nav_boton'>CERRAR SESIÓN</button>
                                </div>
                            </div>
                        </div>
                        <div className="principal__outlet">
                            <Outlet context={[ actualizacion, setActualizacion ]} />
                        </div>
                        {
                            mostrarMensaje && (
                                <Mensaje mensaje={"¿Seguro que quiere cerrar la sesión?"} accionCancelar={() => {setMostrarMensaje(false)}} accionAceptar={cerrarSesion} />
                            )
                        }
                    </>
                )
            }
        </div>
    )
}