export const notificationSchema = {
  collaboration_manager_create: {
    message: 'A_COLLABORATION_WAS_CREATED_ON_YOUR_BEHALF',
    availableButtons: ['revoke'],
  },
  collaboration_request: {
    message: 'COLLABORATION_VIEW_REQUEST_DESCRIPTION',
    avaialableButtons: ['grant', 'decline'],
  },
  collaboration_approved: {
    message: 'name approved your collaboration request',
    avaialableButtons: ['revoke'],
  },
  collaboration_revoke: {
    message: 'name revoked your collaboration request',
    avaialableButtons: [],
  },
  collaboration_edit_request: {
    message: 'COLLABORATION_EDIT_REQUEST_DESCRIPTION',
    avaialableButtons: ['approve', 'decline'],
  },
  collaboration_edit_approved: {
    message: 'name approved your collaboration edit request',
    avaialableButtons: ['revoke'],
  },
  collaboration_edit_revoke: {
    message:
      'name revoked edit privileges for your collaboration with them',
    avaialableButtons: ['request'],
  },
  collaboration_manager_revoke: {
    message: 'a collaboration was revoked by a user manager',
    avaialableButtons: ['request'],
  },
  individual_merge_request: {
    message:
      'name requested that an individual in your data set be merged with another individual in the database',
    avaialableButtons: ['view'],
  },
  individual_merge_complete: {
    message: 'name completed the an individual merge',
    avaialableButtons: ['view'],
  },
};
