const fs = require('fs');
const path = require('path');

const galleryPath = 'src/assets/gallery';
const folders = [
    'Aaradhana', 'Amala', 'Anbuchelvi', 'Arunesh', 'Coach', 'Dhivyesh',
    'Group photo', 'Jenifer', 'Kanmani', 'Lasa honoring functions',
    'Lasa state rankings', 'Mithun', 'Ruhaan', 'Samanatha'
];

let imports = '';
let galleryArray = '';
let id = 1;

folders.forEach(folder => {
    const folderPath = path.join(galleryPath, folder);
    
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath)
            .filter(file => file.toLowerCase().endsWith('.jpg'))
            .sort();
        
        files.forEach((file, index) => {
            const varName = `photo${id}`;
            const relativePath = `../assets/gallery/${folder}/${file}`;
            
            imports += `import ${varName} from '${relativePath}';\n`;
            galleryArray += `    { id: ${id}, src: ${varName}, alt: '${folder} Photo ${index + 1}' },\n`;
            id++;
        });
    }
});

const content = `${imports}
export const galleryData = [
${galleryArray}];
`;

fs.writeFileSync('src/data/galleryData.js', content);
console.log(`✓ Gallery data generated with ${id - 1} photos!`);
console.log(`Total photos: ${id - 1}`);
