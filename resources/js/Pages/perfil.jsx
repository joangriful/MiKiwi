export default function Perfil() {

function Header () {
    return (
        <></>
    );
}

function Footer () {
    return (
        <></>
    );
}

    return (
        <div className="grid grid-cols-5 grid-rows-6 gap-3 backdrop-brightness-90">
            <div className="col-span-2 row-span-2" id="cerranSesion">
                <h1>Cerrar Sesión</h1>
            </div>

            <div className="col-span-2 row-span-4 col-start-1 row-start-3" id="historialPedidos">
                <h1>Historial de Pedidos</h1>
            </div>

            <div className="col-span-3 row-span-6 col-start-3 row-start-1 text-secondary"
                id="detallesCuenta">
                <h1>Detalles de la Cuenta</h1>
            </div>
            <div className="col-span-5 row-start-7" id="Q&A">
                <h1>Q&A</h1>
            </div>
        </div>
    );
}
