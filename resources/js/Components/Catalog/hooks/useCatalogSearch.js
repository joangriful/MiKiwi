import { router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useCatalogSearch(filters = {}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const debouncedSearch = useMemo(
        () => debounce((term, currentFilters) => {
            router.get(
                route('products.index'),
                { ...currentFilters, search: term },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300),
        []
    );

    useEffect(() => {
        setSearchTerm(filters.search || '');
    }, [filters.search]);

    useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

    const updateSearchTerm = useCallback((value) => {
        setSearchTerm(value);
        debouncedSearch(value, filters);
    }, [debouncedSearch, filters]);

    return {
        searchTerm,
        updateSearchTerm,
    };
}
