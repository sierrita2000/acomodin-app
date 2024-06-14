import { useContext } from 'react'
import './Principal.css'
import { LoginContext } from '../../context/LoginContext'
import { useFetch } from '../../hooks/useFetch'
import { Outlet, NavLink, Link } from 'react-router-dom'

export default function Principal () {

    const loginContext = useContext(LoginContext)

    const [ data, error, loading ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador': 'camping'}/id/${loginContext[0][0]}`)

    /**
     * Desplegar el panel del perfil y cerrar sesión al pulsar sobre la imagen del usuario.
     */
    const desplegarPanelPerfil = (e) => {
        console.log('pulsado')
        const panel = document.querySelector('.principal__cabecera__perfil__links')
        const imagen = document.querySelector('.principal__cabecera__perfil__circulo')
        const links = document.querySelectorAll('.principal__cabecera__perfil__links .principal__cabecera__nav_boton')

        imagen.classList.toggle('principal__cabecera__perfil__circulo__accionador-hover')
        panel.classList.toggle('principal__cabecera__perfil__links__desplegado')
        links.forEach(link => link.classList.toggle('principal__cabecera__nav_boton__desplegado'))
    }

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
                                <NavLink to='/principal/calendario-reservas' className='principal__cabecera__nav_boton'>CALENDARIO RESERVAS</NavLink>
                                <NavLink to='/principal/parcelas' className='principal__cabecera__nav_boton'>PARCELAS</NavLink>
                                <NavLink to='/principal/registro-actividad' className='principal__cabecera__nav_boton'>REGISTRO ACTIVIDAD</NavLink>
                                <NavLink to='/principal/entradas' className='principal__cabecera__nav_boton'>ENTRADAS</NavLink>
                                <NavLink to='/principal/salidas' className='principal__cabecera__nav_boton'>SALIDAS</NavLink>
                                { loginContext[0][1] === 1 && <NavLink to='/principal/mi-camping' className='principal__cabecera__nav_boton'>MI CAMPING</NavLink> }
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
                                    <button className='principal__cabecera__nav_boton'>CERRAR SESIÓN</button>
                                </div>
                            </div>
                        </div>
                        <div className="principal__outlet">
                            <Outlet />
                        </div>
                    </>
                )
            }
        </div>
    )
}