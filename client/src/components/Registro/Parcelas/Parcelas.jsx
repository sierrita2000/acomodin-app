import './Parcelas.css'
import Figura from '../../BotonFigura/Figura'

export default function Parcelas ( props ) {

    const figuras = [
        ['tipis', '../../../figura-tipi.png'],
        ['bungalows', '../../../figura-bungalow.png'],
        ['tiendas', '../../../figura-tienda.png'],
        ['caravanas', '../../../figura-caravana.png'],
        ['campers', '../../../figura-camper.png'],
        ['autocaravanas', '../../../figura-autocaravana.png'],
        ['carros tienda', '../../../figura-carro.png'],
    ]

    const otras_figuras = [
        ['coches', '../../../figura-coche.png'],
        ['motos', '../../../figura-moto.png'],
        ['mascotas', '../../../figura-perro.png'],
        ['electricidad', '../../../figura-luz.png']
    ]

    const anadirCaracteristica = () => {
        const caracteristica = document.getElementById('input_caracteristicas')

        if (caracteristica.value) {
            props.setCaracteristicas(props.caracteristicas.concat(caracteristica.value))
            caracteristica.value = ''
        }
    }

    return(
        <div className="parcelas">
            <div className="parcelas__imagen">
                <img src="../../../figura-caravana-cesped.png" alt="FIGURA-CARAVANA" />
            </div>
            <div className="parcelas__caracteristicas">
                <div className="parcelas__caracteristicas__tamanos">
                    <h4>TAMAÑOS (metros):</h4>
                    <div className="tamanos__tabla">
                        <div></div>
                        <div className='tamanos__tabla__titulo'><p>ancho</p></div>
                        <div className='tamanos__tabla__titulo'><p>largo</p></div>
                        <div className='tamanos__tabla__titulo'><p>pequeña</p></div>
                        <Botones tamano={props.pequenaAncho} setTamano={props.setPequenaAncho} />
                        <Botones tamano={props.pequenaLargo} setTamano={props.setPequenaLargo} />
                        <div className='tamanos__tabla__titulo'><p>media</p></div>
                        <Botones tamano={props.mediaAncho} setTamano={props.setMediaAncho} />
                        <Botones tamano={props.mediaLargo} setTamano={props.setMediaLargo} />
                        <div className='tamanos__tabla__titulo'><p>grande</p></div>
                        <Botones tamano={props.grandeAncho} setTamano={props.setGrandeAncho} />
                        <Botones tamano={props.grandeLargo} setTamano={props.setGrandeLargo} />
                    </div>
                    <p className='informacion'>* Se recomienda fijar los tamaños máximos para cada tipo. De este modo, al buscar una parcela para un modo de acampada del que conocemos sus medidas, nos resultará más fácil</p>
                </div>
                <div className="parcelas__caracteristicas__tipos">
                    <h4>TIPOS:</h4>
                    <div className="tipos__tipos">
                        {
                            figuras.map((figura, indice) => {
                                return <Figura key={indice} imagen={figura[1]} titulo={figura[0]} tipos={props.tipos} setTipos={props.setTipos} />
                            })
                        }
                    </div>
                    <p className='informacion'>* Elegir los modos de acampada que permite el camping</p>
                </div>
                <div className="parcelas__caracteristicas__tipos">
                    <h4>OTROS CONCEPTOS:</h4>
                    <div className="tipos__tipos">
                        {
                            otras_figuras.map((figura, indice) => {
                                return <Figura key={indice} imagen={figura[1]} titulo={figura[0]} tipos={props.conceptosGenerales} setTipos={props.setConceptosGenerales} />
                            })
                        }
                    </div>
                    <p className='informacion'>* Incluir otros conceptos que tu camping registre en las estancias.<br/>Los adultos y los niños vienen incluidos por defecto.</p>
                </div>
                <div className="parcelas__caracteristicas__caracteristicas">
                    <h4>CARACTERÍSTICAS:</h4>
                    <form className="caracteristicas__input">
                        <input type="text" name="input_caracteristicas" id="input_caracteristicas" placeholder='Añade una característica' />
                        <button onClick={e => {e.preventDefault(); anadirCaracteristica()}}><i className="fa-solid fa-plus"></i></button>
                    </form>
                    <div className="caracteristicas__caracteristicas">
                        {
                            props.caracteristicas.map((caracteristica, indice) => {
                                return <Caracteristica key={indice} caracteristica={caracteristica} caracteristicas={props.caracteristicas} setCaracteristicas={props.setCaracteristicas} />
                            })
                        }
                    </div>
                    <p className='informacion'>* Aquí podrás añadir características que podrán utilizar tus acomodadores como filtros para encontrar parcelas. Las características que puedes ver arriba de este texto están incluidas por defecto, pero puedes quitarlas de la lista en este paso.</p>
                </div>
            </div>
        </div>
    )
}

function Botones ({ tamano, setTamano }) {

    return(
        <div className='tamanos__tabla__botones'>
            <input type="text" disabled value={tamano} />
            <div>
                <button onClick={() => setTamano(tamano + 1)}><i className="fa-solid fa-caret-up"></i></button>
                <button onClick={() => tamano > 0 && setTamano(tamano - 1)}><i className="fa-solid fa-caret-down"></i></button>
            </div>
        </div>
    )
}

function Caracteristica ({ caracteristica, caracteristicas, setCaracteristicas }) {

    const eliminarCaracteristica = () => {
        setCaracteristicas(caracteristicas.filter(c => c != caracteristica))
    }

    return (
        <div className="caracteristica">
            <p>{caracteristica}</p>
            <button onClick={eliminarCaracteristica}><i className="fa-solid fa-trash"></i></button>
        </div>
    )
}