export function filterProductsBySearchTerm(products, searchTerm) {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
        return products;
    }

    return products.filter((product) =>
        product.name?.toLowerCase().includes(normalizedSearchTerm) ||
        product.sku?.toLowerCase().includes(normalizedSearchTerm)
    );
}
