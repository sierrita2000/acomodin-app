import { useEffect, useRef, useState } from 'react'
import './Parcela.css'
import Figura from '../../../BotonFigura/Figura'
import Mensaje from '../../../Mensaje/Mensaje'
import { useFetch } from '../../../../hooks/useFetch'

export default function Parcela ({ guardar, id, nombre, tamano, tipos, electricidad, caracteristicas, tiposZona, caracteristicasCamping, handleGuardarCambios, zonas, setZonas, posicionZona, luzCamping, parcelasZona, setParcelasZona }) {

    const [ nombreParcela, setNombreParcela ] = useState(nombre)
    const [ tamanoParcela, setTamanoParcela ] = useState(tamano)
    const [ tiposParcela, setTiposParcela ] = useState(tipos)
    const [ electricidadParcela, setElectricidadParcela ] = useState(electricidad)
    const [ caracteristicasParcela, setCaracteristicasParcela ] = useState(caracteristicas)

    const [ borrar, setBorrar ] = useState(false)

    const refParcela = useRef(null)

    const [ data ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)

    const figuras = data?.results.filter(f => tiposZona.includes(f._id))

    const borrarParcela = () => {
        const posicion = parcelasZona.findIndex(p => p.id === id)
        const copia_parcelasZona = parcelasZona.slice(0, posicion).concat(parcelasZona.slice(posicion+1))

        setParcelasZona(copia_parcelasZona)
        setBorrar(false)
    }

    const guardarCambios = () => {
        const posicion = zonas[posicionZona].parcelas.findIndex(p => p.id === id)
        const zonas_copia = zonas

        zonas_copia[posicionZona].parcelas[posicion].nombre = nombreParcela
        zonas_copia[posicionZona].parcelas[posicion].tamano = tamanoParcela
        zonas_copia[posicionZona].parcelas[posicion].tipos = tiposParcela
        zonas_copia[posicionZona].parcelas[posicion].electricidad = electricidadParcela
        zonas_copia[posicionZona].parcelas[posicion].caracteristicas = caracteristicasParcela

        setZonas(zonas_copia)
    }

    const incluirBorrarCaracteristica = (e) => {
        const c = e.target.value
        if (caracteristicasParcela.includes(c)) {
            setCaracteristicasParcela(caracteristicasParcela.filter(caracteristica => caracteristica != c))
        } else {
            setCaracteristicasParcela(caracteristicasParcela.concat(c))
        }
    }

    useEffect(() => {
        guardar && guardarCambios()
    }, [guardar])

    useEffect(() => {
        setNombreParcela(nombre)
        setTamanoParcela(tamano)
        setTiposParcela(tipos)
        setCaracteristicasParcela(caracteristicas)
        luzCamping ? setElectricidadParcela(electricidad) : setElectricidadParcela(false)

        refParcela.current.querySelectorAll(`input[type="checkbox"]`).forEach(checkbox => {
            if (caracteristicas.includes(checkbox.value)) checkbox.checked = true 
            else checkbox.checked = false
        })

        refParcela.current.querySelector(`select option[value="${tamano}"]`).selected = true
    }, [id, tipos, tiposZona, luzCamping, caracteristicasCamping])

    return(
        <div id={`parcela-${id}`} ref={refParcela} className="parcela">
            <div className="parcela__cuadro_1">
                <input type="text" name="parcela_nombre" id="parcela_nombre" value={nombreParcela} onChange={e => setNombreParcela(e.target.value)} />
                <div className="parcela__cuadro_1__tamano">
                    <p>tamaño:</p>
                    <select name="parcela_tamano" id="parcela_tamano" onChange={e => setTamanoParcela(e.target.value)} >
                        <option value="pequeña">pequeña</option> 
                        <option value="media">media</option>
                        <option value="grande">grande</option>
                    </select>
                </div>
            </div>
            <div className='parcela__tipos'>
                {
                    figuras?.map((figura, indice) => {
                        return <Figura key={indice} id={figura?._id} imagen={figura?.imagen} titulo={figura?.nombre} tipos={tiposParcela} setTipos={setTiposParcela}/>
                    })
                }
            </div>
            <div className="parcela__caracteristicas">
                {
                    caracteristicasCamping.map((caracteristica, indice) => {
                        return (
                            <div key={indice} className="parcela__caracteristicas__caracteristica">
                                <label><input type="checkbox" className='checkbox_caracteristica' value={caracteristica} onChange={e => incluirBorrarCaracteristica(e)} /><div><i className="fa-solid fa-check"></i></div></label>
                                <p>{caracteristica}</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className={`parcela__luz ${!luzCamping && 'sin__luz'}`}>
                <button onClick={() => luzCamping && setElectricidadParcela(!electricidadParcela)}><img src={`${import.meta.env.VITE_API_HOST}static/figura-luz.png`} alt="FIGURA-LUZ" className={ electricidadParcela && 'luz__activada' } /></button>
            </div>
            <div className="parcela__boton__eliminar">
                <button onClick={() => setBorrar(true)}><i className="fa-solid fa-trash"></i></button>
                { borrar && <Mensaje mensaje={`¿Seguro que quieres eliminar la parcela "${nombreParcela}" ?`} accionCancelar={() => setBorrar(false)} accionAceptar={borrarParcela} /> }
            </div>
        </div>
    )
}