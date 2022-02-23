import NotificationViewButton from './NotificationViewButton';
import NotificationCollaborationGrantAccessButton from './NotificationCollaborationGrantAccessButton';
import NotificationDeclineCollaborationRequestButton from './NotificationDeclineCollaborationRequestButton';
import NotificationCollaborationRevokeAccessButton from './NotificationCollaborationRevokeAccessButton';

export const notificationButtonTypes = {
  view: 'view',
  grant: 'grant',
  decline: 'decline',
  revoke: 'revoke',
};

export const notificationButtons = {
  [notificationButtonTypes.view]: NotificationViewButton,
  [notificationButtonTypes.grant]: NotificationCollaborationGrantAccessButton,
  [notificationButtonTypes.decline]: NotificationDeclineCollaborationRequestButton,
  [notificationButtonTypes.revoke]: NotificationCollaborationRevokeAccessButton,
};
