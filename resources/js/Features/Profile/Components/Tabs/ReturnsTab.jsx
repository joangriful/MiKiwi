import React from 'react';

export default function ReturnsTab() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Devoluciones</h2>
            
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Devolver Artículo</h3>
                <p className="text-gray-600 mb-4">Proceso para iniciar una devolución.</p>
                <button className="bg-[#99b849] hover:bg-[#86a340] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    Iniciar Devolución
                </button>
            </div>

            <hr className="border-gray-100 my-6" />

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Estado de tus devoluciones</h3>
                <p className="text-gray-600">Revisa el estado de tus devoluciones en curso o pasadas.</p>
            </div>
        </div>
    );
}
