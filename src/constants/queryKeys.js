export default {
  me: 'me',
  settingsConfig: 'settingsConfig',
  settingsSchema: 'settingsSchema',
  users: 'users',
};

export function getAuditLogQueryKey(id) {
  return ['auditLog', id];
}
