import React, { useState, useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function ProductAdmin({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: '',
        name: '',
        slug: '',
        sku: '',
        base_price: '',
        stock_quantity: '',
        product_type: 'simple',
        is_adult_only: false,
        is_active: true,
        description: '',
        images: [''], // Iniciamos con un campo de imagen vacío
    });

    const [seederCode, setSeederCode] = useState('');

    // Auto-generación de slug y actualización de código de seeder
    useEffect(() => {
        const generatedSlug = data.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setData('slug', generatedSlug);
        updateSeederCode();
    }, [data.name, data.category_id, data.sku, data.base_price, data.stock_quantity, data.product_type, data.is_adult_only, data.is_active, data.description, data.images]);

    const updateSeederCode = () => {
        const imagesJson = JSON.stringify(data.images.filter(img => img.trim() !== ''));
        const code = `Product::create([
    'category_id' => ${data.category_id || '$category_id'},
    'name' => '${data.name || 'Nombre del Producto'}',
    'slug' => '${data.slug || 'slug-del-producto'}',
    'sku' => '${data.sku || 'SKU-000'}',
    'base_price' => ${data.base_price || '0.00'},
    'stock_quantity' => ${data.stock_quantity || '0'},
    'product_type' => '${data.product_type}',
    'is_active' => ${data.is_active ? 'true' : 'false'},
    'is_adult_only' => ${data.is_adult_only ? 'true' : 'false'},
    'description' => '${(data.description || '').replace(/'/g, "\\'")}',
    'images' => ${imagesJson === '[]' ? "json_encode(['https://placehold.co/400?text=" + (data.name || 'Product') + "'])" : "json_encode(" + imagesJson + ")"},
]);`;
        setSeederCode(code);
    };

    const handleImageChange = (index, value) => {
        const newImages = [...data.images];
        newImages[index] = value;
        setData('images', newImages);
    };

    const addImageField = () => {
        setData('images', [...data.images, '']);
    };

    const removeImageField = (index) => {
        const newImages = data.images.filter((_, i) => i !== index);
        setData('images', newImages.length > 0 ? newImages : ['']);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => reset(),
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(seederCode);
    };

    return (
        <div className="min-h-screen bg-[#222b24] text-[#f8f5f0] p-4 md:p-8 font-sans selection:bg-[#99b849] selection:text-white">
            <Head title="Gestor de Productos | MiKiwi" />

            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#424d44] pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#99b849] tracking-tight uppercase">
                            Gestión de Productos
                        </h1>
                        <p className="text-[#99b849]/60 mt-1 font-medium italic">
                            Crea productos para la base de datos o genera código para tus seeders.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-[#2d3830] border border-[#424d44] rounded-full text-xs font-bold uppercase tracking-wider text-[#f8b7ea]">
                            Diseño Premium MiKiwi
                        </span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Formulario Section */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-[#2d3830] p-8 rounded-2xl border border-[#424d44] shadow-2xl">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-[#f8b7ea]">
                                <div className="w-2 h-8 bg-[#f8b7ea] rounded-full"></div>
                                Formulario de Producto
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#99b849] mb-2">Nombre del Producto</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            placeholder="Ej: Kiwisex Supreme 3000"
                                            className="w-full bg-[#222b24] border border-[#424d44] rounded-xl p-4 focus:ring-2 focus:ring-[#99b849] focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                            required
                                        />
                                        <div className="flex justify-between mt-1">
                                            {data.slug && <p className="text-[#99b849]/50 text-[10px] font-bold uppercase tracking-widest">URL: /producto/{data.slug}</p>}
                                            {errors.name && <p className="text-[#FF2D20] text-xs font-bold">{errors.name}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#99b849] mb-2">SKU</label>
                                        <input
                                            type="text"
                                            value={data.sku}
                                            onChange={e => setData('sku', e.target.value)}
                                            placeholder="MKW-XXX"
                                            className="w-full bg-[#222b24] border border-[#424d44] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#99b849] outline-none transition-all uppercase"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#99b849] mb-2">Precio Base (€)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.base_price}
                                            onChange={e => setData('base_price', e.target.value)}
                                            className="w-full bg-[#222b24] border border-[#424d44] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#99b849] outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#99b849] mb-2">Stock Inicial</label>
                                        <input
                                            type="number"
                                            value={data.stock_quantity}
                                            onChange={e => setData('stock_quantity', e.target.value)}
                                            className="w-full bg-[#222b24] border border-[#424d44] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#99b849] outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#99b849] mb-2">Categoría</label>
                                        <select
                                            value={data.category_id}
                                            onChange={e => setData('category_id', e.target.value)}
                                            className="w-full bg-[#222b24] border border-[#424d44] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#99b849] outline-none appearance-none"
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#99b849] mb-2">Tipo</label>
                                        <select
                                            value={data.product_type}
                                            onChange={e => setData('product_type', e.target.value)}
                                            className="w-full bg-[#222b24] border border-[#424d44] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#99b849] outline-none"
                                        >
                                            <option value="simple">Simple</option>
                                            <option value="configurable">Configurable</option>
                                            <option value="component">Componente</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-[#99b849] mb-2">Descripción</label>
                                    <textarea
                                        rows="3"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full bg-[#222b24] border border-[#424d44] rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#99b849] outline-none transition-all"
                                        placeholder="Descripción detallada del producto..."
                                    ></textarea>
                                </div>

                                {/* Secciones de Toggle */}
                                <div className="flex flex-wrap gap-6 p-4 bg-[#222b24] rounded-xl border border-[#424d44]">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={data.is_adult_only}
                                            onChange={e => setData('is_adult_only', e.target.checked)}
                                            className="hidden"
                                        />
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${data.is_adult_only ? 'bg-[#FF2D20]' : 'bg-[#424d44]'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${data.is_adult_only ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">Contenido Adulto (+18)</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="hidden"
                                        />
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${data.is_active ? 'bg-[#99b849]' : 'bg-[#424d44]'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${data.is_active ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">Producto Activo</span>
                                    </label>
                                </div>

                                {/* Gestión de Imágenes */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-black uppercase tracking-widest text-[#99b849]">Imágenes (URLs)</label>
                                        <button
                                            type="button"
                                            onClick={addImageField}
                                            className="text-[10px] font-bold uppercase bg-[#99b849] text-white px-2 py-1 rounded hover:bg-[#7a943a] transition-all"
                                        >
                                            + Añadir URL
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {data.images.map((img, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={img}
                                                    onChange={e => handleImageChange(index, e.target.value)}
                                                    placeholder="https://..."
                                                    className="flex-1 bg-[#222b24] border border-[#424d44] rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#99b849] outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index)}
                                                    className="p-3 text-[#FF2D20] hover:bg-[#FF2D20]/10 rounded-xl transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#99b849] hover:bg-[#7a943a] text-[#222b24] font-black uppercase tracking-tighter text-xl py-5 rounded-2xl transition-all shadow-lg hover:shadow-[#99b849]/20 disabled:opacity-50 mt-4 active:scale-95"
                                >
                                    {processing ? 'Guardando...' : 'Crear en Base de Datos'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                        <div className="bg-[#2d3830] p-8 rounded-2xl border border-[#424d44] shadow-xl flex flex-col h-full">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-[#f8b7ea]">
                                <div className="w-2 h-8 bg-[#99b849] rounded-full"></div>
                                Código para Seeder
                            </h2>

                            <div className="relative group">
                                <div className="absolute top-4 right-4 animate-pulse group-hover:hidden">
                                    <span className="bg-[#99b849] text-white text-[10px] px-2 py-1 rounded">VIVO</span>
                                </div>
                                <pre className="bg-[#222b24] p-6 rounded-2xl text-[13px] text-gray-300 font-mono border border-[#424d44] overflow-x-auto selection:bg-[#f8b7ea] selection:text-[#222b24]">
                                    {seederCode}
                                </pre>
                            </div>

                            <button
                                onClick={copyToClipboard}
                                className="w-full bg-[#f8b7ea] hover:bg-[#d697c8] text-[#222b24] font-black uppercase tracking-widest py-4 rounded-xl mt-6 transition-all shadow-lg hover:shadow-[#f8b7ea]/20 active:scale-95"
                            >
                                Copiar Código
                            </button>

                            <div className="mt-8 p-4 bg-[#222b24]/50 rounded-xl border border-[#424d44] border-dashed">
                                <h4 className="text-[#99b849] text-[10px] font-black uppercase mb-2 tracking-widest">Instrucciones</h4>
                                <ul className="text-xs text-gray-400 space-y-2 leading-relaxed italic">
                                    <li>1. Completa los datos en el formulario.</li>
                                    <li>2. El Slug se genera solo, pero puedes editarlo.</li>
                                    <li>3. Si dejas las imágenes vacías, se usará un placeholder.</li>
                                    <li>4. Pega el código en <code className="text-[#f8b7ea] bg-black/30 px-1 rounded">CatalogSeeder.php</code>.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-16 text-center text-[#99b849]/30 text-[10px] font-bold uppercase tracking-[0.5em] pb-8">
                MiKiwi Engine v1.0 • Internal Management Tool
            </footer>
        </div>
    );
}
