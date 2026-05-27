const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ffmpegDownloader = require('ffmpeg-downloader');

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

// Download and extract
initFFmpeg();

async function initFFmpeg() {
    console.log('Setting up FFmpeg...\n');
    
    try {
        // Download ffmpeg binary
        console.log('Downloading FFmpeg binary (this may take a moment)...');
        await ffmpegDownloader.download();
        const ffmpegPath = ffmpegDownloader.path;
        console.log(`✓ FFmpeg ready at: ${ffmpegPath}\n`);
        
        // Extract thumbnails
        extractThumbnails(ffmpegPath);
    } catch (error) {
        console.error('Failed to download FFmpeg:', error.message || error);
        process.exit(1);
    }
}

function extractThumbnails(ffmpegPath) {
    console.log('Extracting first frame from videos as thumbnails...\n');

    let generated = 0;
    let skipped = 0;

    for (const videoFile of videoFiles) {
        const videoPath = path.resolve(path.join(videosPath, videoFile));
        const videoName = path.parse(videoFile).name;
        const thumbnailPath = path.resolve(path.join(thumbnailsPath, `${videoName}.jpg`));

        // Skip if thumbnail already exists
        if (fs.existsSync(thumbnailPath)) {
            console.log(`⊘ ${videoFile} (thumbnail already exists)`);
            skipped++;
            continue;
        }

        try {
            console.log(`⏳ Processing: ${videoFile}`);
            
            // Extract first frame using ffmpeg binary directly
            const args = [
                '-i', videoPath,
                '-ss', '1',           // Start at 1 second
                '-vframes', '1',      // Extract 1 frame
                '-vf', 'scale=300:200', // Resize to 300x200
                '-y',                 // Overwrite output
                thumbnailPath
            ];

            // Suppress ffmpeg output
            execFileSync(ffmpegPath, args, {
                stdio: ['ignore', 'pipe', 'pipe']
            });

            console.log(`✓ ${videoFile}`);
            generated++;
        } catch (error) {
            console.log(`✗ Failed: ${videoFile}`);
            console.log(`  Error: ${error.message.split('\n')[0]}`);
            skipped++;
        }
    }

    console.log(`\n✓ Generated: ${generated}`);
    console.log(`⊘ Skipped: ${skipped}`);
    
    if (generated > 0) {
        console.log('\nNow run: npm run generate:videos');
    }
    
    process.exit(generated > 0 ? 0 : 1);
}
