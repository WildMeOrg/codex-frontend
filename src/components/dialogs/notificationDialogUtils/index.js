import NotificationViewButton from './NotificationViewButton';
import NotificationCollaborationGrantAccessButton from './NotificationCollaborationGrantAccessButton';
import NotificationDeclineCollaborationRequestDialog from './NotificationDeclineCollaborationRequestDialog';

export const notificationButtonTypes = {
  view: 'view',
  grant: 'grant',
  decline: 'decline',
  revoke: 'revoke',
  request: 'request',
};

export const notificationButtons = {
  [notificationButtonTypes.view]: NotificationViewButton,
  [notificationButtonTypes.grant]: NotificationCollaborationGrantAccessButton,
  [notificationButtonTypes.decline]: NotificationDeclineCollaborationRequestDialog,
};
