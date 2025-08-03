import fs from 'fs';
import path from 'path';

// Function to create short names while preserving meaning
function createShortName(longName, index) {
    // Extract key words from Arabic filename
    const baseName = longName.replace('.epub', '');
    const parts = baseName.split('-');
    
    // Create abbreviated version
    let shortName = '';
    if (parts.length > 3) {
        // Take first 2-3 meaningful parts and add index
        shortName = parts.slice(0, 2).join('-') + `-${index}`;
    } else {
        shortName = parts.join('-').substring(0, 50) + `-${index}`;
    }
    
    return shortName.replace(/[^a-zA-Z0-9\u0600-\u06FF-_]/g, '-') + '.epub';
}

// Get all problematic files
const epubDir = './epubs/english/nonRAG_outputs';
const files = fs.readdirSync(epubDir).filter(f => f.endsWith('.epub') && f.length > 100);

console.log(`Found ${files.length} files with long names`);

// Create renaming map
const renameMap = {};
files.forEach((longName, index) => {
    const shortName = createShortName(longName, index + 1);
    renameMap[longName] = shortName;
    console.log(`${longName} -> ${shortName}`);
});

// Save the mapping for reference
fs.writeFileSync('./file_rename_map.json', JSON.stringify(renameMap, null, 2));

console.log('Rename mapping saved to file_rename_map.json');