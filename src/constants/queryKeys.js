export default {
  me: 'me',
  settingsConfig: 'settingsConfig',
  settingsSchema: 'settingsSchema',
  users: 'users',
  collaborations: 'collaborations',
  assetGroupSightings: 'assetGroupSightings',
};

export function getAuditLogQueryKey(id) {
  return ['auditLog', id];
}

export function getSightingQueryKey(id) {
  return ['sighting', id];
}

export function getAGSQueryKey(id) {
  return ['assetGroupSighting', id];
}

export function getIndividualQueryKey(id) {
  return ['individual', id];
}
