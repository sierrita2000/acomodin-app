import './Zona.css'
import { useEffect, useRef, useState } from 'react'
import Figura from '../../../BotonFigura/Figura'
import Mensaje from '../../../Mensaje/Mensaje'

export default function Zona ({ guardar, id, nombre, tipos, parcelas, tiposCamping, setZonas, zonas, handleGuardarCambios }) {

    const [ nombreZona, setNombreZona ] = useState(nombre)
    const [ tiposZona, setTiposZona ] = useState(tipos)

    const [ borrar, setBorrar ] = useState(false)

    const refZona = useRef(null)
    const refParcelas = useRef(null)

    const figuras = [
        ['tipis', '../../../figura-tipi.png'],
        ['bungalows', '../../../figura-bungalow.png'],
        ['tiendas', '../../../figura-tienda.png'],
        ['caravanas', '../../../figura-caravana.png'],
        ['campers', '../../../figura-camper.png'],
        ['autocaravanas', '../../../figura-autocaravana.png'],
        ['carros tienda', '../../../figura-carro.png'],
    ]

    /**
     * Almacena los datos de las zonas en su estado.
     */
    const guardarCambios = () => {
        let zonas_copia = zonas
        const posicion = zonas.findIndex(z => z.id === id)

        console.log("***************************")
        console.log("POSICION : ", posicion)
        console.log("NOMBRE QUE LLEGA : ", nombre)
        console.log("NOMBRE QUE SE PONE : ", nombreZona)
        console.log("ELEMENTO : ", refZona.current)
        console.log("***************************")

        zonas_copia[posicion].nombre = nombreZona
        zonas_copia[posicion].tipos = tiposZona

        setZonas(zonas_copia)
    }

    /**
     * Handle del botón basura (Elimina una zona entera).
     */
    const borrarZona = () => {
        let zonas_copia = zonas
        const posicion = zonas.findIndex(z => z.id === id)

        zonas_copia.splice(posicion, 1)    

        setZonas(zonas_copia)
        setBorrar(false)
        handleGuardarCambios()
    }

    /**
     * Handler del botón para cerrar y abrir las parcelas.
     * @param {Event} e 
     */
    const abrirCerrarParcelas = (e) => {
        e.target.classList.toggle('girar__icono')

        refParcelas.current.classList.toggle('desplegar_parcelas')
    }

    useEffect(() => {
        guardar && guardarCambios()
    }, [guardar])

    return(
        <div id={`zona-${id}`} ref={refZona} className="zona">
            <div className="zona__zona">
                <button onClick={e => abrirCerrarParcelas(e)}><i className="fa-solid fa-caret-down"></i></button>
                <div className="zona__info">
                    <input type="text" placeholder='Nombre zona...' value={nombreZona} onChange={e => setNombreZona(e.target.value)} />
                    <div className='zona__info__tipos'>
                        {
                            figuras.map(figura => {
                                if (tiposCamping.includes(figura[0])) return <Figura imagen={figura[1]} titulo={figura[0]} tipos={tiposZona} setTipos={setTiposZona}/>
                            })
                        }
                    </div>
                    <div className='zona__info__total'>
                        <p>TOTAL PARCELAS</p>
                        <div>{parcelas.length}</div>
                    </div>
                    <div className='zona__info__boton__borrar'>
                        <button onClick={() => setBorrar(true)}><i className="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>

            { borrar && <Mensaje mensaje={`¿Seguro que quieres eliminar la zona "${nombreZona}" ?`} accionCancelar={() => setBorrar(false)} accionAceptar={borrarZona} /> }
            
            <div ref={refParcelas} className="zona__parcelas">
                <div className="zona__parcelas__parcelas">

                </div>
                <div className="zona__parcelas__anadir">
                    <p>añadir</p>
                    <input type="number" name="parcelas_anadir" id="parcelas_anadir" min={0} />
                    <p>parcelas</p>
                    <button><i className="fa-solid fa-plus"></i></button>
                </div>
            </div>           
        </div>
    )
}