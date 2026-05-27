const fs = require('fs');
const path = require('path');

const videosPath = 'src/assets/videos';

// Check if videos folder exists
if (!fs.existsSync(videosPath)) {
    console.log('✗ Videos folder not found at ' + videosPath);
    console.log('Creating folder structure for you...');
    fs.mkdirSync(videosPath, { recursive: true });
    fs.mkdirSync(path.join(videosPath, 'thumbnails'), { recursive: true });
    console.log('✓ Videos folder created!');
    console.log('\nNow add your video files (.mp4, .webm, etc.) to: src/assets/videos/');
    process.exit(0);
}

// Supported video formats
const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv'];

let imports = '';
let videoArray = '';
let id = 1;
let totalVideos = 0;

// Get all video files
const files = fs.readdirSync(videosPath)
    .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return videoExtensions.includes(ext) && !file.startsWith('.');
    })
    .sort();

if (files.length === 0) {
    console.log('✗ No video files found in ' + videosPath);
    console.log('\nAdd video files (.mp4, .webm, etc.) to: src/assets/videos/');
    console.log('Then run: npm run generate:videos');
    
    // Create a template with example videos
    const template = `// Video Gallery Data
// Add your videos to src/assets/videos/ folder
// Then run: npm run generate:videos

export const videoData = [
    {
        id: 1,
        title: 'Your Video Title 1',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://via.placeholder.com/300x200?text=Video+1'
    },
    {
        id: 2,
        title: 'Your Video Title 2',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://via.placeholder.com/300x200?text=Video+2'
    }
];
`;
    
    if (!fs.existsSync('src/data/videoData.js')) {
        fs.writeFileSync('src/data/videoData.js', template);
    }
    process.exit(0);
}

// Generate imports and array
files.forEach((file, index) => {
    const varName = `video${id}`;
    const relativePath = `../assets/videos/${file}`;
    const fileName = path.parse(file).name;
    const displayTitle = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    
    // Generate thumbnail import (must exist)
    const thumbnailName = `${fileName}.jpg`;
    const thumbVarName = `thumb${id}`;
    const thumbnailRelativePath = `../assets/videos/thumbnails/${thumbnailName}`;
    
    imports += `import ${varName} from '${relativePath}';\n`;
    imports += `import ${thumbVarName} from '${thumbnailRelativePath}';\n`;
    videoArray += `    { id: ${id}, title: '${displayTitle}', videoUrl: ${varName}, thumbnail: ${thumbVarName} },\n`;
    
    id++;
    totalVideos++;
});

const content = `${imports}
export const videoData = [
${videoArray}];
`;

fs.writeFileSync('src/data/videoData.js', content);
console.log(`✓ Video data generated successfully!`);
console.log(`✓ Total videos: ${totalVideos}`);
console.log('\nVideo files imported:');
files.forEach(file => console.log(`  - ${file}`));
console.log('\nTo add more videos:');
console.log(`  1. Place video files in: src/assets/videos/`);
console.log(`  2. Add thumbnails (optional) to: src/assets/videos/thumbnails/`);
console.log(`  3. Run: npm run generate:videos`);
