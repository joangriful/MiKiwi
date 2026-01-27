import React, { useState, useMemo, useEffect } from 'react';
import { buildFileTree, flattenTree, parseColorsFromCss } from '../../Utils/managerUtils';
import cssContent from '../../../css/colores.css?raw';

// Imports
const componentImports = import.meta.glob('../../Components/**/*.jsx');
const pageImports = import.meta.glob('../../Pages/**/*.jsx');
const componentRawStart = import.meta.glob('../../Components/**/*.jsx', { query: '?raw', import: 'default' });
const pageRawStart = import.meta.glob('../../Pages/**/*.jsx', { query: '?raw', import: 'default' });
const DYNAMIC_COLORS = parseColorsFromCss(cssContent);

export const useComponentsManager = () => {
    // State
    const [sourceType, setSourceType] = useState('components');
    const [selectedPagePaths, setSelectedPagePaths] = useState(new Set());
    const [selectedComponentPath, setSelectedComponentPath] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [openFolders, setOpenFolders] = useState(new Set());
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [gridCols, setGridCols] = useState(3);
    const [colorIndex, setColorIndex] = useState({});

    // Constants
    const definedColors = useMemo(() => DYNAMIC_COLORS, []);
    const currentImports = sourceType === 'components' ? componentImports : pageImports;
    const currentRawImports = sourceType === 'components' ? componentRawStart : pageRawStart;

    // Indexing Effect
    useEffect(() => {
        const buildIndex = async () => {
            const index = {};
            definedColors.forEach(c => index[c.name] = new Set());
            for (const path in currentRawImports) {
                try {
                    const content = await currentRawImports[path]();
                    definedColors.forEach(color => {
                        const nameRegex = new RegExp(`\\b${color.name}\\b`, 'i');
                        const hexRegex = new RegExp(`${color.hex}`, 'i');
                        if (nameRegex.test(content) || hexRegex.test(content)) {
                            index[color.name].add(path);
                        }
                    });
                } catch (e) { console.warn("Index failed", path, e); }
            }
            setColorIndex(index);
        };
        buildIndex();
    }, [currentRawImports, definedColors]);

    // Tree/List Logic
    const itemsList = useMemo(() => {
        return Object.keys(currentImports).map(path => {
            const base = sourceType === 'components' ? '../../Components/' : '../../Pages/';
            const name = path.replace(base, '').replace('.jsx', '');
            return { path, name };
        }).filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesColor = selectedColor ? colorIndex[selectedColor]?.has(item.path) : true;
            return matchesSearch && matchesColor;
        });
    }, [currentImports, searchTerm, sourceType, selectedColor, colorIndex]);

    const fileTree = useMemo(() => buildFileTree(itemsList), [itemsList]);
    const visibleItems = useMemo(() => {
        const items = [];
        flattenTree(fileTree, openFolders, items, 0);
        return items;
    }, [fileTree, openFolders]);

    // Handlers
    const handleFolderToggle = (item) => {
        const index = visibleItems.findIndex(i => i.path === item.path);
        if (index !== -1) setFocusedIndex(index);
        setOpenFolders(prev => {
            const next = new Set(prev);
            next.has(item.path) ? next.delete(item.path) : next.add(item.path);
            return next;
        });
    };

    const handleItemSelect = (item, isChecked) => {
        const index = visibleItems.findIndex(i => i.path === item.path);
        if (index !== -1) setFocusedIndex(index);
        if (item.isFolder) return;

        if (sourceType === 'pages') {
            setSelectedPagePaths(prev => {
                const next = new Set(prev);
                const currentlyHas = next.has(item.path);
                if (typeof isChecked === 'boolean') isChecked ? next.add(item.path) : next.delete(item.path);
                else currentlyHas ? next.delete(item.path) : next.add(item.path);
                return next;
            });
        } else {
            setSelectedComponentPath(item.path);
        }
    };

    // Keyboard Nav
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            let newIndex = focusedIndex;
            if (e.key === 'ArrowDown') newIndex = Math.min(focusedIndex + 1, visibleItems.length - 1);
            else if (e.key === 'ArrowUp') newIndex = Math.max(focusedIndex - 1, 0);
            else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < visibleItems.length) {
                    const item = visibleItems[focusedIndex];
                    if (item.isFolder) handleFolderToggle(item);
                    else if (sourceType === 'pages') handleItemSelect(item);
                }
                return;
            } else return;

            if (newIndex !== focusedIndex) {
                setFocusedIndex(newIndex);
                if (newIndex >= 0 && newIndex < visibleItems.length) {
                    const item = visibleItems[newIndex];
                    if (!item.isFolder && sourceType === 'components') handleItemSelect(item);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visibleItems, focusedIndex, openFolders, sourceType]);

    useEffect(() => {
        setSelectedPagePaths(new Set());
        setSelectedComponentPath(null);
        setOpenFolders(new Set());
        setFocusedIndex(-1);
    }, [sourceType]);

    // Memoized Selects
    const SelectedSingleComponent = useMemo(() => {
        if (sourceType === 'components' && selectedComponentPath && currentImports[selectedComponentPath]) {
            return React.lazy(currentImports[selectedComponentPath]);
        }
        return null; // Return null instead of a component
    }, [selectedComponentPath, currentImports, sourceType]);

    const SelectedPages = useMemo(() => {
        if (sourceType !== 'pages') return [];
        const selected = [];
        itemsList.forEach(item => {
            if (selectedPagePaths.has(item.path)) {
                selected.push({ ...item, Component: React.lazy(currentImports[item.path]) });
            }
        });
        return selected;
    }, [itemsList, selectedPagePaths, currentImports, sourceType]);

    return {
        sourceType, setSourceType,
        selectedPagePaths, setSelectedPagePaths,
        selectedComponentPath, setSelectedComponentPath,
        searchTerm, setSearchTerm,
        selectedColor, setSelectedColor,
        openFolders, focusedIndex,
        gridCols, setGridCols,
        definedColors,
        visibleItems,
        handleFolderToggle,
        handleItemSelect,
        SelectedSingleComponent,
        SelectedPages,
        itemsList
    };
};
