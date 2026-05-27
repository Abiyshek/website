const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const videosPath = 'src/assets/videos';
const thumbnailsPath = path.join(videosPath, 'thumbnails');

// Supported video formats
const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'];

// Professional gradient colors (organized in pairs)
const gradients = [
    { from: '#FF6B6B', to: '#C92A2A', name: 'Red' },
    { from: '#4ECDC4', to: '#0A7E8C', name: 'Teal' },
    { from: '#45B7D1', to: '#0E5A8C', name: 'Blue' },
    { from: '#F7B731', to: '#D4A017', name: 'Gold' },
    { from: '#5F27CD', to: '#341F97', name: 'Purple' },
    { from: '#00D2D3', to: '#00838F', name: 'Cyan' },
    { from: '#FF6B9D', to: '#C2185B', name: 'Pink' },
    { from: '#A8E6CF', to: '#56AB91', name: 'Mint' },
    { from: '#FFD3A5', to: '#FD6585', name: 'Peach' },
    { from: '#6C5CE7', to: '#A29BFE', name: 'Lavender' },
    { from: '#74B9FF', to: '#0984E3', name: 'Sky' },
    { from: '#FF7675', to: '#D63031', name: 'Coral' }
];

// Ensure thumbnails folder exists
if (!fs.existsSync(thumbnailsPath)) {
    fs.mkdirSync(thumbnailsPath, { recursive: true });
}

// Get all video files
const videoFiles = fs.readdirSync(videosPath)
    .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return videoExtensions.includes(ext) && !file.startsWith('.');
    })
    .sort();

if (videoFiles.length === 0) {
    console.log('✗ No video files found');
    process.exit(0);
}

console.log('Generating professional gradient thumbnails...\n');

generateThumbnails();

async function generateThumbnails() {
    let generated = 0;
    let skipped = 0;

    for (let index = 0; index < videoFiles.length; index++) {
        const videoFile = videoFiles[index];
        const videoName = path.parse(videoFile).name;
        const thumbnailPath = path.join(thumbnailsPath, `${videoName}.jpg`);

        // Skip if thumbnail already exists
        if (fs.existsSync(thumbnailPath)) {
            console.log(`⊘ ${videoFile} (already exists)`);
            skipped++;
            continue;
        }

        try {
            const gradient = gradients[index % gradients.length];
            
            // Create gradient background SVG
            const svg = `
                <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:${gradient.from};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${gradient.to};stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="300" height="200" fill="url(#grad)"/>
                    <!-- Play Button -->
                    <circle cx="150" cy="100" r="35" fill="rgba(255,255,255,0.9)"/>
                    <polygon points="135,90 135,110 155,100" fill="${gradient.to}"/>
                </svg>
            `;

            // Convert SVG to JPEG
            await sharp(Buffer.from(svg))
                .jpeg({ quality: 85 })
                .toFile(thumbnailPath);

            console.log(`✓ ${videoFile}`);
            generated++;
        } catch (error) {
            console.log(`✗ Failed: ${videoFile}`);
            console.log(`  Error: ${error.message}`);
            skipped++;
        }
    }

    console.log(`\n✓ Generated: ${generated} professional thumbnails`);
    console.log(`⊘ Skipped: ${skipped}`);
    
    if (generated > 0) {
        console.log('\n✨ Professional gradient thumbnails created!');
        console.log('Now run: npm run generate:videos');
    }
}
