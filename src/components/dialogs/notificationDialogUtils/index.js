import NotificationCollaborationManagerCreateDialog from './NotificationCollaborationManagerCreateDialog';
import NotificationCollaborationRequestDialog from './NotificationCollaborationRequestDialog';
import NotificationCollaborationApprovedDialog from './NotificationCollaborationApprovedDialog';
import NotificationCollaborationRevokedDialog from './NotificationCollaborationRevokedDialog';
import NotificationCollaborationEditRequestDialog from './NotificationCollaborationEditRequestDialog';
import NotificationCollaborationEditApprovedDialog from './NotificationCollaborationEditApprovedDialog';
import NotificationCollaborationEditRevokeDialog from './NotificationCollaborationEditRevokeDialog';
import NotificationCollaborationManagerRevokeDialog from './NotificationCollaborationManagerRevokeDialog';
import NotificationIndividualMergeRequestDialog from './NotificationIndividualMergeRequestDialog';
import NotificationIndividualMergeCompleteDialog from './NotificationIndividualMergeCompleteDialog';

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
};

export const notificationTypes = {
  [notificationTypeNames.collaboration_manager_create]: NotificationCollaborationManagerCreateDialog,
  [notificationTypeNames.collaboration_request]: NotificationCollaborationRequestDialog,
  [notificationTypeNames.collaboration_approved]: NotificationCollaborationApprovedDialog,
  [notificationTypeNames.collaboration_revoke]: NotificationCollaborationRevokedDialog,
  [notificationTypeNames.collaboration_edit_request]: NotificationCollaborationEditRequestDialog,
  [notificationTypeNames.collaboration_edit_approved]: NotificationCollaborationEditApprovedDialog,
  [notificationTypeNames.collaboration_edit_revoke]: NotificationCollaborationEditRevokeDialog,
  [notificationTypeNames.collaboration_manager_revoke]: NotificationCollaborationManagerRevokeDialog,
  [notificationTypeNames.individual_merge_request]: NotificationIndividualMergeRequestDialog,
  [notificationTypeNames.individual_merge_complete]: NotificationIndividualMergeCompleteDialog,
};
