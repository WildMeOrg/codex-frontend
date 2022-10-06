const { find } = require('find-in-files');
const englishTranslations = require('../locale/en.json');

const translationKeys = Object.keys(englishTranslations);
let unusedCount = 0;

function getLinesWithMatch(lines, substring) {
  return lines.filter(line => line.includes(substring));
}

async function printUnusedKeys() {
  /* eslint-disable */
  for await (const translationKey of translationKeys) {
    const results = await find(translationKey, './src');
    const matches = Object.values(results);
    const trueMatches = matches.filter(match => {
      const matchingLines = match?.line || [];
      const linesWithSingleQuoteMatch = getLinesWithMatch(
        matchingLines,
        `"${translationKey}"`,
      );
      const linesWithDoubleQuoteMatch = getLinesWithMatch(
        matchingLines,
        `\'${translationKey}\'`,
      );
      return (
        linesWithSingleQuoteMatch.length > 0 ||
        linesWithDoubleQuoteMatch.length > 0
      );
    });
    if (trueMatches.length === 0) {
      unusedCount += 1;
      console.log(`"${translationKey}" may be unused.`);
    }
  }
  /* eslint-enable */
  console.log(
    `Script finished. ${unusedCount} potentially unused translation keys found.`,
  );
}

console.log(
  'FYI, this script takes forever to run! Recommendation is to leave it running overnight or in the background.',
);
printUnusedKeys();
