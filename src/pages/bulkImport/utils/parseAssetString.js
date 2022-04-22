export default function parseAssetString(assetString) {
  return assetString.split(',').map(a => a.trim());
}
