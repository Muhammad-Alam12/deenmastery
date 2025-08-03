import fs from 'fs';
import path from 'path';

// Load the rename mapping
const renameMap = JSON.parse(fs.readFileSync('./file_rename_map.json', 'utf8'));

console.log('Starting file renaming process...');

// 1. Rename EPUB files
const epubDir = './epubs/english/nonRAG_outputs';
let renamedCount = 0;

for (const [oldName, newName] of Object.entries(renameMap)) {
    const oldPath = path.join(epubDir, oldName);
    const newPath = path.join(epubDir, newName);
    
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✓ Renamed: ${oldName} -> ${newName}`);
        renamedCount++;
    } else {
        console.log(`⚠ File not found: ${oldName}`);
    }
}

console.log(`\nRenamed ${renamedCount} EPUB files`);

// 2. Update manifest.json
console.log('\nUpdating manifest.json...');
const manifestPath = './epubs/english/nonRAG_outputs/manifest.json';

if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    let updatedCount = 0;
    
    // Update filename_ar entries
    for (let book of manifest) {
        if (book.filename_ar && renameMap[book.filename_ar]) {
            console.log(`Updating manifest: ${book.filename_ar} -> ${renameMap[book.filename_ar]}`);
            book.filename_ar = renameMap[book.filename_ar];
            updatedCount++;
        }
    }
    
    // Save updated manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✓ Updated ${updatedCount} entries in manifest.json`);
} else {
    console.log('⚠ manifest.json not found');
}

// 3. Rename corresponding word-by-word JSON files
console.log('\nRenaming word-by-word JSON files...');
const wordByWordDir = './epubs/english/word_by_word';
let jsonRenamedCount = 0;

if (fs.existsSync(wordByWordDir)) {
    for (const [oldName, newName] of Object.entries(renameMap)) {
        const oldJsonName = oldName.replace('.epub', '.json');
        const newJsonName = newName.replace('.epub', '.json');
        const oldJsonPath = path.join(wordByWordDir, oldJsonName);
        const newJsonPath = path.join(wordByWordDir, newJsonName);
        
        if (fs.existsSync(oldJsonPath)) {
            fs.renameSync(oldJsonPath, newJsonPath);
            console.log(`✓ Renamed JSON: ${oldJsonName} -> ${newJsonName}`);
            jsonRenamedCount++;
        }
    }
    console.log(`✓ Renamed ${jsonRenamedCount} word-by-word JSON files`);
} else {
    console.log('⚠ word_by_word directory not found');
}

console.log('\n🎉 Renaming process completed!');
console.log(`Summary:`);
console.log(`- EPUB files renamed: ${renamedCount}`);
console.log(`- Manifest entries updated: ${updatedCount || 0}`);
console.log(`- JSON files renamed: ${jsonRenamedCount}`);