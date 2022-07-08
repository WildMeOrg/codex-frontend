import NotificationCollaborationManagerCreateDialog from './NotificationCollaborationManagerCreateDialog';
import NotificationCollaborationRequestDialog from './NotificationCollaborationRequestDialog';
import NotificationCollaborationApprovedDialog from './NotificationCollaborationApprovedDialog';
import NotificationCollaborationRevokedDialog from './NotificationCollaborationRevokedDialog';
import NotificationCollaborationDeniedDialog from './NotificationCollaborationDeniedDialog';
import NotificationCollaborationEditRequestDialog from './NotificationCollaborationEditRequestDialog';
import NotificationCollaborationEditApprovedDialog from './NotificationCollaborationEditApprovedDialog';
import NotificationCollaborationEditRevokeDialog from './NotificationCollaborationEditRevokeDialog';
import NotificationCollaborationManagerRevokeDialog from './NotificationCollaborationManagerRevokeDialog';
import NotificationIndividualMergeRequestDialog from './NotificationIndividualMergeRequestDialog';
import NotificationIndividualMergeCompleteDialog from './NotificationIndividualMergeCompleteDialog';
import NotificationIndividualMergeBlockDialog from './NotificationIndividualMergeBlockDialog';
import { notificationTypeNames } from '../../../constants/notificationSchema';

export const notificationTypes = {
  [notificationTypeNames.collaboration_manager_create]:
    NotificationCollaborationManagerCreateDialog,
  [notificationTypeNames.collaboration_request]:
    NotificationCollaborationRequestDialog,
  [notificationTypeNames.collaboration_approved]:
    NotificationCollaborationApprovedDialog,
  [notificationTypeNames.collaboration_revoke]:
    NotificationCollaborationRevokedDialog,
  [notificationTypeNames.collaboration_denied]:
    NotificationCollaborationDeniedDialog,
  [notificationTypeNames.collaboration_edit_request]:
    NotificationCollaborationEditRequestDialog,
  [notificationTypeNames.collaboration_edit_approved]:
    NotificationCollaborationEditApprovedDialog,
  [notificationTypeNames.collaboration_edit_revoke]:
    NotificationCollaborationEditRevokeDialog,
  [notificationTypeNames.collaboration_manager_revoke]:
    NotificationCollaborationManagerRevokeDialog,
  [notificationTypeNames.individual_merge_request]:
    NotificationIndividualMergeRequestDialog,
  [notificationTypeNames.individual_merge_complete]:
    NotificationIndividualMergeCompleteDialog,
  [notificationTypeNames.individual_merge_blocked]:
    NotificationIndividualMergeBlockDialog,
};
