import { spawn } from 'node:child_process';

const BUILD_COMMAND = process.platform === 'win32' ? 'npm run build:raw' : 'npm run build:raw';
const BUILD_ARGS = [];

const sections = [];
let outputBuffer = '';

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

    const warningSections = detectWarnings();
    sections.push(...warningSections);

    sections.push({
        label: 'Vite production build',
        ok: exitCode === 0,
        detail: signal
            ? `Process terminated by signal ${signal}.`
            : exitCode === 0
                ? `Command: ${BUILD_COMMAND}`
                : detectBuildFailureDetail(),
    });

    printSummary(exitCode);
    process.exit(exitCode);
});
