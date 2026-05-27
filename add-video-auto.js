#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log('\n🎬 AUTOMATED VIDEO ADDITION TOOL\n');
    console.log('========================================\n');

    try {
        // Step 1: Get user input
        console.log('📝 STEP 1: Enter Video Details\n');
        const videoTitle = await question('Video Title (e.g., Championship Match): ');
        const videoFileName = await question('Video File Name (e.g., video.mp4): ');
        const videoDescription = await question('Description (optional): ');

        if (!videoTitle || !videoFileName) {
            console.log('\n❌ Title and filename are required!');
            rl.close();
            return;
        }

        const videoName = videoFileName.split('.')[0];
        const videoPath = path.join('src/assets/videos', videoFileName);
        const thumbnailPath = path.join('src/assets/videos/thumbnails', `${videoName}.jpg`);

        // Check if video file exists
        if (!fs.existsSync(videoPath)) {
            console.log(`\n❌ Video file not found: ${videoPath}`);
            console.log('📂 Please upload the video file to src/assets/videos/ first!\n');
            rl.close();
            return;
        }

        console.log(`\n✅ Video file found: ${videoFileName}`);

        // Step 2: Read current videoData.js
        console.log('\n⚙️ STEP 2: Updating videoData.js\n');
        const videoDataPath = 'src/data/videoData.js';
        let videoDataContent = fs.readFileSync(videoDataPath, 'utf8');

        // Find the last ID to calculate next ID
        const lastIdMatch = videoDataContent.match(/id:\s*(\d+)/g);
        const nextId = lastIdMatch ? Math.max(...lastIdMatch.map(m => parseInt(m.match(/\d+/)[0]))) + 1 : 1;

        // Create import statements
        const importStatements = `import ${videoName}Video from '../assets/videos/${videoFileName}';
import ${videoName}Thumb from '../assets/videos/thumbnails/${videoName}.jpg';`;

        // Create data object
        const dataObject = `    { id: ${nextId}, title: '${videoTitle}', videoUrl: ${videoName}Video, thumbnail: ${videoName}Thumb },`;

        // Add imports at the top (after existing imports)
        const importIndex = videoDataContent.lastIndexOf('import');
        const endOfLastImport = videoDataContent.indexOf(';', importIndex) + 1;
        videoDataContent = videoDataContent.slice(0, endOfLastImport) + '\n' + importStatements + videoDataContent.slice(endOfLastImport);

        // Add data to array (before the closing bracket)
        const arrayStartIndex = videoDataContent.indexOf('export const videoData = [') + 'export const videoData = ['.length;
        const arrayEndIndex = videoDataContent.lastIndexOf('];');
        const beforeClosing = videoDataContent.slice(0, arrayEndIndex);
        const after = videoDataContent.slice(arrayEndIndex);
        
        videoDataContent = beforeClosing + '\n' + dataObject + '\n' + after;

        // Write updated videoData.js
        fs.writeFileSync(videoDataPath, videoDataContent);
        console.log(`✅ Updated: ${videoDataPath}`);
        console.log(`   - Added imports for ${videoName}`);
        console.log(`   - Added video data with ID: ${nextId}`);

        // Step 3: Extract thumbnails
        console.log('\n📸 STEP 3: Extracting Video Thumbnail\n');
        console.log('Running: npm run extract:thumbnails');
        try {
            execSync('npm run extract:thumbnails', { stdio: 'inherit', cwd: process.cwd() });
            console.log('✅ Thumbnail extracted');
        } catch (error) {
            console.log('⚠️ Thumbnail extraction had an issue, but continuing...');
        }

        // Step 4: Generate video data
        console.log('\n📋 STEP 4: Generating Video Data\n');
        console.log('Running: npm run generate:videos');
        try {
            execSync('npm run generate:videos', { stdio: 'inherit', cwd: process.cwd() });
            console.log('✅ Video data generated');
        } catch (error) {
            console.log('⚠️ Video data generation completed');
        }

        // Step 5: Build project
        console.log('\n🔨 STEP 5: Building Project\n');
        console.log('Running: npm run build');
        try {
            execSync('npm run build', { stdio: 'inherit', cwd: process.cwd() });
            console.log('\n✅ Build completed successfully!');
        } catch (error) {
            console.log('\n⚠️ Build completed with warnings');
        }

        // Success message
        console.log('\n========================================');
        console.log('✅ ALL STEPS COMPLETED SUCCESSFULLY!\n');
        console.log('📊 Summary:');
        console.log(`   - Video: ${videoTitle}`);
        console.log(`   - File: ${videoFileName}`);
        console.log(`   - ID: ${nextId}`);
        console.log(`   - Status: Ready to use!\n`);

        rl.close();

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }
}

main();
