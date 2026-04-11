
// --- Tree Helpers ---
export const buildFileTree = (paths) => {
    const tree = { name: 'root', isFolder: true, children: {}, path: '' };
    paths.forEach(pathObj => {
        const parts = pathObj.name.split('/').filter(p => p !== '.' && p !== '');
        let current = tree;
        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            if (!current.children[part]) {
                // Assign a path to folders as well, using fullPathComponents
                const folderPath = parts.slice(0, index + 1).join('/');
                current.children[part] = {
                    name: part,
                    isFolder: !isFile,
                    children: isFile ? null : {},
                    path: isFile ? pathObj.path : folderPath, // Set path for folders too
                    fullPathComponents: parts.slice(0, index + 1),
                };
            }
            current = current.children[part];
        });
    });
    return tree;
};

export const collectAllPaths = (node) => {
    let paths = [];
    if (!node.isFolder && node.path) {
        paths.push(node.path);
    } else if (node.children) {
        Object.values(node.children).forEach(child => {
            paths = paths.concat(collectAllPaths(child));
        });
    }
    return paths;
};

// --- Flatten Tree Helper ---
export const flattenTree = (node, openFolders, result = [], level = 0) => {
    if (!node.children) return;

    const sortedChildren = Object.values(node.children).sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
    });

    sortedChildren.forEach(child => {
        result.push({ ...child, level });
        if (child.isFolder && openFolders.has(child.path)) { // Use child.path for folder state
            flattenTree(child, openFolders, result, level + 1);
        }
    });
    return result;
};

// Parse Colors Helper
export const parseColorsFromCss = (css) => {
    const colorsMap = new Map();
    // Regex to find --variable-name: #hex;
    // We strictly look for hex codes to identify them as 'colors' for the visual grid, 
    // but we captures the variable name for filtering by reference.
    const regex = /--([a-zA-Z0-9-]+):\s*(#[0-9a-fA-F]{3,8})/g;
    let match;
    while ((match = regex.exec(css)) !== null) {
        const name = match[1];
        // Only add if not exists (preserves first occurrence -> Light Mode usually)
        if (!colorsMap.has(name)) {
            colorsMap.set(name, {
                name: name, // e.g. "color-primary"
                hex: match[2],  // e.g. "#99b849"
                label: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) // "Color Primary"
            });
        }
    }
    return Array.from(colorsMap.values());
};
