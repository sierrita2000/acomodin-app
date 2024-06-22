import { useEffect, useState } from 'react'
import { useFetch } from '../../../../hooks/useFetch'
import './Parcela.css'

export default function Parcela ({ id_parcela }) {

    let [ dataParcela, errorParcela, loadingParcela ] = useFetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${id_parcela}`)
    let [ dataReservas, errorReservas, loadingReservas ] = useFetch(`${import.meta.env.VITE_API_HOST}estancias/reservas/id_parcela/${id_parcela}`)
    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)

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
                                    dataReservas?.results.length > 0 ? (
                                        <div className="parcelas__reservas"></div>
                                    ) : (
                                        <div className="parcelas__reservas__vacia">
                                            <p>¡No hay reservas aún!</p>
                                            <img src="../../../../../figura-tienda-cesped.png" alt="FIGURA-TIENDA" />
                                            <button>AÑADIR RESERVA</button>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </section>
                </div>
            </div>
        )
    )
}