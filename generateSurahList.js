const fs = require('fs');
const path = require('path');

const surahDir = path.join(__dirname, 'data/quran/surah');
const outputFile = path.join(__dirname, 'data/quran/surahList.json');

const surahList = [];

fs.readdir(surahDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const content = fs.readFileSync(path.join(surahDir, file), 'utf8');
      const data = JSON.parse(content);
      const surahKey = Object.keys(data)[0];
      const surah = data[surahKey];
      surahList.push({
        number: surah.number,
        name: surah.name,
        name_latin: surah.name_latin,
        number_of_ayah: surah.number_of_ayah
      });
    }
  });

  surahList.sort((a, b) => a.number - b.number);

  fs.writeFileSync(outputFile, JSON.stringify(surahList, null, 2));
  console.log('surahList.json generated successfully!');
});
