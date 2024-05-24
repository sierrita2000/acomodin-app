import { useEffect, useState } from 'react'
import './Inicio.css'
import { Link, useNavigate } from 'react-router-dom'

export default function Inicio () {

    const [ proceso, setProceso ] = useState('importante')
    
    const navigate = useNavigate()

    useEffect(() => {
        const botonesProcesos = document.querySelectorAll('.procesos__botones__boton div')
        const iconosProcesos = document.querySelectorAll('.procesos__botones__boton div i')

        botonesProcesos.forEach(boton => {
            boton.addEventListener("mouseover", (e) => {
                setProceso(e.target.title)
            })
        })

        iconosProcesos.forEach(icono => {
            icono.addEventListener("mouseover", (e) => {
                setProceso(e.target.title)
            })
        })
    }, [])

    return (
        <section className="inicio">
            <section className="inicio__cabecera">
                <img src="../../figura-logo-circulo.png" alt="LOGO" />
                <nav className="inicio__cabecera__menu">
                    <ul>
                        <li><Link to="/registro-camping">REGISTRATE</Link></li> 
                        <li><Link to="/login">LOGUEATE</Link></li>
                        <li><a href="#servicios">SERVICIOS</a></li>
                        <li><a href="#contacto">CONTACTO</a></li>
                    </ul>
                </nav>
            </section>
            <section className='inicio__presentacion'>
                <div className='inicio__presentacion__izq'>
                    <h1>Gestiona cómodamente las entradas y salidas de tu camping</h1>
                    <h2>La acomodación más fácil y rápida que nunca</h2>
                    <button onClick={() => navigate("/login")}>COMENZAR</button>
                </div>
                <div className='inicio__presentacion__der'>
                    <img src="../../figura-tipi-cartel.png" alt="FIGURA TIPI" className="tipi" />
                    <img src="../../figura-nube.png" alt="FIGURA NUBE" className="nube nube1" />
                    <img src="../../figura-nube.png" alt="FIGURA NUBE" className="nube nube2" />
                </div>
            </section>
            {/* Cambiar el div de videos por el video de explicación y el texto lorem */}
            <section className='inicio__servicios' id='servicios'>
                <section className="inicio__servicios__pasos inicio__servicios__paso1">
                    <h2>Paso 1</h2>
                    <h4>REGISTRA TU CAMPING</h4>
                    <div className="paso__contenido">
                        <div className="paso__contenido__video">
                            <div></div>
                        </div>
                        <div className="paso__contenido__texto">
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque assumenda laboriosam soluta libero ab veniam mollitia doloribus veritatis, sequi odio repellendus eaque ea accusantium molestias, quo asperiores at, temporibus esse nihil nostrum consequuntur ut aspernatur! Sint ullam et maiores earum laborum eum quas, quis aliquam? Commodi repellendus impedit quis aspernatur.</p>
                        </div>
                    </div>
                </section>
                <section className="inicio__servicios__pasos inicio__servicios__paso2">
                    <h2>Paso 2</h2>
                    <h4>CREA LAS CUENTAS DE LOS ACOMODADORES</h4>
                    <div className="paso__contenido">
                        <div className="paso__contenido__texto">
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque assumenda laboriosam soluta libero ab veniam mollitia doloribus veritatis, sequi odio repellendus eaque ea accusantium molestias, quo asperiores at, temporibus esse nihil nostrum consequuntur ut aspernatur! Sint ullam et maiores earum laborum eum quas, quis aliquam? Commodi repellendus impedit quis aspernatur.</p>
                        </div>
                        <div className="paso__contenido__video">
                            <div></div>
                        </div>
                    </div>
                </section>
                <section className="inicio__servicios__pasos inicio__servicios__paso3">
                    <h2>Paso 3</h2>
                    <h4>INICIA SESIÓN COMO ACOMODADOR</h4>
                    <div className="paso__contenido">
                        <div className="paso__contenido__video">
                            <div></div>
                        </div>
                        <div className="paso__contenido__texto">
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque assumenda laboriosam soluta libero ab veniam mollitia doloribus veritatis, sequi odio repellendus eaque ea accusantium molestias, quo asperiores at, temporibus esse nihil nostrum consequuntur ut aspernatur! Sint ullam et maiores earum laborum eum quas, quis aliquam? Commodi repellendus impedit quis aspernatur.</p>
                        </div>
                    </div>
                </section>
                <section className="inicio__servicios__procesos">
                    <h2>Paso 4</h2>
                    <div className="procesos__botones">
                        <div className="procesos__botones__boton boton1">
                            <div title='importante' className={ `boton ${proceso === 'importante' && 'boton_activado'}` } ><i className={`fa-solid fa-circle-exclamation ${proceso === 'importante' && 'icono_activado'}`} title='importante'></i></div>
                            <h6 className={`titulo ${proceso === 'importante' && 'titulo_activado'}`}>IMPORTANTE</h6>
                        </div>
                        <div className="procesos__botones__boton boton2">
                            <div title='parcelas' className={ `boton ${proceso === 'parcelas' && 'boton_activado'}` } ><i className={`fa-solid fa-campground ${proceso === 'parcelas' && 'icono_activado'}`} title='parcelas'></i></div>
                            <h6 className={`titulo ${proceso === 'parcelas' && 'titulo_activado'}`}>PARCELAS</h6>
                        </div>
                        <div className="procesos__botones__boton boton3">
                            <div title='actividad' className={ `boton ${proceso === 'actividad' && 'boton_activado'}` } ><i className={`fa-solid fa-calendar-days ${proceso === 'actividad' && 'icono_activado'}`} title='actividad'></i></div>
                            <h6 className={`titulo ${proceso === 'actividad' && 'titulo_activado'}`}>REGISTRO DE ACTIVIDAD</h6>
                        </div>
                        <div className="procesos__botones__boton boton4">
                            <div title='entradas' className={ `boton ${proceso === 'entradas' && 'boton_activado'}` } ><i className={`fa-solid fa-caravan ${proceso === 'entradas' && 'icono_activado'}`} title='entradas'></i></div>
                            <h6 className={`titulo ${proceso === 'entradas' && 'titulo_activado'}`}>ENTRADAS</h6>
                        </div>
                        <div className="procesos__botones__boton boton5">
                            <div title='salidas' className={ `boton ${proceso === 'salidas' && 'boton_activado'}` } ><i className={`fa-solid fa-signs-post ${proceso === 'salidas' && 'icono_activado'}`} title='salidas'></i></div>
                            <h6 className={`titulo ${proceso === 'salidas' && 'titulo_activado'}`}>SALIDAS</h6>
                        </div>
                        <div className="procesos__botones__boton boton6">
                            <div title='perfil' className={ `boton ${proceso === 'perfil' && 'boton_activado'}` } ><i className={`fa-solid fa-user ${proceso === 'perfil' && 'icono_activado'}`} title='perfil'></i></div>
                            <h6 className={`titulo ${proceso === 'perfil' && 'titulo_activado'}`}>PERFIL</h6>
                        </div>
                    </div>
                    <div className="procesos__video">
                        <div>{ proceso.toUpperCase() }</div>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere voluptate incidunt molestias beatae ducimus distinctio odit eligendi recusandae a qui ad, dolorem expedita numquam illo alias hic. Eaque molestias quis consequatur dolorum illo esse iste, rem quibusdam amet? Neque itaque ab eos? Quis accusantium perferendis libero eveniet voluptate, totam consectetur.</p>
                    </div>
                </section>
            </section>
            <section className='inicio__footer' id='contacto'>
                <div className="inicio__footer__contacto">
                    <h2>Cuéntanos lo que quieras...</h2>
                    <form>
                        <div className="contacto__izq">
                            <label htmlFor="contacto_correo">correo</label>
                            <input type="text" name="contacto_correo" id="contacto_correo" />
                            <label htmlFor="contacto_nombre">nombre</label>
                            <input type="text" name="contacto_nombre" id="contacto_nombre" />
                            <label htmlFor="contacto_asunto">asunto</label>
                            <input type="text" name="contacto_asunto" id="contacto_asunto" />
                            <button type="submit" onClick={e => e.preventDefault()}>ENVIAR</button>
                        </div>
                        <div className="contacto__der">
                            <label htmlFor="contacto_mensaje">mensaje</label>
                            <textarea name="contacto_mensaje" id="contacto_mensaje"></textarea>
                        </div>
                    </form>
                </div>
                <div className="inicio__footer__logo">
                    <div>
                        <img src="../../logo.png" alt="LOGO" />
                    </div>
                </div>
            </section>
        </section>
    )
}