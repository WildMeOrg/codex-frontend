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
import NotificationCollaborationManagerEditApprovedDialog from './NotificationCollaborationManagerEditApprovedDialog';
import NotificationCollaborationManagerEditRevokeDialog from './NotificationCollaborationManagerEditRevokeDialog';
import NotificationCollaborationEditDeniedDialog from './NotificationCollaborationEditDeniedDialog';
import NotificationCollaborationManagerDeniedDialog from './NotificationCollaborationManagerDeniedDialog';
import NotificationCollaborationManagerEditDeniedDialog from './NotificationCollaborationManagerEditDeniedDialog';

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
  [notificationTypeNames.collaboration_manager_edit_approved]:
    NotificationCollaborationManagerEditApprovedDialog,
  [notificationTypeNames.collaboration_manager_edit_revoke]:
    NotificationCollaborationManagerEditRevokeDialog,
  [notificationTypeNames.collaboration_edit_denied]:
    NotificationCollaborationEditDeniedDialog,
  [notificationTypeNames.collaboration_manager_denied]:
    NotificationCollaborationManagerDeniedDialog,
  [notificationTypeNames.collaboration_manager_edit_denied]:
    NotificationCollaborationManagerEditDeniedDialog,
};
