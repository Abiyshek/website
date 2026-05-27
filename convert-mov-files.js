const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

const videoDir = path.join(__dirname, 'src', 'assets', 'videos');
const movFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.MOV'));

if (movFiles.length === 0) {
    console.log('✅ No MOV files found to convert');
    process.exit(0);
}

console.log(`🎬 Found ${movFiles.length} MOV file(s) to convert...\n`);

let converted = 0;
let failed = 0;

movFiles.forEach((file, index) => {
    const inputPath = path.join(videoDir, file);
    const outputPath = path.join(videoDir, file.replace('.MOV', '.mp4'));

    if (fs.existsSync(outputPath)) {
        console.log(`⏭️  Skipping ${file} - MP4 already exists`);
        return;
    }

    console.log(`[${index + 1}/${movFiles.length}] 🔄 Converting: ${file}...`);

    ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => {
            console.log(`✅ Converted: ${file} → ${file.replace('.MOV', '.mp4')}\n`);
            converted++;
            
            if (converted + failed === movFiles.length) {
                console.log(`\n✨ Conversion complete! ${converted} converted, ${failed} failed`);
                process.exit(0);
            }
        })
        .on('error', (err) => {
            console.log(`❌ Error converting ${file}: ${err.message}\n`);
            failed++;
            
            if (converted + failed === movFiles.length) {
                console.log(`\n✨ Conversion complete! ${converted} converted, ${failed} failed`);
                process.exit(failed > 0 ? 1 : 0);
            }
        })
        .run();
});
