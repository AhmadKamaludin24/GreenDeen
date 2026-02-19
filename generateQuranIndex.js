const fs = require('fs');
const path = require('path');

const surahDir = path.join(__dirname, 'data/quran/surah');
const outputFile = path.join(__dirname, 'data/quran/index.js');

let imports = 'const quranData = {\n';

fs.readdir(surahDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Sort files numerically if possible or just rely on loop
    // Filenames are 1.json, 2.json etc.
    // We want: 1: require('./surah/1.json'),

    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const num = parseInt(path.basename(file, '.json'));
            if (!isNaN(num)) {
                imports += `  "${num}": require("./surah/${file}"),\n`;
            }
        }
    });

    imports += '};\n\nexport default quranData;';

    fs.writeFileSync(outputFile, imports);
    console.log('data/quran/index.js generated successfully!');
});
