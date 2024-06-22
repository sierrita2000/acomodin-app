import { LoginContext } from '../../../context/LoginContext'
import Mensaje from '../../Mensaje/Mensaje'
import Acomodadores from '../../Registro/Acomodadores/Acomodadores'
import Parcelas from '../../Registro/Parcelas/Parcelas'
import Zonas from '../../Registro/Zonas/Zonas'
import './MiCamping.css'
import { useContext, useEffect, useState } from 'react'

export default function MiCamping () {

    const loginContext = useContext(LoginContext)

    const [ mensaje, setMensaje ] = useState(false) 
    
    const [ errorAcomodadores, setErrorAcomodadores ] = useState(false)
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

    /**
     * Función para separar los tipos de acomodación de los conceptos generales.
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

    /**
     * Recupera los datos del camping.
     */
    const fetchDatosCamping = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}camping/id/${loginContext[0][0]}`)
        const data = await response.json()

        if (data.status === 'ok') {
            setPequenaAncho(parseInt(data.results.tamanos[0]))
            setPequenaLargo(parseInt(data.results.tamanos[1]))
            setMediaAncho(parseInt(data.results.tamanos[2]))
            setMediaLargo(parseInt(data.results.tamanos[3]))
            setGrandeAncho(parseInt(data.results.tamanos[4]))
            setGrandeLargo(parseInt(data.results.tamanos[5]))
            setTipos(devolverConceptosPorTipo(0, data.results.conceptos))
            setConceptosGenerales(devolverConceptosPorTipo(1, data.results.conceptos))
            setCaracteristicas(data.results.caracteristicas)
        }
    }

    /**
     * Recupera los datos de los acomodoadores.
     */
    const fetchAcomodadores = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_HOST}acomodadores/id_camping/${loginContext[0][0]}`)
        const data = await response.json()

        if (data.status === 'ok') {
            let acomodadores_nueva = new Array()
            data.results.forEach(acomodador => {
                const obj_acomodador = { id: acomodador._id, correo: acomodador.correo, nombre: acomodador.nombre }

                acomodadores_nueva.push(obj_acomodador)
            })
            setAcomodadores(acomodadores_nueva)
        }
    }

    /**
     * Recupera los datos de las zonas y de sus parcelas.
     */
    const fetchZonasParcelas = async () => {
        const responseZonas = await fetch(`${import.meta.env.VITE_API_HOST}zonas/devolver-zonas/id_camping/${loginContext[0][0]}`)
        const dataZonas = await responseZonas.json()
        
        if(dataZonas.status === 'ok') {
            let zonas_nuevas = new Array()
            dataZonas.results.forEach(async zona => {
                const obj_zona = { id: zona._id, nombre: zona.nombre, tipos: zona.tipos, parcelas: [] }

                const responseParcelas = await fetch(`${import.meta.env.VITE_API_HOST}parcelas/devolver-parcelas/id_zona/${zona._id}`)
                const dataParcelas = await responseParcelas.json()

                if (dataParcelas.status === 'ok') {
                            dataParcelas.results.forEach(parcela => {
                                const obj_parcela = {
                                    id: parcela._id,
                                    nombre: parcela.nombre,
                                    tamano: parcela.tamano,
                                    tipos: parcela.tipos,
                                    electricidad: parcela.electricidad,
                                    caracteristicas: parcela.caracteristicas
                                }

                                obj_zona.parcelas.push(obj_parcela)
                            })
                        }
                    
                    zonas_nuevas.push(obj_zona)
            })
                
            setZonas(zonas_nuevas)       
        }
    }

    /**
     * Actualiza los datos del camping.
     */
    const guardarDatosCamping = async () => {
        if (errorAcomodadores) {
            alert("Revisa los errores en los datos de los acomodadores.")
        } else {
            setLoading(true)
            // Se actualizan las caracteristicas del camping
            const responseCamping = await fetch(`${import.meta.env.VITE_API_HOST}camping/actualizar-camping/id/${loginContext[0][0]}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tamanos: [ pequenaAncho, pequenaLargo, mediaAncho, mediaLargo, grandeAncho, grandeLargo ],
                    caracteristicas: caracteristicas,
                    tipos: [...tipos, ...conceptosGenerales]
                })
            })
            const dataCamping = await responseCamping.json()

            // Se actualizan las zonas y las parcelas del camping
            const responseZonasParcelas = await fetch(`${import.meta.env.VITE_API_HOST}zonas/actualizar-zonas/id_camping/${loginContext[0][0]}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ zonas })
            })
            const dataZonasParcelas = await responseZonasParcelas.json()

            // Se actualizan los acomodadores del camping
            const responseAcomodadores = await fetch(`${import.meta.env.VITE_API_HOST}acomodadores/actualizar-acomodadores/id_camping/${loginContext[0][0]}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ acomodadores })
            })
            const dataAcomodadores = await responseAcomodadores.json()

            if (dataCamping.status === 'ok' && dataZonasParcelas.status === 'ok' && dataAcomodadores.status === 'ok') {
                setLoading(false)
                alert('Datos guardados correctamente')
            }
        }
        setMensaje(false) 
    }



    /**
     * Actualiza los cambios de zonas y parcelas cunado cambian las caracteristicas del camping.
     */
    const actualizarCambios = () => {
        const copia_zonas = [ ...zonas ]

        copia_zonas.forEach(zona => {
            zona.tipos = zona.tipos.filter(tipo => tipos.includes(tipo))

            zona.parcelas.forEach(parcela => {
                parcela.caracteristicas = parcela.caracteristicas.filter(caracteristica => caracteristicas.includes(caracteristica))
                if (!conceptosGenerales.includes('665a0165c5f8973c88844b8b') && parcela.electricidad) parcela.electricidad = false
                parcela.tipos = parcela.tipos.filter(tipo => zona.tipos.includes(tipo))
            })
        })

        setZonas(copia_zonas)
    }

    useEffect(() => {
        if (loginContext[0][1] === 0) { throw new Error("Sin autorización") }
        fetchDatosCamping()
        fetchZonasParcelas()
        fetchAcomodadores()
    }, [])

    console.log(zonas)

    return(
        <div className="mi_camping">
            <h2>CARACTERÍSTICAS DEL CAMPING</h2>
            <Parcelas pequenaAncho={pequenaAncho} setPequenaAncho={setPequenaAncho} mediaAncho={mediaAncho} setMediaAncho={setMediaAncho} grandeAncho={grandeAncho} setGrandeAncho={setGrandeAncho} pequenaLargo={pequenaLargo} setPequenaLargo={setPequenaLargo} mediaLargo={mediaLargo} setMediaLargo={setMediaLargo} grandeLargo={grandeLargo} setGrandeLargo={setGrandeLargo} tipos={tipos} setTipos={setTipos} conceptosGenerales={conceptosGenerales} setConceptosGenerales={setConceptosGenerales} caracteristicas={caracteristicas} setCaracteristicas={setCaracteristicas} />
            <button onClick={actualizarCambios} className='parcelas_guardar_cambios_btn'>GUARDAR CAMBIOS</button>
            <h2 id='titulo_zonas'>ZONAS</h2>
            <Zonas zonas={zonas} setZonas={setZonas} tipos={tipos} caracteristicas={caracteristicas} luzCamping={conceptosGenerales.includes('665a0165c5f8973c88844b8b')} />
            <h2>ACOMODADORES</h2>
            <Acomodadores acomodadores={acomodadores} setAcomodadores={setAcomodadores} error={errorAcomodadores} setError={setErrorAcomodadores} />
            <div className='mi_camping__raya'></div>
            <div className="mi_camping__botones">
                <button onClick={() => setMensaje(true)}>{ 
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
                        'GUARDAR NUEVOS DATOS'
                    )
                }</button>
            </div>
            {
                mensaje && (
                    <Mensaje mensaje={'¿Seguro que desea actualizar los datos de su camping?'} accionCancelar={() => setMensaje(false)} accionAceptar={guardarDatosCamping} />
                )
            }
        </div>
    )
}