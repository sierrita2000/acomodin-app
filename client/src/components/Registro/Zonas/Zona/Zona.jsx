import './Zona.css'
import { useEffect, useRef, useState } from 'react'
import Figura from '../../../BotonFigura/Figura'
import Mensaje from '../../../Mensaje/Mensaje'
import Parcela from '../Parcela/Parcela'
import { useFetch } from '../../../../hooks/useFetch'

export default function Zona ({ guardar, id, nombre, tipos, parcelas, tiposCamping, setZonas, zonas, handleGuardarCambios, caracteristicasCamping, luzCamping }) {

    const [ nombreZona, setNombreZona ] = useState(nombre)
    const [ tiposZona, setTiposZona ] = useState(tipos)
    const [ parcelasZona, setParcelasZona ] = useState(parcelas.sort((a, b) => {
        const nombreA = a.nombre.toLowerCase()
        const nombreB = b.nombre.toLowerCase()

        if (nombreA > nombreB) {
            return 1
        } else if (nombreA < nombreB) {
            return -1
        } else {
            return 0
        }
    }))

    const [ mensaje, setMensaje ] = useState(null)

    const refParcelas = useRef(null)

    const [ data ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)
    const figuras = data?.results.filter(f => tiposCamping.includes(f._id))

    /**
     * Almacena los datos de las zonas en su estado.
     */
    const guardarCambios = () => {
        let zonas_copia = zonas
        const posicion = zonas.findIndex(z => z.id === id)

        zonas_copia[posicion].nombre = nombreZona
        zonas_copia[posicion].tipos = tiposZona
        zonas_copia[posicion].parcelas = parcelasZona

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
        setMensaje(null)
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

    /**
     * Handler del botón para crear parcelas.
     * @param {Number} cantidad_parcelas 
     */
    const crearParcelas = (elemento) => {
        let cantidad_parcelas = elemento.value
        const parcelas_nuevas = new Array()

        elemento.value = 0

        if (cantidad_parcelas > 0) {
            let id_parcela = parcelasZona.length + 1

            while (cantidad_parcelas != 0) {
                const obj_parcela = {
                    id: id_parcela,
                    nombre: `${nombreZona}-${id_parcela}`,
                    tamano: 'pequeña',
                    tipos: tiposZona,
                    electricidad: luzCamping ? true : false,
                    caracteristicas: []
                }

                parcelas_nuevas.push(obj_parcela)

                id_parcela++
                cantidad_parcelas--
            }

            setParcelasZona(parcelasZona.concat(parcelas_nuevas))

            let zonas_copia = zonas
            const posicion = zonas.findIndex(z => z.id === id)

            zonas_copia[posicion].parcelas = parcelasZona.concat(parcelas_nuevas)
            setZonas(zonas_copia)
            
            handleGuardarCambios()
        } else {
            alert("Tienes que marcar el número de parcelas que deseas crear.")
        }
    }

    useEffect(() => {
        guardar && guardarCambios()
    }, [guardar])

    useEffect(() => {
        setNombreZona(nombre)
        setTiposZona(tipos)
        setParcelasZona(parcelas)
    }, [nombre, tipos, parcelas, tiposCamping])

    return(
        <div id={`zona-${id}`} className="zona">
            <div className="zona__zona">
                <button onClick={e => abrirCerrarParcelas(e)}><i className="fa-solid fa-caret-down"></i></button>
                <div className="zona__info">
                    <input type="text" placeholder='Nombre zona...' value={nombreZona} onChange={e => setNombreZona(e.target.value)} />
                    <div className='zona__info__tipos'>
                        {
                            figuras?.map((figura, indice) => {
                                return <Figura key={indice} id={figura?._id} imagen={figura?.imagen} titulo={figura?.nombre} tipos={tiposZona} setTipos={setTiposZona}/>
                            })
                        }
                    </div>
                    <div className='zona__info__total'>
                        <p>TOTAL PARCELAS</p>
                        <div>{parcelas.length}</div>
                    </div>
                    <div className='zona__info__boton__borrar'>
                        <button onClick={() => setMensaje({ mensaje: (zonas.length === 1) ? 'Debe haber un mínimo de una zona' : `¿Seguro que quieres eliminar la zona "${nombreZona}" ?`, accionCancelar: () => setMensaje(null), accionAceptar: (zonas.length === 1) ? () => setMensaje(null) : borrarZona, warning: (zonas.length === 1) ? true : false })}><i className="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>

            { mensaje && <Mensaje mensaje={mensaje.mensaje} accionCancelar={mensaje.accionCancelar} accionAceptar={mensaje.accionAceptar} warning={mensaje.warning} /> }
            
            <div ref={refParcelas} className="zona__parcelas">
                <div className="zona__parcelas__parcelas">
                        {
                            parcelasZona?.map((parcela, indice) => {
                                return <Parcela key={`parcela-${indice}`} guardar={guardar} { ...parcela } tiposZona={tiposZona} caracteristicasCamping={caracteristicasCamping} handleGuardarCambios={handleGuardarCambios} zonas={zonas} setZonas={setZonas} posicionZona={zonas.findIndex(z => z.id === id)} luzCamping={luzCamping} parcelasZona={parcelasZona} setParcelasZona={setParcelasZona} />
                            })
                        }
                </div>
                <div className="zona__parcelas__anadir">
                    <p>añadir</p>
                    <input type="number" name="parcelas_anadir" id={`parcelas_anadir-${id}`} min={0} defaultValue={0} />
                    <p>parcelas</p>
                    <button onClick={() => crearParcelas(document.getElementById(`parcelas_anadir-${id}`))}><i className="fa-solid fa-plus"></i></button>
                </div>
            </div>           
        </div>
    )
}