import React from 'react';
import { get } from 'lodash-es';

import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import { notificationSchema } from '../../../constants/notificationSchema';
import NotificationDetailsDialog from '../NotificationDetailsDialog';

export default function NotificationCollaborationEditApprovedDialog({
  open,
  onClose,
  notification,
}) {
  const notificationType = notification?.message_type;
  const currentNotificationSchema = get(
    notificationSchema,
    notificationType,
  );
  const path = get(currentNotificationSchema, 'path');
  const {
    mutate: patchCollaboration,
    error,
    isError,
  } = usePatchCollaboration();
  const collaborationGuid = get(notification, [
    'message_values',
    'collaboration_guid',
  ]);
  const onClickRevoke = async () => {
    const response = await patchCollaboration({
      collaborationGuid,
      operations: [
        {
          op: 'replace',
          path,
          value: 'revoked',
        },
      ],
    });
    if (response?.status === 200) onClose();
  };
  const availableButtons = [
    {
      name: 'revoke',
      buttonId: 'REVOKE_ACCESS',
      onClick: onClickRevoke,
    },
  ];
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
      buttons={availableButtons}
      isError={isError}
      error={error}
    />
  );
}
