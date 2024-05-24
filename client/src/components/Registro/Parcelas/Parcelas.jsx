import './Parcelas.css'

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
                        <Botones tamano={props.grandeAncho} setTamano={props.setGrandeaAncho} />
                        <Botones tamano={props.grandeLargo} setTamano={props.setGrandeLargo} />
                    </div>
                    <p>* Se recomienda fijar los tamaños máximos para cada tipo. De este modo, al buscar una parcela para un modo de acampada del que conocemos sus medidas, nos resultará más fácil</p>
                </div>
                <div className="parcelas__caracteristicas__tipos">
                    <h4>TIPOS:</h4>
                    <div className="tipos__tipos">
                        {
                            figuras.map(figura => {
                                return <Figura imagen={figura[1]} titulo={figura[0]} tipos={props.tipos} setTipos={props.setTipos} />
                            })
                        }
                    </div>
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
                <button onClick={() => setTamano(tamano++)}><i className="fa-solid fa-caret-up"></i></button>
                <button onClick={() => tamano > 0 && setTamano(tamano--)}><i className="fa-solid fa-caret-down"></i></button>
            </div>
        </div>
    )
}

function Figura ({ imagen, titulo, tipos, setTipos }) {

    const clickTipo = () => {
        let copia_tipos = tipos
        const figura = document.getElementById(`img_figura_${titulo}`)

        figura.classList.toggle('figura__imagen__activada')

        if (tipos.includes(titulo)) {
            copia_tipos.splice(tipos.indexOf(titulo), 1)
            setTipos(copia_tipos)
        } else {
            copia_tipos.push(titulo)
            setTipos(copia_tipos)
        }
    }

    return(
        <div id={`img_figura_${titulo}`} className={`figura ${tipos.includes(titulo) && 'figura__imagen__activada'}`} onClick={clickTipo}>
            <img className='figura__imagen' src={imagen} alt={`FIGURA-${titulo.toUpperCase()}`} />
            <h6>{titulo.toUpperCase()}</h6>
            <div className='figura__check'><i className="fa-solid fa-check"></i></div>
        </div>
    )
}