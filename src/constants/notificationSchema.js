export const notificationSchema = {
  collaboration_manager_create: {
    titleId: 'COLLABORATION_ESTABLISHED_BY_USER_MANAGER',
    notificationMessage: 'A_COLLABORATION_WAS_CREATED_ON_YOUR_BEHALF',
    moreDetailedDescription:
      'A_COLLABORATION_WAS_CREATED_ON_YOUR_BEHALF_MORE_DETAILED',
    availableButtons: ['view'],
  },
  collaboration_request: {
    titleId: 'COLLABORATION_REQUEST',
    notificationMessage: 'COLLABORATION_VIEW_REQUEST_BRIEF',
    moreDetailedDescription: 'COLLABORATION_VIEW_REQUEST_DESCRIPTION',
    availableButtons: ['grant', 'decline', 'view'],
    path: '/view_permission',
  },
  collaboration_approved: {
    titleId: 'COLLABORATION_APPROVED_TITLE',
    notificationMessage: 'COLLABORATION_APPROVED',
    moreDetailedDescription: 'COLLABORATION_APPROVED',
    availableButtons: ['revoke'],
  },
  collaboration_revoke: {
    titleId: 'COLLABORATION_REVOKE_TITLE',
    notificationMessage: 'COLLABORATION_REVOKE_BRIEF',
    moreDetailedDescription: 'COLLABORATION_REVOKE_BRIEF',
    availableButtons: [],
  },
  collaboration_edit_request: {
    titleId: 'COLLABORATION_EDIT_REQUEST_TITLE',
    notificationMessage: 'COLLABORATION_EDIT_REQUEST_BRIEF',
    moreDetailedDescription: 'COLLABORATION_EDIT_REQUEST_DESCRIPTION',
    availableButtons: ['grant', 'decline', 'view'],
    path: '/edit_permission',
  },
  collaboration_edit_approved: {
    titleId: 'COLLABORATION_EDIT_APPROVED_TITLE',
    notificationMessage: 'EDIT_COLLABORATION_APPROVED',
    moreDetailedDescription: 'EDIT_COLLABORATION_APPROVED',
    availableButtons: ['revoke'],
  },
  collaboration_edit_revoke: {
    titleId: 'COLLABORATION_EDIT_REVOKE_TITLE',
    notificationMessage: 'EDIT_COLLABORATION_REVOKED',
    moreDetailedDescription: 'EDIT_COLLABORATION_REVOKED',
    availableButtons: ['request'],
  },
  collaboration_manager_revoke: {
    titleId: 'COLLABORATION_MANAGER_REVOKE_TITLE',
    notificationMessage: 'COLLABORATION_REVOKED_BY_MANAGER',
    moreDetailedDescription: 'COLLABORATION_REVOKED_BY_MANAGER',
    availableButtons: ['request'],
  },
  individual_merge_request: {
    titleId: 'INDIVIDUAL_MERGE_REQUEST_TITLE',
    notificationMessage: 'INDIVIDUAL_MERGE_REQUEST_MESSAGE',
    moreDetailedDescription: 'INDIVIDUAL_MERGE_REQUEST_MESSAGE',
    availableButtons: [],
    path: 'TODO',
  },
  individual_merge_complete: {
    titleId: 'INDIVIDUAL_MERGE_COMPLETE_TITLE',
    notificationMessage: 'INDIVIDUALS_MERGE_COMPLETE_MESSAGE',
    moreDetailedDescription: 'INDIVIDUALS_MERGE_COMPLETE_MESSAGE',
    availableButtons: [],
  },
};
