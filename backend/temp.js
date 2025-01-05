// temp.js
const { parseFile } = require('music-metadata');
const { inspect } = require('util');

(async () => {
  try {
    const filePath = 'E:\\Personal Projects\\MusicPlayerWithReact\\backend\\public\\assets\\audio\\AajHumKoAadmiKi-MuqaddarKaFaisla.mp3';
    const metadata = await parseFile(filePath);

    // Output the parsed metadata to the console in a readable format
    console.log(inspect(metadata, { showHidden: false, depth: null }));
  } catch (error) {
    console.error('Error parsing metadata:', error.message);
  }
})();
