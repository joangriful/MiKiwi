// import Header from "../Components/Header";
// import Footer from "../Components/Footer";
import { useState } from "react";

export default function Perfil() {
    const logoUsuario = "coger url de la BBDD"; // aqui va la ruta de la imagen del logo de usuario
    const nombreUsuario = "coger nombre de la BBDD"; // aqui va el nombre del usuario
    const direccionEnvio = "coger de la BBDD"; // aqui va la direccion de envio del usuario

    const [editDireccion, setEditDireccion] = useState(false);
    const [nuevaDireccion, setNuevaDireccion] = useState("");
    const [confirmDireccion, setConfirmDireccion] = useState("");

    const pedidos = [
        {
            id: 1,
            productos: ["Camiseta", "Pantalón", "Zapatos"],
            total: "79.99",
            fecha: "2026-01-20",
        },
        {
            id: 2,
            productos: ["Sudadera", "Gorra"],
            total: "45.50",
            fecha: "2026-01-15",
        },
    ]; // aqui va el array de pedidos del usuario

    const [metodoPago, setMetodoPago] = useState("tarjeta");

    return (
        <>
            {/* <Header /> */}

            <main className="min-h-screen bg-bg-main p-8 font-body text-text-main">
                <div className="grid grid-cols-5 grid-rows-6 gap-6 max-w-7xl mx-auto">
                    {/* Usuario / Cerrar sesión */}
                    <section className="col-span-2 row-span-2 flex flex-col items-center justify-center bg-bg-surface rounded-2xl shadow-md hover:shadow-lg transition">
                        <img
                            src={logoUsuario}
                            alt="Usuario"
                            className="w-28 h-28 rounded-full border-4 border-primary mb-4"
                        />

                        <h2 className="font-head text-lg uppercase tracking-widest mb-4">
                            {nombreUsuario}
                        </h2>

                        <button
                            className="font-body px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
                            onClick={() => alert("Sesión cerrada")}
                        >
                            Cerrar sesión
                        </button>
                    </section>

                    {/* Detalles de la cuenta */}
                    <section className="col-span-2 row-span-4 col-start-1 row-start-3 bg-bg-surface rounded-2xl shadow-md hover:shadow-lg transition p-6">
                        <h2 className="font-head text-lg uppercase tracking-widest mb-6">
                            Detalles de la cuenta
                        </h2>

                        {/* Dirección de envío */}
                        <div id="cambiarDireccion" className="mt-4">
                            <h3 className="font-head text-sm uppercase tracking-wider text-text-muted mb-2">
                                Dirección de envío:
                            </h3>

                            <p className="font-body mb-4">{direccionEnvio}</p>

                            <button
                                className="font-body px-5 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
                                onClick={() => setEditDireccion(!editDireccion)}
                            >
                                Cambiar dirección
                            </button>

                            {/* Inputs desplegables */}
                            {editDireccion && (
                                <div className="mt-4 flex flex-col space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Nueva dirección"
                                        value={nuevaDireccion}
                                        onChange={(e) =>
                                            setNuevaDireccion(e.target.value)
                                        }
                                        className="p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Confirmar dirección"
                                        value={confirmDireccion}
                                        onChange={(e) =>
                                            setConfirmDireccion(e.target.value)
                                        }
                                        className="p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <button
                                        className="font-body px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
                                        onClick={() => {
                                            if (
                                                nuevaDireccion &&
                                                nuevaDireccion ===
                                                    confirmDireccion
                                            ) {
                                                alert(
                                                    `Dirección cambiada a: ${nuevaDireccion}`,
                                                );
                                                // Aquí se podría hacer fetch o Inertia.post
                                                setEditDireccion(false);
                                            } else {
                                                alert(
                                                    "Las direcciones no coinciden",
                                                );
                                            }
                                        }}
                                    >
                                        Guardar dirección
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Método de pago */}
                        <div id="cambiarPago" className="mt-8">
                            <h3 className="font-head text-sm uppercase tracking-wider text-text-muted mb-4">
                                Método de pago
                            </h3>

                            <div className="flex flex-col space-y-4">
                                {/* Tarjeta */}
                                <div
                                    onClick={() => setMetodoPago("tarjeta")}
                                    className={`flex flex-col p-4 rounded-xl border shadow-sm cursor-pointer transition-transform duration-200 ${
                                        metodoPago === "tarjeta"
                                            ? "bg-primary/10 border-primary ring-2 ring-primary scale-105"
                                            : "bg-bg-main border-border hover:shadow-md hover:scale-105"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-body font-medium">
                                            Tarjeta
                                        </span>
                                        {metodoPago === "tarjeta" && (
                                            <span className="text-xs font-semibold text-primary">
                                                Seleccionado
                                            </span>
                                        )}
                                    </div>

                                    {/* Desplegable solo si está seleccionado */}
                                    {metodoPago === "tarjeta" && (
                                        <div className="mt-4 flex flex-col space-y-2">
                                            <label className="font-body text-sm text-text-main">
                                                Número de tarjeta
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="XXXX-XXXX-XXXX-1234"
                                                className="p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <label className="font-body text-sm text-text-main">
                                                Fecha de caducidad
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="MM/AA"
                                                className="p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Bizum */}
                                <div
                                    onClick={() => setMetodoPago("bizum")}
                                    className={`flex flex-col p-4 rounded-xl border shadow-sm cursor-pointer transition-transform duration-200 ${
                                        metodoPago === "bizum"
                                            ? "bg-primary/10 border-primary ring-2 ring-primary scale-105"
                                            : "bg-bg-main border-border hover:shadow-md hover:scale-105"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-body font-medium">
                                            Bizum
                                        </span>
                                        {metodoPago === "bizum" && (
                                            <span className="text-xs font-semibold text-primary">
                                                Seleccionado
                                            </span>
                                        )}
                                    </div>

                                    {metodoPago === "bizum" && (
                                        <div className="mt-4 flex flex-col space-y-2">
                                            <label className="font-body text-sm text-text-main">
                                                Número de teléfono
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="+34 612 345 678"
                                                className="p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* PayPal */}
                                <div
                                    onClick={() => setMetodoPago("paypal")}
                                    className={`flex flex-col p-4 rounded-xl border shadow-sm cursor-pointer transition-transform duration-200 ${
                                        metodoPago === "paypal"
                                            ? "bg-primary/10 border-primary ring-2 ring-primary scale-105"
                                            : "bg-bg-main border-border hover:shadow-md hover:scale-105"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-body font-medium">
                                            PayPal
                                        </span>
                                        {metodoPago === "paypal" && (
                                            <span className="text-xs font-semibold text-primary">
                                                Seleccionado
                                            </span>
                                        )}
                                    </div>

                                    {metodoPago === "paypal" && (
                                        <div className="mt-4 flex flex-col space-y-2">
                                            <label className="font-body text-sm text-text-main">
                                                Correo de PayPal
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="usuario@paypal.com"
                                                className="p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Historial de pedidos */}
                    <section className="col-span-3 row-span-6 col-start-3 row-start-1 bg-bg-surface rounded-2xl shadow-md hover:shadow-lg transition p-6">
                        <h2 className="font-head text-lg uppercase tracking-widest mb-6">
                            Historial de pedidos
                        </h2>

                        {pedidos.length === 0 ? (
                            <p className="font-body text-text-muted">
                                Aún no hay pedidos registrados.
                            </p>
                        ) : (
                            <ul className="space-y-4">
                                {pedidos.map((pedido) => (
                                    <li
                                        key={pedido.id}
                                        className="p-4 bg-bg-main rounded-xl shadow-sm border border-border hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-body font-semibold">
                                                Pedido #{pedido.id} -{" "}
                                                {pedido.fecha}
                                            </span>
                                            <span className="font-body text-primary font-bold">
                                                {pedido.total}€
                                            </span>
                                        </div>
                                        <ul className="font-body text-text-muted list-disc list-inside">
                                            {pedido.productos.map(
                                                (producto, idx) => (
                                                    <li key={idx}>
                                                        {producto}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </main>

            {/* <Footer /> */}
        </>
    );
}
