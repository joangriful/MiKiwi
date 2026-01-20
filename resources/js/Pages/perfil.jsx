// import Header from "../Components/Header";
// import Footer from "../Components/Footer";

export default function Perfil() {
    const logoUsuario = ""; // aqui va la ruta de la imagen del logo de usuario
    const nombreUsuario = ""; // aqui va el nombre del usuario
    const direccionEnvio = ""; // aqui va la direccion de envio del usuario

    return (
        <>
            {/* <Header /> */}

            <main className="p-6 bg-bg-main min-h-screen">
                <div className="grid grid-cols-5 grid-rows-6 gap-6">
                    {/* Tarjeta Usuario / Cerrar Sesión */}
                    <div className="col-span-2 row-span-2 flex flex-col items-center justify-center p-6 bg-bg-surface text-text-main rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <img
                            src={logoUsuario}
                            alt="Usuario"
                            className="w-28 h-28 rounded-full border-4 border-primary mb-4"
                        />
                        <h2 className="text-xl font-semibold mb-3">
                            {nombreUsuario}
                        </h2>
                        <button
                            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-sm transition-transform transform hover:-translate-y-1"
                            onClick={() => alert("Sesión cerrada")}
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    {/* Detalles de la Cuenta */}
                    <div className="col-span-2 row-span-4 col-start-1 row-start-3 p-6 bg-bg-surface text-text-main rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-bold mb-4">
                            Detalles de la Cuenta
                        </h2>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-1 text-text-main">
                                Dirección de Envío
                            </h3>
                            <p className="text-text-muted mb-2">
                                {direccionEnvio}
                            </p>
                            <button
                                className="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-lg shadow-sm transition-transform transform hover:-translate-y-1"
                                onClick={() => alert("Dirección cambiada")}
                            >
                                Cambiar Dirección
                            </button>
                        </div>

                        {/* Aquí puedes agregar más detalles del usuario */}
                    </div>

                    {/* Historial de Pedidos */}
                    <div className="col-span-3 row-span-6 col-start-3 row-start-1 p-6 bg-bg-surface text-text-main rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-bold mb-4">
                            Historial de Pedidos
                        </h2>
                        {/* Aquí puedes mapear pedidos o mostrar tablas */}
                    </div>
                </div>
            </main>

            {/* <Footer /> */}
        </>
    );
}
