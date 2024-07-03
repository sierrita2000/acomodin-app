import './Concepto.css'

export default function Concepto ({ nombre, imagen, conceptos, setConceptos, indice, disabled }) {

    /**
     * Handler para controlar la cantidad de cada concepto
     * @param {Number} accion 
     * @param {Number} indice 
     * @returns 
     */
    const sumarRestarConcepto = (accion, indice) => {
        const copia_conceptos = conceptos.slice()
        if (accion === 0){
            copia_conceptos[indice][1] = copia_conceptos[indice][1] + 1
        } else {
            if (copia_conceptos[indice][1] === 0) {
                return
            } else {
                copia_conceptos[indice][1] = copia_conceptos[indice][1] - 1
            }
        } 

        setConceptos(copia_conceptos)
    }

    return(
        <div className="concepto">
            <img title={nombre} src={`${import.meta.env.VITE_API_HOST}static/${imagen}`} alt={`FIGURA-${nombre}`} />
            <div>
                <input type="text" name={`concepto${nombre}`} id={`concepto${nombre}`} disabled value={conceptos[indice][1]} />
                <div style={disabled ? { display: 'none' } : {}} className="botones">
                    <button onClick={e => {e.preventDefault(); sumarRestarConcepto(0, indice)}}><i className="fa-solid fa-caret-up"></i></button>
                    <button onClick={e => {e.preventDefault(); sumarRestarConcepto(1, indice)}}><i className="fa-solid fa-caret-down"></i></button>
                </div>
            </div>
        </div>
    )
}