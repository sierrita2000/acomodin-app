import { useEffect, useRef, useState } from 'react'
import './Acomodadores.css'
import Mensaje from '../../Mensaje/Mensaje'

export default function Acomodadores ( props ) {

    const [ guardar, setGuardar ] = useState(false)

    const guardarCambios = () => {
        setGuardar(true)
        setTimeout(() => setGuardar(false), 1000)
    }

    const crearAcomodadores = () => {
        const input_cantidad = document.querySelector('.acomodadores__contenido__anadir input[type="number"]')
        let cantidad = input_cantidad.value
        const nuevos_acomodadores = new Array()

        input_cantidad.value = 0

        if (cantidad > 0 ) {
            let id = props.acomodadores[props.acomodadores.length - 1].id + 1

            while (cantidad != 0) {
                const obj_acomodador = {
                    id: id,
                    correo: "",
                    nombre: ""
                }

                nuevos_acomodadores.push(obj_acomodador)

                id++
                cantidad--
            }

            props.setAcomodadores(props.acomodadores.concat(nuevos_acomodadores))
        } else {
            alert("debes introducir la cantidad de acomodadores que quieres añadir")
        }
    }

    return(
        <div className="acomodadores">
            <div className="acomodadores__imagen">
                <img src="../../../figura-camper-cesped.png" alt="FIGRUA-CAMPER" />
                <button onClick={guardarCambios}><p>GUARDAR CAMBIOS</p>{ guardar && <div><i className="fa-solid fa-thumbs-up"></i></div> }</button>
            </div>
            <div className="acomodadores__contenido">
                {
                    props.acomodadores?.map((acomodador, indice) => {
                        return <Acomodador key={`acomodador-${indice}`} indice={indice+1} { ...acomodador } acomodadores={props.acomodadores} setAcomodadores={props.setAcomodadores} guardar={guardar} handleGuardarCambios={guardarCambios} />
                    })
                }
                <div className="acomodadores__contenido__anadir">
                    <p>añadir</p>
                    <input type="number" name="cantidad_acomodadores" id="cantidad_acomodadores" defaultValue={0} />
                    <p>acomodadores</p>
                    <button onClick={crearAcomodadores}><i className="fa-solid fa-plus"></i></button>
                </div>
            </div>
        </div>
    )
}

function Acomodador ({ indice, id, correo, nombre, acomodadores, setAcomodadores, guardar, handleGuardarCambios }) {

    const [ correoAcomodador, setCorreoAcomodador ] = useState(correo)
    const [ nombreAcomodador, setNombreAcomodador ] = useState(nombre)

    const [ borrar, setBorrar ] = useState(false)

    const refAcomodador = useRef(null)

    const guardarCambios = () => {
        const posicion = acomodadores.findIndex(a => a.id === id)
        const acomodadores_copia = acomodadores

        acomodadores_copia[posicion].correo = correoAcomodador
        acomodadores_copia[posicion].nombre = nombreAcomodador

        setAcomodadores(acomodadores_copia)
    }

    const borrarAcomodador = () => {
        const posicion = acomodadores.findIndex(a => a.id === id)
        const acomodadores_copia = acomodadores

        acomodadores_copia.splice(posicion, 1)

        setAcomodadores(acomodadores_copia)
        setBorrar(false)
        handleGuardarCambios()
    }

    useEffect(() => {
        guardar && guardarCambios()
    }, [guardar])

    useEffect(() => {
        setCorreoAcomodador(correo)
        setNombreAcomodador(nombre)
    }, [id])

    return(
        <div ref={refAcomodador} className="acomodador">
            <h4>{`ACOMODADOR ${indice}`}</h4>
            <div className="acomodador__info">
                <div className="acomodador__info__info">
                    <label htmlFor="acomodador_correo">correo:</label>
                    <input type="text" name="acomodador_correo" id="acomodador_correo" value={correoAcomodador} onChange={e => setCorreoAcomodador(e.target.value)} />
                </div>
                <div className="acomodador__info__info">
                    <label htmlFor="acomodador_nombre">nombre:</label>
                    <input type="text" name="acomodador_nombre" id="acomodador_nombre" value={nombreAcomodador} onChange={e => setNombreAcomodador(e.target.value)} />
                </div>
                <button onClick={() => setBorrar(true)}><i className="fa-solid fa-trash"></i></button>
                { borrar && <Mensaje mensaje={`¿Seguro que quieres eliminar el ACOMODADOR ${indice} ?`} accionCancelar={() => setBorrar(false)} accionAceptar={borrarAcomodador} /> }
            </div>
        </div>
    )
}