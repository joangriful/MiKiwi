/**
 * Placeholder Image Generator
 * 
 * Generates simple placeholder SVGs for testing the doll configurator
 * before real doll images are available.
 */

const fs = require('fs').promises;
const path = require('path');

const PLACEHOLDERS = {
    doll_placeholder_1: {
        name: 'Muñeca Clásica',
        variant: 'classic',
        colors: {
            skin: '#ffd5b4',
            hair: '#8b4513',
            dress: '#ff9ec7'
        }
    },
    doll_placeholder_2: {
        name: 'Muñeca Moderna',
        variant: 'modern',
        colors: {
            skin: '#f0c8a0',
            hair: '#f4d03f',
            dress: '#9b59b6'
        }
    }
};

function generateHeadSVG(colors) {
    return `<svg width="500" height="600" viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">
  <!-- Neck -->
  <rect x="200" y="470" width="100" height="130" fill="${colors.skin}" rx="10"/>
  
  <!-- Head -->
  <ellipse cx="250" cy="250" rx="140" ry="160" fill="${colors.skin}"/>
  
  <!-- Hair -->
  <ellipse cx="250" cy="180" rx="150" ry="120" fill="${colors.hair}"/>
  <ellipse cx="250" cy="240" rx="155" ry="140" fill="${colors.hair}"/>
  
  <!-- Eyes -->
  <ellipse cx="210" cy="240" rx="20" ry="30" fill="#2c3e50"/>
  <ellipse cx="290" cy="240" rx="20" ry="30" fill="#2c3e50"/>
  <circle cx="215" cy="235" r="8" fill="white"/>
  <circle cx="295" cy="235" r="8" fill="white"/>
  
  <!-- Mouth -->
  <path d="M 220 300 Q 250 320 280 300" stroke="#e74c3c" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;
}

function generateTorsoSVG(colors) {
    return `<svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
  <!-- Neck connection -->
  <rect x="250" y="0" width="100" height="80" fill="${colors.skin}" rx="10"/>
  
  <!-- Torso/Dress -->
  <path d="M 200 80 L 150 200 L 120 450 L 200 550 L 400 550 L 480 450 L 450 200 L 400 80 Z" 
        fill="${colors.dress}" stroke="#764ba2" stroke-width="3"/>
  
  <!-- Shoulders -->
  <circle cx="200" cy="120" r="40" fill="${colors.skin}"/>
  <circle cx="400" cy="120" r="40" fill="${colors.skin}"/>
  
  <!-- Waist definition -->
  <ellipse cx="300" cy="400" rx="100" ry="60" fill="${colors.dress}" opacity="0.7"/>
</svg>`;
}

function generateArmSVG(colors, isLeft = true) {
    const transform = isLeft ? '' : 'scale(-1, 1) translate(-300, 0)';
    return `<svg width="300" height="700" viewBox="0 0 300 700" xmlns="http://www.w3.org/2000/svg">
  <g transform="${transform}">
    <!-- Shoulder connection -->
    <circle cx="50" cy="80" r="45" fill="${colors.skin}"/>
    
    <!-- Upper arm -->
    <ellipse cx="80" cy="200" rx="40" ry="140" fill="${colors.skin}"/>
    
    <!-- Elbow -->
    <circle cx="90" cy="340" r="35" fill="${colors.skin}"/>
    
    <!-- Forearm -->
    <ellipse cx="110" cy="480" rx="38" ry="150" fill="${colors.skin}"/>
    
    <!-- Hand -->
    <ellipse cx="120" cy="640" rx="45" ry="55" fill="${colors.skin}"/>
  </g>
</svg>`;
}

function generateLegSVG(colors, isLeft = true) {
    const offsetX = isLeft ? 0 : 50;
    return `<svg width="350" height="900" viewBox="0 0 350 900" xmlns="http://www.w3.org/2000/svg">
  <!-- Hip connection -->
  <ellipse cx="${150 + offsetX}" cy="80" rx="60" ry="50" fill="${colors.skin}"/>
  
  <!-- Thigh -->
  <ellipse cx="${160 + offsetX}" cy="300" rx="55" ry="230" fill="${colors.skin}"/>
  
  <!-- Knee -->
  <circle cx="${165 + offsetX}" cy="530" r="42" fill="${colors.skin}"/>
  
  <!-- Calf -->
  <ellipse cx="${170 + offsetX}" cy="700" rx="48" ry="180" fill="${colors.skin}"/>
  
  <!-- Foot -->
  <ellipse cx="${175 + offsetX}" cy="870" rx="55" ry="25" fill="${colors.skin}"/>
  <ellipse cx="${195 + offsetX}" cy="875" rx="40" ry="20" fill="${colors.skin}" transform="rotate(15 ${195 + offsetX} 875)"/>
</svg>`;
}

async function createDirectories() {
    const baseDir = path.join(process.cwd(), 'public', 'assets', 'dolls');

    for (const dollId of Object.keys(PLACEHOLDERS)) {
        const dollDir = path.join(baseDir, dollId);
        const thumbnailDir = path.join(dollDir, 'thumbnails');

        await fs.mkdir(dollDir, { recursive: true });
        await fs.mkdir(thumbnailDir, { recursive: true });
    }
}

async function generatePlaceholdersForDoll(dollId, config) {
    const dollDir = path.join(process.cwd(), 'public', 'assets', 'dolls', dollId);

    console.log(`Generating placeholders for ${config.name}...`);

    // Generate SVG files
    const parts = {
        head: generateHeadSVG(config.colors),
        torso: generateTorsoSVG(config.colors),
        arm_left: generateArmSVG(config.colors, true),
        arm_right: generateArmSVG(config.colors, false),
        leg_left: generateLegSVG(config.colors, true),
        leg_right: generateLegSVG(config.colors, false)
    };

    for (const [partName, svgContent] of Object.entries(parts)) {
        const filePath = path.join(dollDir, `${partName}.svg`);
        await fs.writeFile(filePath, svgContent);
        console.log(`  ✓ Created ${partName}.svg`);
    }
}

async function generateAllPlaceholders() {
    console.log('\n🎨 Generating Placeholder Images\n');

    try {
        await createDirectories();

        for (const [dollId, config] of Object.entries(PLACEHOLDERS)) {
            await generatePlaceholdersForDoll(dollId, config);
        }

        console.log('\n✅ All placeholders generated!');
        console.log('\n📝 Note: SVG files created. To convert to PNG, install sharp:');
        console.log('   npm install sharp');
        console.log('   Then run: node tools/convertSVGtoPNG.js\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

if (require.main === module) {
    generateAllPlaceholders();
}

module.exports = { generateAllPlaceholders, PLACEHOLDERS };
