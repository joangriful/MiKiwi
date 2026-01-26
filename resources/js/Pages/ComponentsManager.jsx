import React, { useState, useMemo, Suspense, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { createPortal } from 'react-dom';

// Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Component Preview Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs overflow-hidden">
                    <strong>Error:</strong> {this.state.error?.toString()}
                </div>
            );
        }
        return this.props.children;
    }
}

// --- Inspector Helper ---
const getFiberFromElement = (node) => {
    const key = Object.keys(node).find(k => k.startsWith('__reactFiber$'));
    return key ? node[key] : null;
};

const getComponentName = (node) => {
    let fiber = getFiberFromElement(node);
    const ignoredComponents = ['ErrorBoundary', 'Suspense', 'ComponentsManager', 'Inspector', 'FileTreeItem'];

    while (fiber) {
        if (fiber.type && typeof fiber.type === 'function' && fiber.type.name && !ignoredComponents.includes(fiber.type.name)) {
            return fiber.type.name;
        }
        fiber = fiber.return;
    }
    return null;
};

// --- Inspector Component ---
const Inspector = ({ containerRef, active }) => {
    const [highlight, setHighlight] = useState(null); // { rect, name }

    useEffect(() => {
        if (!active || !containerRef.current) return;

        const handleMouseMove = (e) => {
            const componentName = getComponentName(e.target);
            if (componentName) {
                const rect = e.target.getBoundingClientRect();
                // Adjust rect relative to the viewport/container if needed, but simple fixed overlay is easier
                setHighlight({
                    rect: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    },
                    name: componentName
                });
            } else {
                setHighlight(null);
            }
        };

        const handleMouseLeave = () => setHighlight(null);

        // Attach listener to the container instead of window to limit scope
        const container = containerRef.current;
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [active, containerRef]);

    if (!highlight) return null;

    return createPortal(
        <div
            className="fixed pointer-events-none z-[9999] border-2 border-blue-500 bg-blue-500/10 transition-all duration-75 ease-out"
            style={{
                top: highlight.rect.top,
                left: highlight.rect.left,
                width: highlight.rect.width,
                height: highlight.rect.height,
            }}
        >
            <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow-sm font-mono whitespace-nowrap">
                {highlight.name}.jsx
            </div>
        </div>,
        document.body
    );
};

// --- Thumbnail Component ---
const PageThumbnail = ({ children }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(0.2); // Default start scale

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                if (width > 0) {
                    setScale(width / 1280); // 1280px desktop standard
                }
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-gray-50">
            <div
                style={{
                    width: '1280px',
                    // Use CSS height to simulate a tall page OR let content dictate? 
                    // If content dictates, it might be 0 height if everything is absolute? 
                    // Usually pages have flow. We set min-height to ensure visual presence.
                    minHeight: '1000px',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left'
                }}
                className="bg-white shadow-sm pointer-events-none"
            >
                {children}
            </div>
        </div>
    );
};

// --- Tree Helpers ---
const buildFileTree = (paths) => {
    const tree = { name: 'root', isFolder: true, children: {}, path: '' };
    paths.forEach(pathObj => {
        const parts = pathObj.name.split('/');
        let current = tree;
        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            if (!current.children[part]) {
                current.children[part] = {
                    name: part,
                    isFolder: !isFile,
                    children: isFile ? null : {},
                    path: isFile ? pathObj.path : null,
                    fullPathName: parts.slice(0, index + 1).join('/'),
                };
            }
            current = current.children[part];
        });
    });
    return tree;
};

const FileTreeItem = ({ item, level = 0, onSelect, selectedPath }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isSelected = item.path === selectedPath;

    if (item.isFolder) {
        const sortedChildren = Object.values(item.children).sort((a, b) => {
            if (a.isFolder && !b.isFolder) return -1;
            if (!a.isFolder && b.isFolder) return 1;
            return a.name.localeCompare(b.name);
        });

        return (
            <div className="select-none">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100/80 transition-colors text-gray-700 text-sm font-medium relative ${level > 0 ? 'ml-0' : ''
                        }`}
                    style={{ paddingLeft: `${level * 16 + 28}px` }}
                >
                    <div className="absolute" style={{ left: `${level * 16 + 6}px` }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-500 shrink-0">
                        <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                    </svg>
                    <span className="truncate">{item.name}</span>
                </button>
                {isOpen && (
                    <div className="mt-0.5">
                        {sortedChildren.map((child) => (
                            <FileTreeItem key={child.name} item={child} level={level + 1} onSelect={onSelect} selectedPath={selectedPath} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={() => onSelect(item.path)}
            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all duration-200 ${isSelected ? 'bg-[#FF2D20]/10 text-[#FF2D20] font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            style={{ paddingLeft: `${level * 16 + 28}px` }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FF2D20]' : 'text-gray-400'}`}>
                <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
            </svg>
            <span className="truncate">{item.name}</span>
        </button>
    );
};

export default function ComponentsManager() {
    const [sourceType, setSourceType] = useState('components'); // 'components' | 'pages'
    const [viewMode, setViewMode] = useState('single'); // 'single' | 'grid'
    const [selectedComponentPath, setSelectedComponentPath] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const previewContainerRef = useRef(null);

    // Load Imports
    const componentImports = import.meta.glob('../Components/**/*.jsx');
    const pageImports = import.meta.glob('../Pages/**/*.jsx');

    const currentImports = sourceType === 'components' ? componentImports : pageImports;

    const itemsList = useMemo(() => {
        return Object.keys(currentImports).map(path => {
            const base = sourceType === 'components' ? '../Components/' : '../Pages/';
            const name = path.replace(base, '').replace('.jsx', '');
            return { path, name };
        }).filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [currentImports, searchTerm, sourceType]);

    const fileTree = useMemo(() => buildFileTree(itemsList), [itemsList]);

    const SelectedComponent = useMemo(() => {
        if (!selectedComponentPath || !currentImports[selectedComponentPath]) return null;
        return React.lazy(currentImports[selectedComponentPath]);
    }, [selectedComponentPath, currentImports]);

    // Grid View Components
    const GridComponents = useMemo(() => {
        return itemsList.map(item => ({
            ...item,
            Component: React.lazy(currentImports[item.path])
        }));
    }, [itemsList, currentImports]);

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Head title="Components Manager" />

            <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-4 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-gray-500 hover:text-[#FF2D20] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <img src="/assets/icons/manager.svg" alt="Manager" className="w-6 h-6 opacity-75 invert-0" />
                        Components Manager
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Switcher (Only for Pages) */}
                    {sourceType === 'pages' && (
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <input
                                type="checkbox"
                                checked={viewMode === 'grid'}
                                onChange={(e) => setViewMode(e.target.checked ? 'grid' : 'single')}
                                className="w-4 h-4 text-[#FF2D20] border-gray-300 rounded focus:ring-[#FF2D20]"
                            />
                            <span className="text-sm text-gray-700 font-medium select-none">View All Pages</span>
                        </label>
                    )}

                    <div className="w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-[#FF2D20]/20 focus:border-[#FF2D20] outline-none transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-73px)]">
                {/* Sidebar */}
                <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        {/* Source Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-lg w-full mb-2">
                            <button
                                onClick={() => { setSourceType('components'); setViewMode('single'); setSelectedComponentPath(null); }}
                                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${sourceType === 'components' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Components
                            </button>
                            <button
                                onClick={() => { setSourceType('pages'); setSelectedComponentPath(null); }}
                                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${sourceType === 'pages' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Pages
                            </button>
                        </div>
                    </div>

                    <div className="p-4 flex-1">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                            {sourceType} Explorer
                        </div>
                        {Object.values(fileTree.children).map((child) => (
                            <FileTreeItem
                                key={child.name}
                                item={child}
                                onSelect={setSelectedComponentPath}
                                selectedPath={selectedComponentPath}
                            />
                        ))}
                        {Object.keys(fileTree.children).length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                No {sourceType} found.
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Preview Area */}
                <main className="flex-1 overflow-y-auto flex flex-col relative" ref={previewContainerRef}>
                    <Inspector containerRef={previewContainerRef} active={true} />

                    {viewMode === 'grid' && sourceType === 'pages' ? (
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-gray-100 min-h-full">
                            {GridComponents.map((item) => (
                                <div key={item.path} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px] relative transition-shadow hover:shadow-md">
                                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 z-10 relative">
                                        <span className="text-xs font-medium text-gray-600 truncate">{item.name}</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden relative bg-gray-100">
                                        <ErrorBoundary>
                                            <PageThumbnail>
                                                <Suspense fallback={
                                                    <div className="w-[1280px] h-[800px] flex items-center justify-center bg-white">
                                                        <div className="text-4xl text-gray-300 font-light">Loading...</div>
                                                    </div>
                                                }>
                                                    <item.Component />
                                                </Suspense>
                                            </PageThumbnail>
                                        </ErrorBoundary>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : selectedComponentPath ? (
                        <div className="flex-1 flex flex-col p-6 h-full">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 h-full">
                                <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-semibold text-gray-700 text-lg">
                                            {selectedComponentPath.replace(sourceType === 'components' ? '../Components/' : '../Pages/', '').replace(/.jsx$/, '')}
                                        </h2>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-500 font-mono border border-gray-200">JSX</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-auto relative p-8"
                                    style={{
                                        backgroundColor: '#f3f4f6',
                                        backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
                                        backgroundSize: '20px 20px',
                                        opacity: 1
                                    }}
                                >
                                    <ErrorBoundary key={selectedComponentPath}>
                                        <Suspense fallback={
                                            <div className="flex items-center justify-center h-full text-gray-400 gap-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                                                Loading...
                                            </div>
                                        }>
                                            <div className="inline-block min-w-full min-h-full">
                                                <SelectedComponent />
                                            </div>
                                        </Suspense>
                                    </ErrorBoundary>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                            <div className="text-center text-gray-400 max-w-md">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a {sourceType === 'components' ? 'Component' : 'Page'}</h3>
                                <p className="text-gray-500">Explore your project using the sidebar.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
