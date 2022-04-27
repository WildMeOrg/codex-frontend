export default function parseAssetString(assetString) {
  const phrasesBetweenCommas = assetString
    .split(',')
    .map(a => a.trim());
  return phrasesBetweenCommas.filter(phrase => phrase !== '');
}
