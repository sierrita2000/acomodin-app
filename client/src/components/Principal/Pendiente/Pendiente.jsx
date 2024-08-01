import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import './Pendiente.css'
import EstanciaSimple from '../Estancia/EstanciaSimple/EstanciaSimple'

export default function Pendiente() {

    const [ , , pendientes] = useOutletContext()

    const navigate = useNavigate()

    return(
        <div className="pendiente">
            {
                pendientes ? (
                    <>
                        <section className='pendiente__section'>
                            <h2>ENTRADAS SIN REGISTRAR</h2>
                            <div>
                                {
                                    (pendientes[0].length > 0) ? (
                                        pendientes[0].map(estancia => {
                                            return <EstanciaSimple { ...estancia } handlerEstancia={() => navigate(`/principal/pendiente/${estancia.estancia_accion._id}`, { replace: true })} />
                                        })
                                    ) : (
                                        <div className="estancias_vacias">
                                            <p>NO HAY ENTRADAS SIN REGISTRAR</p>
                                            <img src="/figura-hoguera.png"/>
                                        </div>
                                    )
                                }
                            </div>
                        </section>
                        <section className='pendiente__section'>
                            <h2>SALIDAS SIN REGISTRAR</h2>
                            <div>
                            {
                                    (pendientes[1].length > 0) ? (
                                        pendientes[1].map(estancia => {
                                            return <EstanciaSimple { ...estancia } handlerEstancia={() => navigate(`/principal/pendiente/${estancia.estancia_accion._id}`, { replace: true })} />
                                        })
                                    ) : (
                                        <div className="estancias_vacias">
                                            <p>NO HAY SALIDAS SIN REGISTRAR</p>
                                            <img src="/figura-hoguera.png"/>
                                        </div>
                                    )
                                }
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="estancias_vacias">
                        <p>NO HAY ENTRADAS SIN REGISTRAR</p>
                        <img src="/figura-hoguera.png"/>
                    </div>
                )
            }
            <Outlet />
        </div>
    )
}