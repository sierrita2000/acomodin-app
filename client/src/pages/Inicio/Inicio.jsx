import { useEffect, useRef, useState } from 'react'
import '@/pages/Inicio/Inicio.css'
import { Link, useNavigate } from 'react-router-dom'

export default function Inicio () {

    const [ proceso, setProceso ] = useState('calendario')
    
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
                            <Slider key={'paso__contenido__video__registro'} lista_imagenes={['pantalla-registro-datos.png', 'pantalla-registro-parcelas.png', 'pantalla-registro-zonas.png']} />
                        </div>
                        <div className="paso__contenido__texto">
                            <p>Para comenzar a utilizar los servicios que ofrece Acomodin, lo primero de todo será crear una cuenta para tu camping, donde especificarás todas las características del mismo, desde el nombre, correo, descripción de las parcelas y zonas que conforman el camping, métodos de acamapada aceptables... El administrador del camping podrá acceder a la web a través del correo y contraseña que especifique el la primera pantalla de registro.</p>
                        </div>
                    </div>
                </section>
                <section className="inicio__servicios__pasos inicio__servicios__paso2">
                    <h2>Paso 2</h2>
                    <h4>CREA LAS CUENTAS DE LOS ACOMODADORES</h4>
                    <div className="paso__contenido">
                        <div className="paso__contenido__texto">
                            <p>El administrador del camping, en la última pantalla del registro podrá crear las cuentas de acomodadores que desee. Deberá introducir el nombre del acomodador y un correo, al cual le llegará su usuario de acceso y contraseña inicial. Ambas cosas podrá cambiarlas desde su perfil en cualquier momento.</p>
                        </div>
                        <div className="paso__contenido__video">
                            <div>
                                <Slider key={'paso__contenido__video__acomodadores'} lista_imagenes={['pantalla-registro-acomodadores.png', 'pantalla-registro-finalizar.png']} />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="inicio__servicios__pasos inicio__servicios__paso3">
                    <h2>Paso 3</h2>
                    <h4>INICIA SESIÓN COMO ACOMODADOR</h4>
                    <div className="paso__contenido">
                        <div className="paso__contenido__video">
                            <div>
                                <img src="../../../pantalla-login.png" />
                            </div>
                        </div>
                        <div className="paso__contenido__texto">
                            <p>Por último tanto los acomodadores del camping, como su administrador podrán iniciar sesión identificandose con su usario y contraseña, para poder acceder a todas las funcionalidades que ofrece la web.</p>
                        </div>
                    </div>
                </section>
                <section className="inicio__servicios__procesos">
                    <h2>Paso 4</h2>
                    <div className="procesos__botones">
                        <div className="procesos__botones__boton boton1">
                            <div title='calendario' className={ `boton ${proceso === 'calendario' && 'boton_activado'}` } ><i className={`fa-solid fa-calendar-days ${proceso === 'calendario' && 'icono_activado'}`} title='calendario'></i></div>
                            <h6 className={`titulo ${proceso === 'calendario' && 'titulo_activado'}`}>CALENDARIO</h6>
                        </div>
                        <div className="procesos__botones__boton boton2">
                            <div title='estado' className={ `boton ${proceso === 'estado' && 'boton_activado'}` } ><i className={`fa-solid fa-chart-pie ${proceso === 'estado' && 'icono_activado'}`} title='estado'></i></div>
                            <h6 className={`titulo ${proceso === 'estado' && 'titulo_activado'}`}>ESTADO</h6>
                        </div>
                        <div className="procesos__botones__boton boton3">
                            <div title='parcelas' className={ `boton ${proceso === 'parcelas' && 'boton_activado'}` } ><i className={`fa-solid fa-campground ${proceso === 'parcelas' && 'icono_activado'}`} title='parcelas'></i></div>
                            <h6 className={`titulo ${proceso === 'parcelas' && 'titulo_activado'}`}>PARCELAS</h6>
                        </div>
                        <div className="procesos__botones__boton boton4">
                            <div title='actividad' className={ `boton ${proceso === 'actividad' && 'boton_activado'}` } ><i className={`fa-solid fa-bookmark ${proceso === 'actividad' && 'icono_activado'}`} title='actividad'></i></div>
                            <h6 className={`titulo ${proceso === 'actividad' && 'titulo_activado'}`}>REGISTRO DE ACTIVIDAD</h6>
                        </div>
                        <div className="procesos__botones__boton boton5">
                            <div title='entradas' className={ `boton ${proceso === 'entradas' && 'boton_activado'}` } ><i className={`fa-solid fa-signs-post ${proceso === 'entradas' && 'icono_activado'}`} title='entradas'></i></div>
                            <h6 className={`titulo ${proceso === 'entradas' && 'titulo_activado'}`}>ENTRADAS Y SALIDAS</h6>
                        </div>
                        <div className="procesos__botones__boton boton6">
                            <div title='perfil' className={ `boton ${proceso === 'perfil' && 'boton_activado'}` } ><i className={`fa-solid fa-user ${proceso === 'perfil' && 'icono_activado'}`} title='perfil'></i></div>
                            <h6 className={`titulo ${proceso === 'perfil' && 'titulo_activado'}`}>PERFIL</h6>
                        </div>
                    </div>
                    <div className="procesos__video">
                        <div>
                            <img src={`../../../pantalla-${proceso}.png`} />
                        </div>
                        { (proceso === 'calendario') && <p>Podrás visualizar en un calendario el estado de tus parcelas entre un máximo de 31 días cualesquiera. Además, podrás filtrar que tipo de parcelas quieres visualizar.</p> }
                        { (proceso === 'estado') && <p>Podrás controlar la situación de tu camping cualquier día. En esta sección podrás filtrar la fecha que quieras para ver el hueco libre, las reservas, entradas y salidas de ese mismo día.</p> }
                        { (proceso === 'parcelas') && <p>Podrás visualizar la información de todas las parcelas de tu camping, desde sus características como el tamaño, tipos de acomodación, etc hasta las reservas futuras de esa parcela.</p> }
                        { (proceso === 'actividad') && <p>Podrás estar al día sobre la actividad de todos los empleados del camping, ya que desde esta sección podrás visualizar todas las reservas, entradas y salidas que han registrado los usuarios en un día en concreto.</p> }
                        { (proceso === 'entradas') && <p>Ya que lo más importante es el trabajo diario, desde estas secciones podrás acceder rápidamente a las entradas, reservas y salidas que tienes pendientes en el día actual.</p> }
                        { (proceso === 'perfil') && <p>Todos los usuarios podrán acceder a través del icono que se encunetra en la parte superior derecha de la pantalla a su perfil, donde podrán modificar todos sus datos.</p> }
                    </div>
                </section>
            </section>
            <section className='inicio__footer' id='contacto'>
                <div className="inicio__footer__contacto">
                    <h2>Preguntanos lo que quieras...</h2>
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

function Slider ({ lista_imagenes }) {

    const [ imagen, setImagen ] = useState(0)

    const slider = useRef(null)
    const intervaloID = useRef(null)

    const startInterval = () => {
        intervaloID.current = setInterval(() => {
            setImagen((imagen === (lista_imagenes.length - 1)) ? 0 : (imagen + 1));
        }, 5000);
    };

    const stopInterval = () => {
        clearInterval(intervaloID.current);
    };

    useEffect(() => {
        if(intervaloID.current) stopInterval()
        startInterval()

        const slider__imagenes = slider.current.querySelector('.slider__imagenes')
        const ancho_slider = slider.current.clientWidth

        slider__imagenes.style.transform = `translateX(-${ancho_slider * imagen}px)`
    }, [imagen])

    return(
        <div ref={slider} className="slider">
            <div className="slider__imagenes">
                {
                    lista_imagenes.map((imagen, indice) => {
                        return <div key={`imagen${indice}`} className={`imagen${indice}`}><img src={`../../../${imagen}`} /></div>
                    })
                }
            </div>
            <div className="slider__botones">
                {
                    lista_imagenes.map(( x, indice) => {
                        return <div key={`boton_imagen_${indice}`} className={`slider__botones__boton ${(imagen === indice) && 'boton_slider_seleccionado'}`} onClick={() => setImagen(indice)} ></div>
                    })
                }
            </div>
        </div>
    )
}