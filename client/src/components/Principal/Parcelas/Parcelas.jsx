import { useContext, useEffect, useState } from 'react'
import './Parcelas.css'
import { LoginContext } from '../../../context/LoginContext'
import { useFetch } from '../../../hooks/useFetch'
import Parcela from './Parcela/Parcela'

export default function Parcelas () {

    const loginContext = useContext(LoginContext)

    const [ zonas, setZonas ] = useState([])
    const [ parcela, setParcela ] = useState(null)

    console.log(zonas)

    const [ loading, setLoading ] = useState(true)

    //const [ dataUsuario ] = useFetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador': 'camping'}/id/${loginContext[0][0]}`)

    const abrirCerrarZona = (id_zona) => {
        const icono_flecha = document.getElementById(id_zona).querySelector('.parcelas__izq__zona__titulo i')
        const listado_parcelas = document.getElementById(id_zona).querySelector('.parcelas__izq__zona__parcelas')

        icono_flecha.classList.toggle('icono_girado')
        listado_parcelas.classList.toggle('listado_parcelas_desplegado')
    }
    
    useEffect(() => {
        let zonas_camping = []
        fetch(`${import.meta.env.VITE_API_HOST}${loginContext[0][1] === 0 ? 'acomodador': 'camping'}/id/${loginContext[0][0]}`)
            .then(response => response.json())
            .then(dataUsuario => {
                fetch(`${import.meta.env.VITE_API_HOST}zonas/devolver-zonas/id_camping/${loginContext[0][1] === 0 ? dataUsuario.results.id_camping : dataUsuario.results._id}`)
                .then(response => response.json())
                .then(dataZonas => {
                    if(dataZonas.status === 'ok') {
                        dataZonas.results.forEach(zona => {
                            fetch(`${import.meta.env.VITE_API_HOST}parcelas/devolver-parcelas/id_zona/${zona._id}`)
                                .then(response => response.json())
                                .then(dataParcelas => {
                                    zonas_camping.push([zona, dataParcelas.results])
                                })
                                .finally(() => setZonas(zonas.concat(zonas_camping)))
                        })
                    }
                })
            })
            .finally(() => { setLoading(false) })
    }, [])

    return(
        <div className="principal__parcelas">
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
                        <div className='parcelas__izq'>
                            {
                                zonas.map(zona => {
                                    console.log(zona)
                                    return (
                                        <div id={zona[0]._id} className='parcelas__izq__zona'>
                                            <div onClick={() => abrirCerrarZona(zona[0]._id)} className="parcelas__izq__zona__titulo">
                                                <i className="fa-solid fa-caret-right"></i>
                                                <span>{zona[0].nombre}</span>
                                            </div>
                                            <div className="parcelas__izq__zona__parcelas">
                                                {
                                                    zona[1].map(p => {
                                                        return (
                                                            <button className={`parcelas__izq__zona__parcelas__button ${(parcela === p._id) && 'parcela__activa'}`} onClick={() => setParcela(p._id)}>{p.nombre}</button>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="parcelas__der">
                            {
                                parcela ? (
                                    <Parcela id_parcela={parcela} />
                                ) : (
                                    <div className="parcelas__der__vacia">
                                        <p>Selecciona una parcela</p>
                                        <img src="../../../../figura-hoguera.png" alt="FIGURA-HOGUERA" />
                                    </div>
                                )
                            }
                        </div>
                    </>
                )
            }
            
        </div>
    )
}

