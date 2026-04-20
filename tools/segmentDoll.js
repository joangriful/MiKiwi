/**
 * Doll Image Segmentation Tool
 * 
 * This script segments full-body doll images into individual body parts:
 * - Head (cabeza)
 * - Torso (torso)
 * - Left Arm (brazo izquierdo)
 * - Right Arm (brazo derecho)
 * - Left Leg (pierna izquierda)
 * - Right Leg (pierna derecha)
 * 
 * Requirements:
 * - npm install sharp
 * 
 * Usage:
 * node tools/segmentDoll.js --input public/assets/source/doll_01.png --output public/assets/dolls/doll_01 --name "Muñeca Clásica"
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Segmentation regions (as percentages of image dimensions)
const SEGMENTS = {
    head: {
        topPercent: 0,
        bottomPercent: 0.20,
        leftPercent: 0.30,
        rightPercent: 0.70,
        anchorPoint: { x: 0.5, y: 1.0 },
        zIndex: 50
    },
    torso: {
        topPercent: 0.18,
        bottomPercent: 0.50,
        leftPercent: 0.25,
        rightPercent: 0.75,
        anchorPoint: { x: 0.5, y: 0.0 },
        zIndex: 30
    },
    armLeft: {
        topPercent: 0.22,
        bottomPercent: 0.65,
        leftPercent: 0,
        rightPercent: 0.32,
        anchorPoint: { x: 1.0, y: 0.15 },
        zIndex: 20
    },
    armRight: {
        topPercent: 0.22,
        bottomPercent: 0.65,
        leftPercent: 0.68,
        rightPercent: 1.0,
        anchorPoint: { x: 0.0, y: 0.15 },
        zIndex: 20
    },
    legLeft: {
        topPercent: 0.48,
        bottomPercent: 1.0,
        leftPercent: 0.30,
        rightPercent: 0.55,
        anchorPoint: { x: 0.65, y: 0.0 },
        zIndex: 10
    },
    legRight: {
        topPercent: 0.48,
        bottomPercent: 1.0,
        leftPercent: 0.45,
        rightPercent: 0.70,
        anchorPoint: { x: 0.35, y: 0.0 },
        zIndex: 10
    }
};

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        input: null,
        output: null,
        name: 'Unnamed Doll',
        variant: 'default',
        updateLibrary: true
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--input':
            case '-i':
                options.input = args[++i];
                break;
            case '--output':
            case '-o':
                options.output = args[++i];
                break;
            case '--name':
            case '-n':
                options.name = args[++i];
                break;
            case '--variant':
            case '-v':
                options.variant = args[++i];
                break;
            case '--no-library-update':
                options.updateLibrary = false;
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
        }
    }

    if (!options.input || !options.output) {
        console.error('Error: --input and --output are required');
        showHelp();
        process.exit(1);
    }

    return options;
}

function showHelp() {
    console.log(`
Doll Image Segmentation Tool

Usage:
  node tools/segmentDoll.js --input <input_file> --output <output_dir> [options]

Required:
  --input, -i       Input image file (full-body doll PNG)
  --output, -o      Output directory for segmented parts

Optional:
  --name, -n        Name of the doll (default: "Unnamed Doll")
  --variant, -v     Variant style (default: "default")
  --no-library-update   Don't update partLibrary.json
  --help, -h        Show this help message

Example:
  node tools/segmentDoll.js -i public/assets/source/doll_01.png -o public/assets/dolls/doll_01 -n "Classic Doll"
    `);
}

/**
 * Create output directories if they don't exist
 */
async function ensureDirectories(outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(path.join(outputDir, 'thumbnails'), { recursive: true });
}

/**
 * Segment a specific part of the image
 */
async function segmentPart(inputPath, outputPath, segment, metadata) {
    const { width, height } = metadata;

    const left = Math.floor(width * segment.leftPercent);
    const top = Math.floor(height * segment.topPercent);
    const extractWidth = Math.floor(width * (segment.rightPercent - segment.leftPercent));
    const extractHeight = Math.floor(height * (segment.bottomPercent - segment.topPercent));

    await sharp(inputPath)
        .extract({
            left,
            top,
            width: extractWidth,
            height: extractHeight
        })
        .png()
        .toFile(outputPath);

    return { width: extractWidth, height: extractHeight };
}

/**
 * Create thumbnail from part image
 */
async function createThumbnail(partPath, thumbnailPath, size = 150) {
    await sharp(partPath)
        .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(thumbnailPath);
}

/**
 * Update partLibrary.json with new doll data
 */
async function updatePartLibrary(dollId, dollName, variant, outputDir, partDimensions) {
    const libraryPath = path.join(process.cwd(), 'public', 'data', 'partLibrary.json');

    let library;
    try {
        const content = await fs.readFile(libraryPath, 'utf8');
        library = JSON.parse(content);
    } catch (error) {
        console.warn('partLibrary.json not found, creating new one');
        library = { dolls: [], partTypes: [] };
    }

    // Remove existing doll with same ID
    library.dolls = library.dolls.filter(d => d.id !== dollId);

    // Create new doll entry
    const dollEntry = {
        id: dollId,
        name: dollName,
        description: `${dollName} - ${variant} style`,
        parts: {}
    };

    Object.entries(SEGMENTS).forEach(([partType, segment]) => {
        const partFileName = partType === 'armLeft' ? 'arm_left.png' :
            partType === 'armRight' ? 'arm_right.png' :
                partType === 'legLeft' ? 'leg_left.png' :
                    partType === 'legRight' ? 'leg_right.png' :
                        `${partType}.png`;

        dollEntry.parts[partType] = {
            path: `/assets/dolls/${dollId}/${partFileName}`,
            thumbnail: `/assets/dolls/${dollId}/thumbnails/${partFileName}`,
            anchorPoint: segment.anchorPoint,
            width: partDimensions[partType].width,
            height: partDimensions[partType].height,
            variant: variant,
            zIndex: segment.zIndex
        };
    });

    library.dolls.push(dollEntry);

    // Ensure partTypes are defined
    if (!library.partTypes || library.partTypes.length === 0) {
        library.partTypes = [
            { id: 'head', name: 'Cabeza', description: 'Incluye cabeza completa y cuello' },
            { id: 'torso', name: 'Torso', description: 'Desde la base del cuello hasta la cintura' },
            { id: 'armLeft', name: 'Brazo Izquierdo', description: 'Desde el hombro hasta la mano' },
            { id: 'armRight', name: 'Brazo Derecho', description: 'Desde el hombro hasta la mano' },
            { id: 'legLeft', name: 'Pierna Izquierda', description: 'Desde la cadera hasta el pie' },
            { id: 'legRight', name: 'Pierna Derecha', description: 'Desde la cadera hasta el pie' }
        ];
    }

    await fs.writeFile(libraryPath, JSON.stringify(library, null, 2), 'utf8');
    console.log(`✓ Updated partLibrary.json`);
}

/**
 * Main segmentation function
 */
async function segmentDoll(options) {
    console.log('\n🎨 Doll Image Segmentation Tool\n');
    console.log(`Input: ${options.input}`);
    console.log(`Output: ${options.output}`);
    console.log(`Name: ${options.name}`);
    console.log(`Variant: ${options.variant}\n`);

    try {
        // Get image metadata
        const metadata = await sharp(options.input).metadata();
        console.log(`Image dimensions: ${metadata.width}x${metadata.height}`);

        // Create output directories
        await ensureDirectories(options.output);

        // Generate doll ID from output path
        const dollId = path.basename(options.output);
        const partDimensions = {};

        // Segment each part
        console.log('\nSegmenting parts:');
        for (const [partType, segment] of Object.entries(SEGMENTS)) {
            const partFileName = partType === 'armLeft' ? 'arm_left.png' :
                partType === 'armRight' ? 'arm_right.png' :
                    partType === 'legLeft' ? 'leg_left.png' :
                        partType === 'legRight' ? 'leg_right.png' :
                            `${partType}.png`;

            const partPath = path.join(options.output, partFileName);
            const thumbnailPath = path.join(options.output, 'thumbnails', partFileName);

            const dimensions = await segmentPart(options.input, partPath, segment, metadata);
            partDimensions[partType] = dimensions;
            console.log(`  ✓ ${partType} (${dimensions.width}x${dimensions.height})`);

            await createThumbnail(partPath, thumbnailPath);
            console.log(`    ✓ thumbnail created`);
        }

        // Update part library
        if (options.updateLibrary) {
            await updatePartLibrary(dollId, options.name, options.variant, options.output, partDimensions);
        }

        console.log('\n✅ Segmentation complete!\n');
    } catch (error) {
        console.error('\n❌ Error during segmentation:', error.message);
        process.exit(1);
    }
}

// Run the tool
if (require.main === module) {
    const options = parseArgs();
    segmentDoll(options);
}

module.exports = { segmentDoll, SEGMENTS };
