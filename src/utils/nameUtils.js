function getNameObject(individualData, context) {
  const names = individualData?.names || [];
  return names.find(n => n?.context === context) || {};
}

export function deriveIndividualName(
  individualData,
  context = 'defaultName',
  fallback = undefined,
) {
  const nameObject = getNameObject(individualData, context);
  return nameObject?.value || fallback;
}

export function deriveIndividualNameGuid(
  individualData,
  context = 'defaultName',
) {
  const nameObject = getNameObject(individualData, context);
  return nameObject?.guid;
}
