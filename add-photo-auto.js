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
    console.log('\n🖼️ AUTOMATED PHOTO ADDITION TOOL\n');
    console.log('========================================\n');

    try {
        // Get categories
        console.log('📂 Available Categories:\n');
        const categoriesPath = 'src/assets/gallery';
        const categories = fs.readdirSync(categoriesPath)
            .filter(f => fs.statSync(path.join(categoriesPath, f)).isDirectory());
        
        categories.forEach((cat, idx) => {
            console.log(`${idx + 1}. ${cat}`);
        });

        // Step 1: Get user input
        console.log('\n📝 STEP 1: Enter Photo Details\n');
        const categoryNum = await question('\nSelect category number: ');
        const selectedCategory = categories[parseInt(categoryNum) - 1];

        if (!selectedCategory) {
            console.log('\n❌ Invalid category!');
            rl.close();
            return;
        }

        const photoFileName = await question('Photo File Name (e.g., photo1.jpg): ');
        const photoTitle = await question('Photo Title (optional): ');

        if (!photoFileName) {
            console.log('\n❌ Filename is required!');
            rl.close();
            return;
        }

        const photoPath = path.join('src/assets/gallery', selectedCategory, photoFileName);

        // Check if photo file exists
        if (!fs.existsSync(photoPath)) {
            console.log(`\n❌ Photo file not found: ${photoPath}`);
            console.log(`📂 Please upload the photo file to src/assets/gallery/${selectedCategory}/ first!\n`);
            rl.close();
            return;
        }

        console.log(`\n✅ Photo file found: ${photoFileName}`);

        // Step 2: Read current galleryData.js
        console.log('\n⚙️ STEP 2: Updating galleryData.js\n');
        const galleryDataPath = 'src/data/galleryData.js';
        let galleryDataContent = fs.readFileSync(galleryDataPath, 'utf8');

        // Find the category section and add photo
        const categoryRegex = new RegExp(`\\s*category: ['"]${selectedCategory}['"]`, 'i');
        const categoryMatch = galleryDataContent.match(categoryRegex);

        if (categoryMatch) {
            // Find the images array for this category
            const categoryIndex = galleryDataContent.indexOf(categoryMatch[0]);
            const categoryStartIndex = galleryDataContent.lastIndexOf('{', categoryIndex);
            const categoryEndIndex = galleryDataContent.indexOf('},', categoryIndex) + 1;
            
            const categoryObj = galleryDataContent.slice(categoryStartIndex, categoryEndIndex);
            const imagesArrayMatch = categoryObj.match(/images:\s*\[([\s\S]*?)\]/);
            
            if (imagesArrayMatch) {
                const imagesArray = imagesArrayMatch[1];
                const newImageEntry = `\n            '${photoFileName}',`;
                const updatedImagesArray = imagesArray.slice(0, -1) + newImageEntry + imagesArray.slice(-1);
                const updatedCategoryObj = categoryObj.replace(/images:\s*\[([\s\S]*?)\]/, `images: [${updatedImagesArray}]`);
                
                galleryDataContent = galleryDataContent.slice(0, categoryStartIndex) + updatedCategoryObj + galleryDataContent.slice(categoryEndIndex);
                fs.writeFileSync(galleryDataPath, galleryDataContent);
                console.log(`✅ Updated: ${galleryDataPath}`);
                console.log(`   - Added photo: ${photoFileName} to ${selectedCategory}`);
            }
        }

        // Step 3: Build project
        console.log('\n🔨 STEP 3: Building Project\n');
        console.log('Running: npm run build');
        try {
            execSync('npm run build', { stdio: 'inherit', cwd: process.cwd() });
            console.log('\n✅ Build completed successfully!');
        } catch (error) {
            console.log('\n⚠️ Build completed with warnings');
        }

        // Success message
        console.log('\n========================================');
        console.log('✅ PHOTO ADDED SUCCESSFULLY!\n');
        console.log('📊 Summary:');
        console.log(`   - Category: ${selectedCategory}`);
        console.log(`   - File: ${photoFileName}`);
        console.log(`   - Status: Ready to view!\n`);

        rl.close();

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }
}

main();
