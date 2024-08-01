import { useEffect, useState } from 'react'
import { useFetch } from '../../../../hooks/useFetch'
import './ModalParcelas.css'

export default function ModalParcelas ({ fecha_inicio, fecha_fin, tipos, caracteristicas, id_camping, handlerCerrarModal, parcela, setParcela, parcelaAsignada }) {

    const [ parcelas, setParcelas ] = useState(new Array())
    const [ loading, setLoading ] = useState(true)

    const [ parcelaSeleccionada, setParcelaSeleccionada ] = useState(parcela)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_HOST}parcelas/devolver-parcelas-filtradas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_camping, fecha_inicio, fecha_fin, tipos, parcela_seleccionada: parcelaAsignada })
        })
        .then(response => response.json())
        .then(data => setParcelas(data.results))
        .finally(() => setLoading(false))
    }, [])

    return(
        <div className="modal_parcelas">
            <div className="modal_parcelas__modal">
                <button onClick={handlerCerrarModal}><i className="fa-solid fa-xmark"></i></button>
                <h2>PARCELAS DISPONIBLES ( {fecha_inicio.replaceAll('-', '/')} - {fecha_fin.replaceAll('-', '/')} )</h2>
                <div className="modal_parcelas__modal__parcelas">
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
                            parcelas ? (
                                <div className="modal_parcelas__modal__parcelas__lista">
                                    {
                                        parcelas.map(parcela => {
                                            return <ParcelaSimple { ...parcela } parcelaSeleccionada={parcelaSeleccionada} setParcelaSeleccionada={setParcelaSeleccionada} />
                                        })
                                    }
                                </div>
                            ): (
                                <div className="modal_parcelas__modal__parcelas__lista_vacia">
                                    <p>NO HAY PARCELAS DISPONIBLES</p>
                                    <img src="/figura-tienda-cesped.png" alt="FIGURA-TIENDA" />
                                </div>
                            )
                        )
                    }
                </div>
                <div className="modal_parcelas__modal__botones">
                    <button onClick={handlerCerrarModal}>CANCELAR</button>
                    <button onClick={() => { setParcela(parcelaSeleccionada); handlerCerrarModal() }}>ASIGNAR</button>
                </div>
            </div>
        </div>
    )
}

function ParcelaSimple ({ _id, nombre, electricidad, tipos, caracteristicas, parcelaSeleccionada, setParcelaSeleccionada }) {

    let [ dataConceptos ] = useFetch(`${import.meta.env.VITE_API_HOST}conceptos/devolver-conceptos`)

    return(
        <div id={_id} className="modal_parcelas__parcela" onClick={() => (parcelaSeleccionada != _id) ? setParcelaSeleccionada(_id) : setParcelaSeleccionada("0")}>
            <section>
                <p>{nombre}</p>
            </section>
            <section>
                {
                    dataConceptos?.results.filter(c => tipos.includes(c._id)).map(concepto => {
                        return <img src={`${import.meta.env.VITE_API_HOST}static/${concepto.imagen}`} alt={`FIGURA-${concepto.nombre.toUpperCase()}`} />
                    })
                }
            </section>
            <section>
                {   
                    caracteristicas.map(caracteristica => {
                        return <p>+ {caracteristica}</p>
                    })
                }
            </section>
            <section>
                <img className={electricidad ? 'luz' : 'sin_luz'} src={`${import.meta.env.VITE_API_HOST}static/${dataConceptos?.results.find(c => c.nombre === 'electricidad').imagen}`} alt="FIGURA-ELECTRICIDAD" />
            </section>
            { 
                (parcelaSeleccionada === _id) && 
                    (
                        <div className="modal_parcelas__parcela__circulo">
                            <i className="fa-solid fa-circle-check"></i>
                        </div>
                    )
            }
        </div>
    )
}