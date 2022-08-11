const { find } = require('find-in-files');
const englishTranslations = require('../locale/en.json');

const translationKeys = Object.keys(englishTranslations);
let count = 0;

async function printUnusedKeys() {
  /* eslint-disable */
  for await (const translationKey of translationKeys) {
    const results = await find(`"${translationKey}"`, './src');
    const matchingFiles = Object.keys(results);
    if (matchingFiles.length === 0) {
      count += 1;
      console.log(`"${translationKey}" may be unused.`);
    }
  }
  /* eslint-enable */
}

console.log(
  'FYI, this script takes forever to run! Recommendation is to leave it running overnight or in the background.',
);
printUnusedKeys();
console.log(
  `Script finished. ${count} potentially unused translation keys found.`,
);
