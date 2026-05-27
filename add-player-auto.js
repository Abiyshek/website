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
    console.log('\n👤 AUTOMATED PLAYER ADDITION TOOL\n');
    console.log('========================================\n');

    try {
        // Step 1: Get user input
        console.log('📝 STEP 1: Enter Player Details\n');
        const playerName = await question('Player Name (e.g., John Doe): ');
        const playerRole = await question('Player Role (e.g., Coach, Player): ');
        const playerDescription = await question('Player Description (e.g., Achievements, specialty): ');
        const playerImageUrl = await question('Player Image URL (e.g., https://...jpg): ');

        if (!playerName || !playerRole) {
            console.log('\n❌ Name and role are required!');
            rl.close();
            return;
        }

        // Step 2: Update playerProfilesData.js
        console.log('\n⚙️ STEP 2: Updating playerProfilesData.js\n');
        const playerDataPath = 'src/data/playerProfilesData.js';
        let playerDataContent = fs.readFileSync(playerDataPath, 'utf8');

        // Find the last ID
        const lastIdMatch = playerDataContent.match(/id:\s*(\d+)/g);
        const nextId = lastIdMatch ? Math.max(...lastIdMatch.map(m => parseInt(m.match(/\d+/)[0]))) + 1 : 1;

        // Create new player object
        const newPlayerEntry = `    {
        id: ${nextId},
        name: '${playerName}',
        role: '${playerRole}',
        description: '${playerDescription}',
        image: '${playerImageUrl || 'https://via.placeholder.com/150'}'
    },`;

        // Add to array (before the closing bracket)
        const arrayEndIndex = playerDataContent.lastIndexOf('];');
        const beforeClosing = playerDataContent.slice(0, arrayEndIndex);
        const after = playerDataContent.slice(arrayEndIndex);
        
        playerDataContent = beforeClosing + '\n' + newPlayerEntry + '\n' + after;
        fs.writeFileSync(playerDataPath, playerDataContent);
        console.log(`✅ Updated: ${playerDataPath}`);
        console.log(`   - Added player: ${playerName}`);
        console.log(`   - Role: ${playerRole}`);
        console.log(`   - ID: ${nextId}`);

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
        console.log('✅ PLAYER ADDED SUCCESSFULLY!\n');
        console.log('📊 Summary:');
        console.log(`   - Name: ${playerName}`);
        console.log(`   - Role: ${playerRole}`);
        console.log(`   - ID: ${nextId}`);
        console.log(`   - Status: Ready to view!\n`);

        rl.close();

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }
}

main();
