import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { buildFileTree, flattenTree, parseColorsFromCss } from '@/Components/Admin/utils/managerUtils';
import cssContent from '@/../css/global.css?raw';

// Imports
const componentImports = import.meta.glob([
    '/resources/js/Components/**/*.jsx',
    '!/resources/js/Components/Configurator/Mannequin3DViewer/components/MannequinScene3D.jsx',
], { eager: true });
const pageImports = import.meta.glob('/resources/js/Pages/**/*.jsx', { eager: true });
const componentRawStart = import.meta.glob([
    '/resources/js/Components/**/*.jsx',
    '!/resources/js/Components/Configurator/Mannequin3DViewer/components/MannequinScene3D.jsx',
    '!/resources/js/Components/Configurator/DollScene3D/DollScene3D.jsx',
], { query: '?raw', import: 'default' });
const pageRawStart = import.meta.glob('/resources/js/Pages/**/*.jsx', { query: '?raw', import: 'default' });
const DYNAMIC_COLORS = parseColorsFromCss(cssContent);

const toRelativePath = (path) => path
    .replace(/\\/g, '/')
    .replace('/resources/js/', '')
    .replace(/^\/+/, '')
    .replace('.jsx', '');

const collapseDuplicatedLeaf = (path) => {
    const segments = path.split('/').filter(Boolean);

    if (segments.length >= 2 && segments[segments.length - 1] === segments[segments.length - 2]) {
        segments.pop();
    }

    return segments.join('/');
};

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
            const relativePath = toRelativePath(path);
            const isAdminArtifact = relativePath.startsWith('Components/Admin/') || relativePath.startsWith('Pages/Admin/');

            if (isAdminArtifact) {
                return null;
            }

            const trimmedPath = sourceType === 'components'
                ? relativePath.replace(/^Components\//, '')
                : relativePath.replace(/^Pages\//, '');

            const name = collapseDuplicatedLeaf(trimmedPath);
            const baseName = name.split('/').pop();

            return { path, name, baseName };
        }).filter(item => {
            if (!item) {
                return false;
            }

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
    const handleFolderToggle = useCallback((item) => {
        const index = visibleItems.findIndex(i => i.path === item.path);
        if (index !== -1) setFocusedIndex(index);
        setOpenFolders(prev => {
            const next = new Set(prev);
            next.has(item.path) ? next.delete(item.path) : next.add(item.path);
            return next;
        });
    }, [visibleItems]);

    const handleItemSelect = useCallback((item, isChecked) => {
        const index = visibleItems.findIndex(i => i.path === item.path);
        if (index !== -1) setFocusedIndex(index);
        if (item.isFolder) return;

        // Redirect Auth/Auth to actual login page
        if (sourceType === 'pages' && item.name === 'Auth/Auth') {
            window.location.href = '/login';
            return;
        }

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
    }, [visibleItems, sourceType]);

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
    }, [visibleItems, focusedIndex, sourceType, handleFolderToggle, handleItemSelect]);

    useEffect(() => {
        setSelectedPagePaths(new Set());
        setSelectedComponentPath(null);
        setOpenFolders(new Set());
        setFocusedIndex(-1);
    }, [sourceType]);

    // Memoized Selects
    const SelectedSingleComponent = useMemo(() => {
        if (sourceType === 'components' && selectedComponentPath && currentImports[selectedComponentPath]) {
            return React.lazy(() => toLazyModule(currentImports[selectedComponentPath]));
        }
        return null; // Return null instead of a component
    }, [selectedComponentPath, currentImports, sourceType]);

    const SelectedPages = useMemo(() => {
        if (sourceType !== 'pages') return [];
        const selected = [];
        itemsList.forEach(item => {
            if (selectedPagePaths.has(item.path)) {
                selected.push({
                    ...item,
                    Component: React.lazy(() => toLazyModule(currentImports[item.path])),
                });
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

const toLazyModule = (module) => Promise.resolve({ default: module.default });
