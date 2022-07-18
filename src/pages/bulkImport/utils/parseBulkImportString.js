export default function parseBulkImportString(bulkImportString) {
  const phrasesBetweenCommas = bulkImportString
    .split(',')
    .map(a => a.trim());
  return phrasesBetweenCommas.filter(phrase => phrase !== '');
}
