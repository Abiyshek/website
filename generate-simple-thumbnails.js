const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const videosPath = 'src/assets/videos';
const thumbnailsPath = path.join(videosPath, 'thumbnails');

// Supported video formats
const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'];

// Color palette for thumbnails
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B88B', '#52B788', '#C1666B', '#48A9A6'
];

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

console.log('Generating thumbnail placeholders for videos...\n');

generateThumbnails();

async function generateThumbnails() {
    let generated = 0;

    for (let index = 0; index < videoFiles.length; index++) {
        const videoFile = videoFiles[index];
        const videoName = path.parse(videoFile).name;
        const thumbnailPath = path.join(thumbnailsPath, `${videoName}.jpg`);

        // Skip if thumbnail already exists
        if (fs.existsSync(thumbnailPath)) {
            console.log(`⊘ ${videoFile} (thumbnail already exists)`);
            continue;
        }

        try {
            const color = colors[index % colors.length];
            const displayText = videoName.substring(0, 20);
            
            // Create a colored thumbnail with video name
            await sharp({
                create: {
                    width: 300,
                    height: 200,
                    channels: 3,
                    background: color
                }
            })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);
            
            console.log(`✓ ${videoFile}`);
            generated++;
        } catch (error) {
            console.log(`✗ Failed to generate thumbnail for ${videoFile}`);
            console.log(`  Error: ${error.message}`);
        }
    }

    console.log(`\n✓ Generated: ${generated} thumbnails`);
    console.log('\nThumbnails created at: src/assets/videos/thumbnails/');
    console.log('Now run: npm run generate:videos');
}
