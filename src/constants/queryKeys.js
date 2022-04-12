export default {
  me: 'me',
  settingsConfig: 'settingsConfig',
  settingsSchema: 'settingsSchema',
  siteInfo: 'siteInfo',
  detectionConfig: 'detectionConfig',
  keywords: 'keywords',
  users: 'users',
  collaborations: 'collaborations',
  assetGroupSightings: 'assetGroupSightings',
  allNotifications: 'allNotifications',
  unreadNotifications: 'unreadNotifications',
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

export function getMergeConflictsQueryKey(ids) {
  return ['individualMergeConflicts', ids];
}

export function getUserQueryKey(id) {
  return ['user', id];
}

export function getUserSightingsQueryKey(id) {
  return ['userSightings', id];
}

export function getUserAgsQueryKey(id) {
  return ['userAgs', id];
}

export function getAssetGroupQueryKey(id) {
  return ['assetGroup', id];
}

export function getNotificationQueryKey(id) {
  return ['notification', id];
}

export function getIndividualTermQueryKey(searchTerm) {
  return ['individualSearch', searchTerm];
}

export function getSightingTermQueryKey(searchTerm) {
  return ['sightingSearch', searchTerm];
}
