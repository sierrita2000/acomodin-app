import { useEffect, useRef, useState } from 'react'
import './Parcela.css'
import Figura from '../../../BotonFigura/Figura'
import Mensaje from '../../../Mensaje/Mensaje'

export default function Parcela ({ guardar, id, nombre, tamano, tipos, luz, caracteristicas, tiposZona, caracteristicasCamping, handleGuardarCambios, zonas, setZonas, posicionZona, luzCamping, parcelasZona, setParcelasZona }) {

    const [ nombreParcela, setNombreParcela ] = useState(nombre)
    const [ tamanoParcela, setTamanoParcela ] = useState(tamano)
    const [ tiposParcela, setTiposParcela ] = useState(tipos)
    const [ luzParcela, setLuzParcela ] = useState(luz)
    const [ caracteristicasParcela, setCaracteristicasParcela ] = useState(caracteristicas)

    const [ borrar, setBorrar ] = useState(false)

    const refParcela = useRef(null)

    const figuras = [
        ['tipis', '../../../figura-tipi.png'],
        ['bungalows', '../../../figura-bungalow.png'],
        ['tiendas', '../../../figura-tienda.png'],
        ['caravanas', '../../../figura-caravana.png'],
        ['campers', '../../../figura-camper.png'],
        ['autocaravanas', '../../../figura-autocaravana.png'],
        ['carros tienda', '../../../figura-carro.png'],
    ]

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
        zonas_copia[posicionZona].parcelas[posicion].luz = luzParcela
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
        luzCamping ? setLuzParcela(luz) : setLuzParcela(false)

        refParcela.current.querySelectorAll(`input[type="checkbox"]`).forEach(checkbox => {
            if (caracteristicas.includes(checkbox.value)) checkbox.checked = true 
            else checkbox.checked = false
        })

        refParcela.current.querySelector(`select option[value="${tamano}"]`).selected = true
    }, [id])

    return(
        <div ref={refParcela} className="parcela">
            <div className="parcela__cuadro_1">
                <input type="text" name="parcela_nombre" id="parcela_nombre" value={nombreParcela} onChange={e => setNombreParcela(e.target.value)} />
                <div className="parcela__cuadro_1__tamano">
                    <p>tamaño:</p>
                    <select name="parcela_tamano" id="parcela_tamano" onChange={e => setTamanoParcela(e.target.value)} >
                        <option value="pequena">pequeña</option>
                        <option value="media">media</option>
                        <option value="grande">grande</option>
                    </select>
                </div>
            </div>
            <div className='parcela__tipos'>
                {
                    figuras.map((figura, indice) => {
                        if (tiposZona.includes(figura[0])) return <Figura key={indice} imagen={figura[1]} titulo={figura[0]} tipos={tiposParcela} setTipos={setTiposParcela}/>
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
                <button onClick={() => luzCamping && setLuzParcela(!luzParcela)}><img src="../../../figura-luz.png" alt="FIGURA-LUZ" className={ luzParcela && 'luz__activada' } /></button>
            </div>
            <div className="parcela__boton__eliminar">
                <button onClick={() => setBorrar(true)}><i className="fa-solid fa-trash"></i></button>
                { borrar && <Mensaje mensaje={`¿Seguro que quieres eliminar la zona "${nombreParcela}" ?`} accionCancelar={() => setBorrar(false)} accionAceptar={borrarParcela} /> }
            </div>
        </div>
    )
}