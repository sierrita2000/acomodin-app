import { LoginContext } from '../../../context/LoginContext'
import Acomodadores from '../../Registro/Acomodadores/Acomodadores'
import Parcelas from '../../Registro/Parcelas/Parcelas'
import Zonas from '../../Registro/Zonas/Zonas'
import './MiCamping.css'
import { useContext, useEffect, useState } from 'react'

export default function MiCamping () {

    const loginContext = useContext(LoginContext)

    const [ loading, setLoading ] = useState(false)

    /* Atributos Parcelas */
    const [ pequenaAncho, setPequenaAncho ] = useState(0)
    const [ pequenaLargo, setPequenaLargo ] = useState(0)
    const [ mediaAncho, setMediaAncho ] = useState(0)
    const [ mediaLargo, setMediaLargo ] = useState(0)
    const [ grandeAncho, setGrandeAncho ] = useState(0)
    const [ grandeLargo, setGrandeLargo ] = useState(0) 

    const [ tipos, setTipos ] = useState(new Array())

    const [ conceptosGenerales, setConceptosGenerales ] = useState(new Array())

    const [ caracteristicas, setCaracteristicas ] = useState(new Array())

    /* Atributos zonas */

    const [ zonas, setZonas ] = useState(new Array())

    /* Atributos acomodadores */

    const [ acomodadores, setAcomodadores ] = useState(new Array())

    console.log(acomodadores)

    /**
     * 
     * @param {Number} tipo 
     * @param {Array} conceptos 
     * @returns Array
     */
    const devolverConceptosPorTipo = (tipo, conceptos) => { // tipo === 0 ? tipos de acomodación : conceptos generales
        const tipos = ['665a0165c5f8973c88844b81', '665a0165c5f8973c88844b82', '665a0165c5f8973c88844b83', '665a0165c5f8973c88844b84', '665a0165c5f8973c88844b85', '665a0165c5f8973c88844b86', '665a0165c5f8973c88844b87']
        const conceptos_generales = ['665a0165c5f8973c88844b88', '665a0165c5f8973c88844b89', '665a0165c5f8973c88844b8a', '665a0165c5f8973c88844b8b']
  
        const conceptos_nuevos = tipo === 0 ? conceptos.filter(c => tipos.includes(c)) : conceptos.filter(c => conceptos_generales.includes(c))
        
        return conceptos_nuevos
    }

    const fetchDatosCamping = () => {
        fetch(`${import.meta.env.VITE_API_HOST}camping/id/${loginContext[0][0]}`)
        .then(response => response.json())
        .then(data => {
            setPequenaAncho(parseInt(data.results.tamanos[0]))
            setPequenaLargo(parseInt(data.results.tamanos[1]))
            setMediaAncho(parseInt(data.results.tamanos[2]))
            setMediaLargo(parseInt(data.results.tamanos[3]))
            setGrandeAncho(parseInt(data.results.tamanos[4]))
            setGrandeLargo(parseInt(data.results.tamanos[5]))
            setTipos(devolverConceptosPorTipo(0, data.results.conceptos))
            setConceptosGenerales(devolverConceptosPorTipo(1, data.results.conceptos))
            setCaracteristicas(data.results.caracteristicas)
        })
    }

    const fetchAcomodadores = () => {
        fetch(`${import.meta.env.VITE_API_HOST}acomodadores/id_camping/${loginContext[0][0]}`)
            .then(response => response.json())
            .then(data => {
                let acomodadores_nueva = new Array()
                let id = 1
                data.results.forEach(acomodador => {
                    const obj_acomodador = { id: id, correo: acomodador.correo, nombre: acomodador.nombre }

                    acomodadores_nueva.push(obj_acomodador)
                    id++
                })
                setAcomodadores(acomodadores_nueva)
            })
    }

    const fetchZonasParcelas = () => {
        fetch(`${import.meta.env.VITE_API_HOST}zonas/devolver-zonas/id_camping/${loginContext[0][0]}`)
            .then(response => response.json())
            .then(data => {
                let zonas_nuevas = new Array()
                let id = 1
                data.results.forEach(zona => {
                    const obj_zona = { id: id, nombre: zona.nombre, tipos: zona.tipos, parcelas: [] }

                    fetch(`${import.meta.env.VITE_API_HOST}parcelas/devolver-parcelas/id_zona/${zona._id}`)
                        .then(response => response.json())
                        .then(dataParcelas => {
                            let id_parcela = 1
                            dataParcelas.results.forEach(parcela => {
                                const obj_parcela = {
                                    id: id_parcela,
                                    nombre: parcela.nombre,
                                    tamano: parcela.tamano,
                                    tipos: parcela.tipos,
                                    electricidad: parcela.electricidad,
                                    caracteristicas: parcela.caracteristicas
                                }

                                obj_zona.parcelas.push(obj_parcela)
                                id_parcela++
                            })
                        })
                    
                    zonas_nuevas.push(obj_zona)
                    id++
                })
                
                setZonas(zonas_nuevas)
            })
    }

    useEffect(() => {
        if (loginContext[0][1] === 0) { throw new Error("Sin autorización") }
        
        setLoading(true)
        fetchDatosCamping()
        fetchZonasParcelas()
        fetchAcomodadores()
    }, [])

    return(
        <div className="mi_camping">
            <h2>CARACTERÍSTICAS DEL CAMPING</h2>
            <Parcelas pequenaAncho={pequenaAncho} setPequenaAncho={setPequenaAncho} mediaAncho={mediaAncho} setMediaAncho={setMediaAncho} grandeAncho={grandeAncho} setGrandeAncho={setGrandeAncho} pequenaLargo={pequenaLargo} setPequenaLargo={setPequenaLargo} mediaLargo={mediaLargo} setMediaLargo={setMediaLargo} grandeLargo={grandeLargo} setGrandeLargo={setGrandeLargo} tipos={tipos} setTipos={setTipos} conceptosGenerales={conceptosGenerales} setConceptosGenerales={setConceptosGenerales} caracteristicas={caracteristicas} setCaracteristicas={setCaracteristicas} />
            <h2 id='titulo_zonas'>ZONAS</h2>
            <Zonas zonas={zonas} setZonas={setZonas} tipos={tipos} caracteristicas={caracteristicas} luzCamping={conceptosGenerales.includes('665a0165c5f8973c88844b8b')} />
            <h2>ACOMODADORES</h2>
            <Acomodadores acomodadores={acomodadores} setAcomodadores={setAcomodadores} />
        </div>
    )
}