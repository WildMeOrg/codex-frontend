export default {
  me: 'me',
  settingsConfig: 'settingsConfig',
  settingsSchema: 'settingsSchema',
  users: 'users',
  collaborations: 'collaborations',
};

export function getAuditLogQueryKey(id) {
  return ['auditLog', id];
}
