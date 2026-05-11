import fs from 'fs';
import path from 'path';

const docsDir = './docs';

function fixMojibake(text) {
    return text
        .replace(/Ã­/g, 'í')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã©/g, 'é')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã±/g, 'ñ')
        .replace(/Ã /g, 'Á')
        .replace(/Ã‰/g, 'É')
        .replace(/Ã /g, 'Í')
        .replace(/Ã“/g, 'Ó')
        .replace(/Ãš/g, 'Ú')
        .replace(/Ã‘/g, 'Ñ');
}

function cleanHeader(content) {
    const lines = content.split('\n');
    while (lines.length > 0 && (lines[0].includes('IconParkSolidBack.svg') || lines[0].includes('índice') || lines[0].includes('Ã­ndice') || lines[0].trim() === '')) {
        lines.shift();
    }
    return lines.join('\n').trim();
}

// Subdirectories
const subdirs = fs.readdirSync(docsDir).filter(f => fs.statSync(path.join(docsDir, f)).isDirectory());

subdirs.forEach(subdir => {
    const subdirPath = path.join(docsDir, subdir);
    if (subdir === 'assets') return;

    // README.md in folder (Back to Index)
    const folderReadme = path.join(subdirPath, 'README.md');
    if (fs.existsSync(folderReadme)) {
        let content = fs.readFileSync(folderReadme, 'utf8');
        const header = `<a href="../index.md"><img src="../assets/icons/IconParkSolidBack.svg" width="24" height="24" alt="Volver" /></a>\n\n`;
        fs.writeFileSync(folderReadme, header + fixMojibake(cleanHeader(content)), 'utf8');
    }
    
    // Other .md files
    function processDir(currentPath) {
        fs.readdirSync(currentPath).forEach(file => {
            const fullPath = path.join(currentPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                processDir(fullPath);
            } else if (file.endsWith('.md') && file !== 'README.md') {
                let content = fs.readFileSync(fullPath, 'utf8');
                const relativeToIcon = path.relative(path.dirname(fullPath), path.join(docsDir, 'assets/icons/IconParkSolidBack.svg')).replace(/\\/g, '/');
                const relativeToFolderReadme = path.relative(path.dirname(fullPath), folderReadme).replace(/\\/g, '/');
                const header = `<a href="${relativeToFolderReadme}"><img src="${relativeToIcon}" width="24" height="24" alt="Volver a la carpeta" /></a>\n\n`;
                fs.writeFileSync(fullPath, header + fixMojibake(cleanHeader(content)), 'utf8');
            }
        });
    }
    processDir(subdirPath);
});

// Root docs files
['DOCUMENTACION_PROYECTO.md', 'PROJECT_STRUCTURE.md', 'index.md'].forEach(file => {
    const filePath = path.join(docsDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const target = (file === 'index.md') ? '../README.md' : 'index.md';
        const iconPath = (file === 'index.md') ? 'assets/icons/IconParkSolidBack.svg' : 'assets/icons/IconParkSolidBack.svg';
        const header = `<a href="${target}"><img src="${iconPath}" width="24" height="24" alt="Volver" /></a>\n\n`;
        fs.writeFileSync(filePath, header + fixMojibake(cleanHeader(content)), 'utf8');
    }
});

console.log('Docs navigation cleaned, updated and mojibake fixed.');
