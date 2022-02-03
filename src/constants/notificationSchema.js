export const notificationSchema = {
  collaboration_manager_create: {
    notificationMessage: 'A_COLLABORATION_WAS_CREATED_ON_YOUR_BEHALF',
    moreDetailedDescription:
      'A_COLLABORATION_WAS_CREATED_ON_YOUR_BEHALF',
    availableButtons: ['revoke'],
  },
  collaboration_request: {
    notificationMessage: 'COLLABORATION_VIEW_REQUEST_BRIEF',
    moreDetailedDescription:
      'COLLABORATION_VIEW_REQUEST_moreDetailedDescription',
    availableButtons: ['grant', 'decline'],
  },
  collaboration_approved: {
    notificationMessage: 'COLLABORATION_APPROVED',
    moreDetailedDescription: 'COLLABORATION_APPROVED',
    availableButtons: ['revoke'],
  },
  collaboration_revoke: {
    notificationMessage: 'COLLABORATION_REVOKE_BRIEF',
    moreDetailedDescription: 'COLLABORATION_REVOKE_BRIEF',
    availableButtons: [],
  },
  collaboration_edit_request: {
    notificationMessage: 'COLLABORATION_EDIT_REQUEST_BRIEF',
    moreDetailedDescription:
      'COLLABORATION_EDIT_REQUEST_moreDetailedDescription',
    availableButtons: ['approve', 'decline'],
  },
  collaboration_edit_approved: {
    notificationMessage: 'EDIT_COLLABORATION_APPROVED',
    moreDetailedDescription: 'EDIT_COLLABORATION_APPROVED',
    availableButtons: ['revoke'],
  },
  collaboration_edit_revoke: {
    notificationMessage: 'EDIT_COLLABORATION_REVOKED',
    moreDetailedDescription: 'EDIT_COLLABORATION_REVOKED',
    availableButtons: ['request'],
  },
  collaboration_manager_revoke: {
    notificationMessage: 'COLLABORATION_REVOKED_BY_MANAGER',
    moreDetailedDescription: 'COLLABORATION_REVOKED_BY_MANAGER',
    availableButtons: ['request'],
  },
  individual_merge_request: {
    notificationMessage:
      'INDIVIDUAL_MERGE_REQUEST_notificationMessage',
    moreDetailedDescription:
      'INDIVIDUAL_MERGE_REQUEST_notificationMessage',
    availableButtons: ['view'],
  },
  individual_merge_complete: {
    notificationMessage: 'INDIVIDUALS_MERGE_COMPLETE_MESSAGE',
    moreDetailedDescription: 'INDIVIDUALS_MERGE_COMPLETE_MESSAGE',
    availableButtons: ['view'],
  },
};
