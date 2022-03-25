import React from 'react';
import { get } from 'lodash-es';

import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import { notificationSchema } from '../../../constants/notificationSchema';
import NotificationDetailsDialog from '../NotificationDetailsDialog';

export default function NotificationIndividualMergeDialog({
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
  } = usePatchCollaboration(); // TODO once individual merge is fleshed out, change this
  // TODO will likely need individual IDs

  const onClickGrant = async () => {
    const temp = 'changeMe';
    const response = await patchCollaboration({
      collaborationGuid: temp,
      operations: [
        // TODO this will change
        {
          op: 'replace',
          path,
          value: 'approved',
        },
      ],
    });
    if (response?.status === 200) onClose();
  };

  const onClickDecline = async () => {
    const temp = 'changeMe';
    const response = await patchCollaboration({
      collaborationGuid: temp,
      operations: [
        // TODO this will change
        {
          op: 'replace',
          path,
          value: 'declined',
        },
      ],
    });
    if (response?.status === 200) onClose();
  };
  const availableButtons = [
    {
      name: 'grant', // TODO allow instead of grant?
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
