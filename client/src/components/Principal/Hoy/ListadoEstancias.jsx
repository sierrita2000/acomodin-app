import { Outlet, useNavigate } from 'react-router-dom'
import './ListadoEstancias.css'
import EstanciaSimple from '../Estancia/EstanciaSimple/EstanciaSimple'

export default function ListadoEstancias ({ estancias, loading, texto_estancias_vacias, url }) {

    const navigate = useNavigate()

    return(
        <div className="listado_estancias">
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
                    estancias.length > 0 ? (
                        estancias?.sort((a, b) => {
                            const id_zona_A = a.estancia.parcela ? a.estancia.parcela.toUpperCase() : '-'
                            const id_zona_B = b.estancia.parcela ? b.estancia.parcela.toUpperCase() : '-'

                            if(id_zona_A < id_zona_B) return -1
                            if(id_zona_A > id_zona_B) return 1
                            else return 0
                        }).map(estancia => {
                            return <EstanciaSimple { ...estancia } handlerEstancia={() => navigate(`${url}${estancia.estancia_accion._id}`)} />
                        })
                    ) : (
                        <div className="listado_estancias__vacias">
                            <p>{texto_estancias_vacias}</p>
                            <img src="../../../../../figura-hoguera.png" alt="FIGURA-HOGUERA" />
                        </div>
                    )
                )
            }
            <Outlet />
        </div>
    )
}