import { useContext, useEffect, useState } from 'react'
import { useFetch } from '../../../../hooks/useFetch'
import { Link, useLocation } from 'react-router-dom'
import './Parcela.css'
import Estancia from '../../Estancia/Estancia'

export default function Parcela ({ id_parcela }) {

    let location = useLocation()

    const [ reservas, setReservas ] = useState(null)
    const [ loadingReservas, setLoadingReservas ] = useState(false)
    console.log(reservas)

    let [ dataParcela, errorParcela, loadingParcela ] = useFetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${id_parcela}`)
    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)

    useEffect(() => {
        setLoadingReservas(true)
        fetch(`${import.meta.env.VITE_API_HOST}estancias/reservas/id_parcela/${id_parcela}`)
            .then(response => response.json())
            .then(data => setReservas(data.results))
            .finally(() => setLoadingReservas(false))
    }, [location, id_parcela])

    return(
        loadingParcela ? (
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
            <div className="parcelas__der__parcela">
                <div className="parcelas__der__parcela__nombre">
                    <p>{dataParcela?.results.nombre}</p>
                </div>
                <div className="parcelas__der__parcela__informacion">
                    <section className="parcela__informacion__arriba">
                            <div className="parcela__informacion__tamano">
                                <h4>tamaño</h4>
                                <p>{dataParcela?.results.tamano}</p>
                            </div>
                            <div className="parcela__informacion__electricidad">
                                <h4>electricidad</h4>
                                <div>
                                    <img className={!dataParcela?.results.electricidad && 'sin_incluir'} src={`${import.meta.env.VITE_API_HOST}static/figura-luz.png`} alt="FIGURA-LUZ" />
                                    {!dataParcela?.results.electricidad && <div className="raya_cruzada"></div>}
                                </div>
                            </div>
                            <div className="parcela__informacion__estado">
                                <h4>estado</h4>
                                <div className="parcela__informacion__estado__circulo"></div>
                            </div>
                            <div className="parcela__informacion__tipos">
                                <h4>tipos</h4>
                                <div className="parcela__informacion__tipos__lista">
                                    {
                                        dataConceptos?.results.filter(c => dataParcela?.results.tipos.includes(c._id)).map(tipo => {
                                            return <img src={`${import.meta.env.VITE_API_HOST}static/${tipo.imagen}`} alt={`FIGURA-${tipo.nombre.toUpperCase()}`}></img>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="parcela__informacion__caracteristicas">
                                <h4>características</h4>
                                <div className="parcela__informacion__caracteristicas__lista">
                                    {
                                        dataParcela?.results.caracteristicas.map(caracteristica => {
                                            return(
                                                <span>
                                                    {caracteristica}
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                    </section>
                    <section className="parcela__informacion__abajo">
                        <h2>Reservas</h2>
                        <div className="parcela__informacion__abajo__caja">
                            {
                                loadingReservas ? (
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
                                    reservas ? (
                                        <div className="parcelas__reservas">
                                                {
                                                    reservas.map(reserva => {
                                                        return <EstanciaReservas { ...reserva } />
                                                    })
                                                }
                                        </div>
                                    ) : (
                                        <div className="parcelas__reservas__vacia">
                                            <p>¡No hay reservas aún!</p>
                                            <img src="../../../../../figura-tienda-cesped.png" alt="FIGURA-TIENDA" />
                                            <Link className='btn_anadir_estancia' to={`/principal/parcelas/${id_parcela}/formulario-reserva`}>AÑADIR RESERVA</Link>
                                        </div>
                                    )
                                )
                            }
                        </div>
                        {
                            reservas && <Link className='btn_anadir_estancia' to={`/principal/parcelas/${id_parcela}/formulario-reserva`}>AÑADIR RESERVA</Link>
                        }
                    </section>
                </div>
            </div>
        )
    )
}

function EstanciaReservas({ estancia, estancia_accion }) {

    let [ dataUsuario ] = useFetch(`${import.meta.env.VITE_API_HOST}${estancia_accion.tipo_usuario === 'acomodador' ? 'acomodador/' : 'camping/'}id/${estancia_accion.id_usuario}`)

    return(
        <div className="parcelas__reservas__estancia">
            <div className="parcelas__reservas__estancia__imagen">
                <img src={`${import.meta.env.VITE_API_HOST}static/${dataUsuario?.results.imagen}`} alt="IMAGEN-USUARIO" />
            </div>
            <div className="parcelas__reservas__estancia__info">
                <p>{estancia.nombre}</p>
                <span></span>
                <p>{estancia.telefono || '-'}</p>
                <span></span>
                <p>{estancia.fecha_inicio.replaceAll('-', '/')} - {estancia.fecha_fin.replaceAll('-', '/')}</p>
            </div>
        </div>
    )
}