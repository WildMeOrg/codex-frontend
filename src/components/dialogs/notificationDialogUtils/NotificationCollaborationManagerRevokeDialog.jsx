import React from 'react';
import { get } from 'lodash-es';
import { notificationSchema } from '../../../constants/notificationSchema';
import NotificationDetailsDialog from '../NotificationDetailsDialog';

export default function NotificationCollaborationMangerRevokeDialog({
  notification,
  onClose,
  open,
}) {
  const notificationType = notification?.message_type;
  const currentNotificationSchema = get(
    notificationSchema,
    notificationType,
  );
  const avaialableButtons = [];
  return (
    <NotificationDetailsDialog
      open={open}
      onClose={onClose}
      notification={notification}
      titleId={get(currentNotificationSchema, 'titleId')}
      moreDetailedDescription={get(
        currentNotificationSchema,
        'moreDetailedDescription',
      )}
      buttons={avaialableButtons}
      isError={false}
      error=""
    />
  );
}
