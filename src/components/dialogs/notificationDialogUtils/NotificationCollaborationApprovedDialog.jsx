import React from 'react';
import { useQueryClient } from 'react-query';
import { get } from 'lodash-es';

import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import queryKeys from '../../../constants/queryKeys';
import { notificationSchema } from '../../../constants/notificationSchema';
import NotificationDetailsDialog from '../NotificationDetailsDialog';

export default function NotificationCollaborationApprovedDialog({
  open,
  onClose,
  notification,
}) {
  const queryClient = useQueryClient();
  const notificationType = notification?.message_type;
  const currentNotificationSchema = get(
    notificationSchema,
    notificationType,
  );
  const path = get(currentNotificationSchema, 'path');
  const {
    patchCollaborationsAsync,
    error,
    isError,
  } = usePatchCollaboration();
  const collaborationId = get(notification, [
    'message_values',
    'collaboration_guid',
  ]);
  const revokeOnClickFn = async () => {
    const response = await patchCollaborationsAsync(collaborationId, [
      {
        op: 'replace',
        path,
        value: 'revoked',
      },
    ]);
    if (response?.status === 200) {
      onClose();
      queryClient.invalidateQueries(queryKeys.me);
    }
  };
  const availableButtons = [
    {
      name: 'revoke',
      buttonId: 'REVOKE_ACCESS',
      onClick: revokeOnClickFn,
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
