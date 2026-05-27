const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const galleryPath = 'src/assets/gallery';

async function renameAndConvertAllFiles() {
    try {
        // Get all subdirectories
        const folders = fs.readdirSync(galleryPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        console.log(`Found ${folders.length} folders to process\n`);

        for (const folder of folders) {
            const folderPath = path.join(galleryPath, folder);
            const files = fs.readdirSync(folderPath);

            // Step 1: Rename files with .XXZ extensions to .png
            console.log(`\n=== Processing folder: ${folder} ===`);
            console.log(`Renaming files...`);

            for (const file of files) {
                // Check if file has numeric extension like .294Z, .614Z, etc
                const match = file.match(/\.(\d+)Z$/i);
                if (match) {
                    const oldPath = path.join(folderPath, file);
                    const newFileName = file.replace(/\.\d+Z$/i, '.png');
                    const newPath = path.join(folderPath, newFileName);
                    
                    try {
                        fs.renameSync(oldPath, newPath);
                        console.log(`  ✓ Renamed: ${file} -> ${newFileName}`);
                    } catch (err) {
                        console.error(`  ✗ Error renaming ${file}: ${err.message}`);
                    }
                }
            }

            // Step 2: Convert PNG files to JPG
            console.log(`\nConverting PNG to JPG...`);
            const updatedFiles = fs.readdirSync(folderPath);
            const pngFiles = updatedFiles.filter(file => file.toLowerCase().endsWith('.png'));

            if (pngFiles.length === 0) {
                console.log(`  No PNG files to convert in ${folder}`);
                continue;
            }

            console.log(`  Found ${pngFiles.length} PNG files`);

            for (const file of pngFiles) {
                const filePath = path.join(folderPath, file);
                const jpgFileName = file.replace(/\.png$/i, '.jpg');
                const jpgFilePath = path.join(folderPath, jpgFileName);

                try {
                    await sharp(filePath)
                        .jpeg({ quality: 85 })
                        .toFile(jpgFilePath);

                    // Delete original PNG file
                    fs.unlinkSync(filePath);
                    console.log(`  ✓ Converted: ${file} -> ${jpgFileName}`);
                } catch (err) {
                    console.error(`  ✗ Error converting ${file}: ${err.message}`);
                }
            }
        }

        console.log('\n✓ All files successfully renamed and converted to JPG!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

renameAndConvertAllFiles();
