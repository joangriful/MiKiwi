import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Header from '@/Components/Header/Header';
import Footer from '@/Components/Footer/Footer';
import CatalogEmptyState from '@/Components/Catalog/CatalogEmptyState/CatalogEmptyState';
import CatalogHero from '@/Components/Catalog/CatalogHero/CatalogHero';
import CatalogPagination from '@/Components/Catalog/CatalogPagination/CatalogPagination';
import CatalogProductGrid from '@/Components/Catalog/CatalogProductGrid/CatalogProductGrid';
import CatalogToolbar from '@/Components/Catalog/CatalogToolbar/CatalogToolbar';
import FilterMenu from '@/Components/Catalog/FilterMenu/FilterMenu';
import useCatalogSearch from '@/Components/Catalog/hooks/useCatalogSearch';
import styles from './Products.module.css';

export default function Products({ products, categories = [], filters = {} }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { searchTerm, updateSearchTerm } = useCatalogSearch(filters);

    const productItems = products?.data || [];
    const hasProducts = productItems.length > 0;

    const activeFilterCount = useMemo(
        () => Object.values(filters).filter(Boolean).length,
        [filters]
    );

    return (
        <div className={styles.root}>
            <Head title="Nuestros Productos - MIKIWI" />

            <Header />

            <main className={styles.main}>
                <CatalogHero />

                <CatalogToolbar
                    activeFilterCount={activeFilterCount}
                    onOpenFilters={() => setIsFilterOpen(true)}
                    onSearchChange={updateSearchTerm}
                    searchTerm={searchTerm}
                />

                <FilterMenu
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    categories={categories}
                    filters={filters}
                />

                <section className={styles.results} aria-label="Resultados del catálogo">
                    {hasProducts ? (
                        <>
                            <CatalogProductGrid products={productItems} />
                            <CatalogPagination links={products?.links} />
                        </>
                    ) : (
                        <CatalogEmptyState />
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
