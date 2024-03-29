function getNameObject(individualData, context) {
  const names = individualData?.names || [];
  return names.find(n => n?.context === context) || {};
}


export function deriveIndividualName(
  individualData,
  context = 'FirstName',
  fallback = undefined,
) {
  const nameObject = getNameObject(individualData, context);
  return nameObject?.value || fallback;
}

export function deriveIndividualNameGuid(
  individualData,
  context = 'FirstName',
) {
  const nameObject = getNameObject(individualData, context);
  return nameObject?.guid;
}


export function deriveIndividualAutogenNameObject(
  individualData,
) {
  const names = individualData?.names || [];
  const nameObject = names.find(n => n?.autogeneratedName) || {};
  return nameObject;
}

export function deriveConflictIndividualAutogenNames(individuals) {
  return Object.values(individuals)
               .map(data => data.names)
               .map(data => data.find(name => name.autogeneratedName));
} 
