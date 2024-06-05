import './PlantillaCorreo.css'

export default function Plantilla () {

    return(
                <div class="plantilla">
                    <div class="plantilla__logo">
                        <img src="../../../figura-logo-circulo.png" />
                        <h1>ACOMODIN</h1>
                    </div>
                    <h2>¡Bienvenido a Acomodin Diego!</h2>
                    <p>Aquí tienes tu usuario y contraseña para acceder a la web.</p>
                    <div class="plantilla__credenciales">
                        <div>
                            <p>Usuario: </p>
                            <p>diego123</p>
                        </div>
                        <div>
                            <p>Contraseña: </p>
                            <p>csxHG·%$·Szd11243</p>
                        </div>
                    </div>
                    <p>Te recomendamos que cambies estos campos desde tu Perfil lo antes posible.</p>
                    <a href="http://localhost:5173/login">INICIAR SESIÓN</a>
                </div>
    )
}