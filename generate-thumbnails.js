const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const videosPath = 'src/assets/videos';
const thumbnailsPath = path.join(videosPath, 'thumbnails');

// Supported video formats
const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'];

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

console.log('Generating thumbnails for videos...\n');

// Try to generate thumbnails with ffmpeg
generateThumbnails();

async function generateThumbnails() {
    let generated = 0;
    let skipped = 0;

    for (const videoFile of videoFiles) {
        const videoPath = path.join(videosPath, videoFile);
        const videoName = path.parse(videoFile).name;
        const thumbnailPath = path.join(thumbnailsPath, `${videoName}.jpg`);

        // Skip if thumbnail already exists
        if (fs.existsSync(thumbnailPath)) {
            console.log(`⊘ ${videoFile} (thumbnail already exists)`);
            skipped++;
            continue;
        }

        try {
            // Try to generate thumbnail using ffmpeg
            const command = `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -vf "scale=300:200" "${thumbnailPath}" -y`;
            
            console.log(`⏳ Generating thumbnail for: ${videoFile}`);
            await execAsync(command);
            console.log(`✓ ${videoFile}`);
            generated++;
        } catch (error) {
            console.log(`✗ Failed to generate thumbnail for ${videoFile}`);
            console.log(`  Install ffmpeg: https://ffmpeg.org/download.html`);
            skipped++;
        }
    }

    console.log(`\n✓ Generated: ${generated}`);
    console.log(`⊘ Skipped: ${skipped}`);
    
    if (generated > 0) {
        console.log('\nNow run: npm run generate:videos');
    }
}
