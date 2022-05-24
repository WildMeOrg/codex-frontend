export const notificationTypeNames = {
  collaboration_manager_create: 'collaboration_manager_create',
  collaboration_request: 'collaboration_request',
  collaboration_approved: 'collaboration_approved',
  collaboration_revoke: 'collaboration_revoke',
  collaboration_edit_request: 'collaboration_edit_request',
  collaboration_edit_approved: 'collaboration_edit_approved',
  collaboration_edit_revoke: 'collaboration_edit_revoke',
  collaboration_manager_revoke: 'collaboration_manager_revoke',
  individual_merge_request: 'individual_merge_request',
  individual_merge_complete: 'individual_merge_complete',
  individual_merge_blocked: 'individual_merge_blocked',
};

const notificationSchemaPlaceholder = {};
notificationSchemaPlaceholder[
  notificationTypeNames.collaboration_manager_create
] = {
  titleId: 'COLLABORATION_ESTABLISHED_BY_USER_MANAGER',
  notificationMessage: 'A_COLLABORATION_WAS_CREATED_ON_YOUR_BEHALF',
  moreDetailedDescription:
    'A_COLLABORATION_WAS_CREATED_ON_YOUR_BEHALF_MORE_DETAILED',
  showNotificationDialog: false,
  buttonPath: '/#collab-card',
};
notificationSchemaPlaceholder[
  notificationTypeNames.collaboration_request
] = {
  titleId: 'COLLABORATION_REQUEST',
  notificationMessage: 'COLLABORATION_VIEW_REQUEST_BRIEF',
  moreDetailedDescription: 'COLLABORATION_VIEW_REQUEST_DESCRIPTION',
  showNotificationDialog: true,
  path: '/view_permission',
};
notificationSchemaPlaceholder[
  notificationTypeNames.collaboration_approved
] = {
  titleId: 'COLLABORATION_APPROVED_TITLE',
  notificationMessage: 'COLLABORATION_APPROVED',
  moreDetailedDescription: 'COLLABORATION_APPROVED',
  showNotificationDialog: false,
  path: '/view_permission',
  buttonPath: '/#collab-card',
};
notificationSchemaPlaceholder[
  notificationTypeNames.collaboration_revoke
] = {
  titleId: 'COLLABORATION_REVOKE_TITLE',
  notificationMessage: 'COLLABORATION_REVOKE_BRIEF',
  moreDetailedDescription: 'COLLABORATION_REVOKE_BRIEF',
  showNotificationDialog: false,
  buttonPath: '/#collab-card',
};
notificationSchemaPlaceholder[
  notificationTypeNames.collaboration_edit_request
] = {
  titleId: 'COLLABORATION_EDIT_REQUEST_TITLE',
  notificationMessage: 'COLLABORATION_EDIT_REQUEST_BRIEF',
  moreDetailedDescription: 'COLLABORATION_EDIT_REQUEST_DESCRIPTION',
  showNotificationDialog: true,
  path: '/edit_permission',
};
notificationSchemaPlaceholder[
  notificationTypeNames.collaboration_edit_approved
] = {
  titleId: 'COLLABORATION_EDIT_APPROVED_TITLE',
  notificationMessage: 'EDIT_COLLABORATION_APPROVED',
  moreDetailedDescription: 'EDIT_COLLABORATION_APPROVED',
  showNotificationDialog: false,
  path: '/edit_permission',
  buttonPath: '/#collab-card',
};
notificationSchemaPlaceholder[
  notificationTypeNames.collaboration_edit_revoke
] = {
  titleId: 'COLLABORATION_EDIT_REVOKE_TITLE',
  notificationMessage: 'EDIT_COLLABORATION_REVOKED',
  moreDetailedDescription: 'EDIT_COLLABORATION_REVOKED',
  showNotificationDialog: false,
  buttonPath: '/#collab-card',
};
notificationSchemaPlaceholder[
  notificationTypeNames.collaboration_manager_revoke
] = {
  titleId: 'COLLABORATION_MANAGER_REVOKE_TITLE',
  notificationMessage: 'COLLABORATION_REVOKED_BY_MANAGER',
  moreDetailedDescription: 'COLLABORATION_REVOKED_BY_MANAGER',
  showNotificationDialog: false,
  buttonPath: '/#collab-card',
};
notificationSchemaPlaceholder[
  notificationTypeNames.individual_merge_request
] = {
  titleId: 'INDIVIDUAL_MERGE_REQUEST_TITLE',
  notificationMessage: 'INDIVIDUAL_MERGE_REQUEST_MESSAGE',
  moreDetailedDescription:
    'INDIVIDUAL_MERGE_REQUEST_MESSAGE_DETAILED',
  showNotificationDialog: true,
};
notificationSchemaPlaceholder[
  notificationTypeNames.individual_merge_complete
] = {
  titleId: 'INDIVIDUAL_MERGE_COMPLETE_TITLE',
  notificationMessage: 'INDIVIDUALS_MERGE_COMPLETE_MESSAGE',
  moreDetailedDescription: 'INDIVIDUALS_MERGE_COMPLETE_MESSAGE',
  showNotificationDialog: false,
  deriveButtonPath: individualId => `/individuals/${individualId}`,
};
notificationSchemaPlaceholder[
  notificationTypeNames.individual_merge_blocked
] = {
  titleId: 'INDIVIDUAL_MERGE_BLOCKED_TITLE',
  notificationMessage: 'INDIVIDUAL_MERGE_BLOCKED_MESSAGE',
  moreDetailedDescription:
    'INDIVIDUAL_MERGE_BLOCKED_DETAILED_MESSAGE',
  showNotificationDialog: false,
  deriveButtonPath: individualId => `/individuals/${individualId}`,
};
export const notificationSchema = notificationSchemaPlaceholder;
