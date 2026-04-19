import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';

const BUILD_COMMAND = process.platform === 'win32' ? 'npm run build:raw' : 'npm run build:raw';
const BUILD_ARGS = [];

const sections = [];
let outputBuffer = '';

const hotFilePath = path.join(process.cwd(), 'public', 'hot');

if (existsSync(hotFilePath)) {
    unlinkSync(hotFilePath);
    sections.push({
        label: 'Vite dev hot file cleanup',
        ok: true,
        detail: 'Removed stale public/hot before production build.',
    });
}

function printDivider() {
    console.log('\n----------------------------------------');
}

function printSummary(exitCode) {
    printDivider();
    console.log('Build Summary');
    printDivider();

    for (const section of sections) {
        const statusLabel = section.ok ? 'PASSED' : 'FAILED';
        console.log(`${statusLabel}  ${section.label}`);

        if (section.detail) {
            console.log(`       ${section.detail}`);
        }
    }

    printDivider();
    console.log(exitCode === 0 ? 'Build completed successfully.' : `Build failed with exit code ${exitCode}.`);
}

function appendOutput(chunk, writer) {
    const text = chunk.toString();
    outputBuffer += text;
    writer.write(text);
}

function detectWarnings() {
    const warnings = [];

    if (outputBuffer.includes('Some chunks are larger than 500 kB after minification')) {
        warnings.push({
            label: 'Chunk size warning',
            ok: true,
            detail: 'Some chunks are larger than 500 kB after minification.',
        });
    }

    return warnings;
}

function detectBuildFailureDetail() {
    const checks = [
        {
            pattern: /Could not resolve "([^"]+)"/i,
            getDetail: (match) => `Missing or unresolved import: ${match[1]}`,
        },
        {
            pattern: /Failed to resolve import "([^"]+)" from "([^"]+)"/i,
            getDetail: (match) => `Failed to resolve import ${match[1]} from ${match[2]}`,
        },
        {
            pattern: /ENOENT: no such file or directory, (?:open|scandir) '([^']+)'/i,
            getDetail: (match) => `Missing file or directory: ${match[1]}`,
        },
        {
            pattern: /\[vite:css\][\s\S]*?([^:\r\n]+\.css)[\s\S]*?Error:/i,
            getDetail: (match) => `CSS processing error near ${match[1].trim()}`,
        },
        {
            pattern: /Unexpected token[\s\S]*?([A-Za-z]:[^\r\n]+|\/[^\r\n]+)/i,
            getDetail: (match) => `Syntax error near ${match[1].trim()}`,
        },
        {
            pattern: /error during build:/i,
            getDetail: () => 'Vite reported a build error. Review the error block above.',
        },
    ];

    for (const check of checks) {
        const match = outputBuffer.match(check.pattern);

        if (match) {
            return check.getDetail(match);
        }
    }

    return 'Unknown build error. Review the error block above.';
}

function formatKilobytes(bytes) {
    return `${(bytes / 1024).toFixed(2)} kB`;
}

function analyzeChunkSizes() {
    const manifestPath = path.join(process.cwd(), 'public', 'build', 'manifest.json');

    if (!existsSync(manifestPath)) {
        return {
            topChunksSection: {
                label: 'Largest JS chunks',
                ok: false,
                detail: 'Could not find public/build/manifest.json to analyze chunk sizes.',
            },
            budgetSection: {
                label: 'Chunk budget check',
                ok: false,
                detail: 'Chunk budget analysis skipped because manifest file is missing.',
            },
        };
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const chunkFiles = new Set();

    for (const entry of Object.values(manifest)) {
        const outputFile = entry?.file;

        if (typeof outputFile === 'string' && outputFile.endsWith('.js')) {
            chunkFiles.add(outputFile);
        }
    }

    const chunksWithSize = Array.from(chunkFiles).map((file) => {
        const absolutePath = path.join(process.cwd(), 'public', 'build', file);
        const size = statSync(absolutePath).size;

        return {
            file,
            size,
        };
    }).sort((a, b) => b.size - a.size);

    const topChunks = chunksWithSize.slice(0, 5);
    const topChunkLines = topChunks.map((chunk, index) => `${index + 1}. ${chunk.file} (${formatKilobytes(chunk.size)})`);

    const MAX_JS_CHUNK_SIZE_BYTES = 450 * 1024;
    const ALLOWLISTED_LARGE_CHUNKS = [
        /assets\/events-.*\.js$/,
        /assets\/react-stack-.*\.js$/,
    ];

    const budgetOffenders = chunksWithSize.filter((chunk) => {
        if (chunk.size <= MAX_JS_CHUNK_SIZE_BYTES) {
            return false;
        }

        return !ALLOWLISTED_LARGE_CHUNKS.some((pattern) => pattern.test(chunk.file));
    });

    const topChunksSection = {
        label: 'Largest JS chunks',
        ok: true,
        detail: topChunkLines.join('\n       '),
    };

    const budgetSection = budgetOffenders.length === 0
        ? {
            label: 'Chunk budget check',
            ok: true,
            detail: `No non-allowlisted JS chunk exceeded ${formatKilobytes(MAX_JS_CHUNK_SIZE_BYTES)}.`,
        }
        : {
            label: 'Chunk budget check',
            ok: false,
            detail: budgetOffenders
                .map((chunk) => `${chunk.file} (${formatKilobytes(chunk.size)}) exceeded ${formatKilobytes(MAX_JS_CHUNK_SIZE_BYTES)}.`)
                .join('\n       '),
        };

    return {
        topChunksSection,
        budgetSection,
    };
}

console.log('Running production build...');

const child = spawn(BUILD_COMMAND, BUILD_ARGS, {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
});

child.stdout.on('data', (chunk) => appendOutput(chunk, process.stdout));
child.stderr.on('data', (chunk) => appendOutput(chunk, process.stderr));

child.on('error', (error) => {
    sections.push({
        label: 'Vite production build',
        ok: false,
        detail: error.message,
    });

    printSummary(1);
    process.exit(1);
});

child.on('exit', (code, signal) => {
    const exitCode = code ?? 1;
    let finalExitCode = exitCode;

    const warningSections = detectWarnings();
    sections.push(...warningSections);

    if (exitCode === 0) {
        const { topChunksSection, budgetSection } = analyzeChunkSizes();
        sections.push(topChunksSection, budgetSection);

        if (!budgetSection.ok) {
            finalExitCode = 1;
        }
    }

    sections.push({
        label: 'Vite production build',
        ok: finalExitCode === 0,
        detail: signal
            ? `Process terminated by signal ${signal}.`
            : finalExitCode === 0
                ? `Command: ${BUILD_COMMAND}`
                : detectBuildFailureDetail(),
    });

    printSummary(finalExitCode);
    process.exit(finalExitCode);
});
