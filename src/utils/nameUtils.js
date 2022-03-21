export function deriveIndividualName(
  individualData,
  context = 'defaultName',
  fallback,
) {
  const names = individualData?.names || [];
  const nameObject = names.find(n => n?.context === context) || {};
  return nameObject?.value || fallback;
}
