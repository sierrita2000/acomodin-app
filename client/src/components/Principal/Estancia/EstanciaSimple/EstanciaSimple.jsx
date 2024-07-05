import './EstanciaSimple.css'
import { useFetch } from '../../../../hooks/useFetch'

export default function EstanciaSimple ({ estancia, estancia_accion, handlerEstancia }) {

    let [ dataUsuario ] = useFetch(`${import.meta.env.VITE_API_HOST}${estancia_accion.tipo_usuario}/id/${estancia_accion.id_usuario}`)
    let [ dataParcela ] = useFetch(`${import.meta.env.VITE_API_HOST}parcelas/id/${estancia.parcela || 0}`)

    return(
        <div className="estancia_simple" onClick={handlerEstancia} >
             <div className="estancia_simple__imagen">
                    <img title={dataUsuario?.results.usuario} src={`${import.meta.env.VITE_API_HOST}static/${dataUsuario?.results.imagen}`} alt="IMAGEN-USUARIO" />
                </div>
                <div className="estancia_simple__informacion">
                    <div>
                        <i className="fa-solid fa-user"></i>
                        <p>{estancia.nombre}</p>
                    </div>
                    <div className="estancia_simple__informacion__raya"></div>
                    <div>
                        <i className="fa-solid fa-phone"></i>
                        <p>{estancia.telefono || '-'}</p>
                    </div>
                    <div className="estancia_simple__informacion__raya"></div>
                    <div>
                        <i className="fa-solid fa-calendar-days"></i>
                        <p>{estancia.fecha_inicio.replaceAll('-', '/')} - {estancia.fecha_fin.replaceAll('-', '/')}</p>
                    </div>
                    <div className="estancia_simple__informacion__raya"></div>
                    <div>
                        <i className="fa-solid fa-campground"></i>
                        <p>{ (dataParcela?.status === 'ok') ? dataParcela?.results.nombre : '-' }</p>
                    </div>
                </div>
                <div className={`estancia_simple__estado ${estancia_accion.estado === 'reserva' ? 'estancia_simple__estado__reserva' : estancia_accion.estado === 'entrada' ? 'estancia_simple__estado__entrada' : 'estancia_simple__estado__salida'}`}></div>
        </div>
    )
}