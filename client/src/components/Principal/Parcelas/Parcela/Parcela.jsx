import { useFetch } from '../../../../hooks/useFetch'
import './Parcela.css'

export default function Parcela ({ id_parcela }) {

    let [ dataParcela, error, loading ] = useFetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${id_parcela}`)

    return(
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
            <div className="parcelas__der__parcela">
                <div className="parcelas__der__parcela__nombre">
                    <p>{dataParcela?.results.nombre}</p>
                </div>
                <div className="parcelas__der__parcela__informacion">
                    <section className="parcela__informacion__arriba">
                        <section>
                            <div className="parcela__informacion__tamano">
                                <h4>tamaño:</h4>
                                <p>{dataParcela?.results.tamano}</p>
                            </div>
                            <div className="parcela__informacion__electricidad">
                                <h4>electricidad:</h4>
                                <img className={dataParcela?.results.electricidad ? 'incluida' : 'sin_incluir'} src={`${import.meta.env.VITE_API_HOST}static/figura-luz.png`} alt="FIGURA-LUZ" />
                            </div>
                            <div className="parcela__informacion__estado">
                                <h4>estado:</h4>
                                <div className="parcela__informacion__estado__circulo"></div>
                            </div>
                        </section>
                        <section>
                            <div className="parcela__informacion__tipos">
                                <h4>tipos:</h4>

                            </div>
                            <div className="parcela__informacion__caracteristicas">
                                <h4>características:</h4>
                            </div>
                        </section>
                    </section>
                    <section className="parcela__informacion__abajo">
                        <h2>Reservas</h2>
                        <div className="parcela__informacion__abajo__caja">

                        </div>
                    </section>
                </div>
            </div>
        )
    )
}