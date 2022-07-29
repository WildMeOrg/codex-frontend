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
  twitterBotTestResults: 'twitterBotTestResults',
  publicData: 'publicData',
  socialGroups: 'socialGroups',
  sageJobs: ['sage', 'jobs'],
};

export function getAuditLogQueryKey(guid) {
  return ['auditLog', guid];
}

export function getEncounterQueryKey(guid) {
  return ['encounter', guid];
}

export function getSightingQueryKey(guid) {
  return ['sighting', guid];
}

export function getSightingMatchResultsQueryKey(guid) {
  return ['sightingMatchResults', guid];
}

export function getAGSQueryKey(guid) {
  return ['assetGroupSighting', guid];
}

export function getIndividualQueryKey(guid) {
  return ['individual', guid];
}

export function getIndividualMergeRequestQueryKey(guid) {
  return ['individualMergeRequest', guid];
}

export function getMergeConflictsQueryKey(guids) {
  return ['individualMergeConflicts', guids];
}

export function getUserQueryKey(guid) {
  return ['user', guid];
}

export function getUserSightingsQueryKey(guid) {
  return ['userSightings', guid];
}

export function getUserAgsQueryKey(guid) {
  return ['userAgs', guid];
}

export function getAssetGroupQueryKey(guid) {
  return ['assetGroup', guid];
}

export function getNotificationQueryKey(guid) {
  return ['notification', guid];
}

export function getIndividualTermQueryKey(searchTerm) {
  return ['individualQuickSearch', searchTerm];
}

export function getIndividualGuidQueryKey(individualGuids) {
  return ['individualQuickSearch', individualGuids];
}

export function getSightingTermQueryKey(searchTerm) {
  return ['sightingQuickSearch', searchTerm];
}

export function getSocialGroupQueryKey(guid) {
  return ['socialGroup', guid];
}

export function getIndividualFilterQueryKey(
  filters,
  page,
  rowsPerPage,
) {
  return ['individualFilterSearch', filters, page, rowsPerPage];
}

export function getSightingFilterQueryKey(
  filters,
  page,
  rowsPerPage,
) {
  return ['sightingFilterSearch', filters, page, rowsPerPage];
}
