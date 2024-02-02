import React from 'react';
import { get } from 'lodash-es';

import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import { notificationSchema } from '../../../constants/notificationSchema';
import NotificationDetailsDialog from '../NotificationDetailsDialog';
import { useHistory } from 'react-router-dom';

export default function NotificationCollaborationRequestDialog({
  open,
  onClose,
  notification,
}) {
  const history = useHistory();
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
  const onClickGrant = async () => {
    const response = await patchCollaboration({
      collaborationGuid,
      operations: [
        {
          op: 'replace',
          path,
          value: 'approved',
        },
      ],
    });
    if (response?.status === 200) onClose();
    history.push(`/user-profile/#collab-card`);
  };
  const onClickDecline = async () => {
    const response = await patchCollaboration({
      collaborationGuid,
      operations: [
        {
          op: 'replace',
          path,
          value: 'denied',
        },
      ],
    });
    if (response?.status === 200) onClose();
    history.push(`/user-profile/#collab-card`);
  };
  const availableButtons = [
    {
      name: 'grant',
      buttonId: 'GRANT_ACCESS',
      onClick: onClickGrant,
    },
    {
      name: 'decline',
      buttonId: 'DECLINE_REQUEST',
      onClick: onClickDecline,
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
