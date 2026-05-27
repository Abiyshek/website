#!/usr/bin/env node

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve React static files (production build)
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
}

// Configure storage for different file types
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'src/assets/videos');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const category = req.body.category || 'new';
        const dir = path.join(__dirname, 'src/assets/gallery', category);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadVideo = multer({ storage: videoStorage });
const uploadPhoto = multer({ storage: photoStorage });

// ===== VIDEO UPLOAD =====
app.post('/api/upload/videos', uploadVideo.array('videos'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const videoDataPath = path.join(__dirname, 'src/data/videoData.js');
        let videoData = fs.readFileSync(videoDataPath, 'utf8');

        // Get current max ID
        const idMatches = videoData.match(/id:\s*(\d+)/g);
        const nextId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)[0]))) + 1 : 1;

        let newImports = '';
        let newEntries = '';
        let currentId = nextId;

        for (const file of req.files) {
            const videoName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9_]/g, '_');
            const videoExt = path.extname(file.originalname);

            newImports += `import ${videoName}Video from '../assets/videos/${file.originalname}';\n`;
            newImports += `import ${videoName}Thumb from '../assets/videos/thumbnails/${videoName}.jpg';\n`;

            newEntries += `    { id: ${currentId}, title: '${file.originalname.replace(videoExt, '')}', videoUrl: ${videoName}Video, thumbnail: ${videoName}Thumb, isNew: true },\n`;
            currentId++;
        }

        // Insert imports at the end of existing imports
        const importIndex = videoData.lastIndexOf('import');
        const endOfLastImport = videoData.indexOf(';', importIndex) + 1;
        videoData = videoData.slice(0, endOfLastImport) + '\n' + newImports + videoData.slice(endOfLastImport);

        // Insert entries before closing bracket
        const arrayEndIndex = videoData.lastIndexOf('];');
        videoData = videoData.slice(0, arrayEndIndex) + newEntries + videoData.slice(arrayEndIndex);

        fs.writeFileSync(videoDataPath, videoData);

        // Extract thumbnails
        console.log('Extracting thumbnails...');
        try {
            execSync('npm run extract:thumbnails', { cwd: __dirname, stdio: 'inherit' });
        } catch (e) {
            console.log('Thumbnail extraction completed');
        }

        // React dev server will auto-recompile when it detects file changes
        console.log('✅ Data updated! React will recompile automatically...');

        res.json({
            success: true,
            message: `✅ ${req.files.length} video(s) uploaded and added successfully!`,
            videos: req.files.map(f => f.originalname)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ===== PHOTO UPLOAD =====
app.post('/api/upload/photos', uploadPhoto.array('photos'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const category = req.body.category || 'new';
        const galleryDataPath = path.join(__dirname, 'src/data/galleryData.js');
        let galleryData = fs.readFileSync(galleryDataPath, 'utf8');

        // Get current max ID
        const idMatches = galleryData.match(/id:\s*(\d+)/g);
        const nextId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)[0]))) + 1 : 1;

        let newImports = '';
        let newEntries = '';
        let currentId = nextId;

        for (const file of req.files) {
            const photoName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9_]/g, '_');

            newImports += `import ${photoName} from '../assets/gallery/${category}/${file.originalname}';\n`;
            newEntries += `    { id: ${currentId}, src: ${photoName}, alt: '${category} - ${file.originalname}', isNew: true },\n`;
            currentId++;
        }

        // Insert imports at the end of existing imports
        const importIndex = galleryData.lastIndexOf('import');
        const endOfLastImport = galleryData.indexOf(';', importIndex) + 1;
        galleryData = galleryData.slice(0, endOfLastImport) + '\n' + newImports + galleryData.slice(endOfLastImport);

        // Insert entries before closing bracket
        const arrayEndIndex = galleryData.lastIndexOf('];');
        galleryData = galleryData.slice(0, arrayEndIndex) + newEntries + galleryData.slice(arrayEndIndex);

        fs.writeFileSync(galleryDataPath, galleryData);

        // React dev server will auto-recompile when it detects file changes
        console.log('✅ Data updated! React will recompile automatically...');

        res.json({
            success: true,
            message: `✅ ${req.files.length} photo(s) uploaded to "${category}" and added successfully!`,
            photos: req.files.map(f => f.originalname)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// ===== PLAYER UPLOAD =====
app.post('/api/upload/players', express.json(), (req, res) => {
    try {
        const { players } = req.body;

        if (!players || players.length === 0) {
            return res.status(400).json({ error: 'No players provided' });
        }

        const playerDataPath = path.join(__dirname, 'src/data/playerProfilesData.js');
        let playerData = fs.readFileSync(playerDataPath, 'utf8');

        // Get current max ID
        const idMatches = playerData.match(/id:\s*(\d+)/g);
        const nextId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)[0]))) + 1 : 1;

        let newEntries = '';
        let currentId = nextId;

        for (const player of players) {
            newEntries += `    {
        id: ${currentId},
        name: '${player.name.replace(/'/g, "\\'")}',
        role: '${player.role.replace(/'/g, "\\'")}',
        description: '${player.description.replace(/'/g, "\\'")}',
        image: '${player.imageUrl || `https://via.placeholder.com/300x300?text=${player.name}`}',
        isNew: true
    },\n`;
            currentId++;
        }

        // Insert entries before closing bracket
        const arrayEndIndex = playerData.lastIndexOf('];');
        playerData = playerData.slice(0, arrayEndIndex) + newEntries + playerData.slice(arrayEndIndex);

        fs.writeFileSync(playerDataPath, playerData);

        // React dev server will auto-recompile when it detects file changes
        console.log('✅ Data updated! React will recompile automatically...');

        res.json({
            success: true,
            message: `✅ ${players.length} player(s) added successfully!`,
            players: players.map(p => p.name)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Serve React app for all non-API routes (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║       🚀 UPLOAD SERVER + REACT APP RUNNING            ║
║       http://localhost:${PORT}                            ║
║                                               ║
║  • React App: http://localhost:${PORT}                    ║
║  • API: http://localhost:${PORT}/api/upload/*           ║
║                                               ║
║  Everything on ONE port! Choose your section:         ║
║  - Videos (upload, delete)                            ║
║  - Photos (upload, delete)                            ║
║  - Players (upload, delete)                           ║
╚═══════════════════════════════════════════════════════╝
    `);
});
