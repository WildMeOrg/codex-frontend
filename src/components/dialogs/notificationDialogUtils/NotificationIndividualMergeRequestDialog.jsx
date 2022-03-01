import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { get } from 'lodash-es';

// import Button from '../../Button';
// import CustomAlert from '../../Alert';
import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import queryKeys from '../../../constants/queryKeys';
import { notificationSchema } from '../../../constants/notificationSchema';
import NotificationDetailsDialog from '../NotificationDetailsDialog';

export default function NotificationIndividualMergeDialog({
  open,
  onClose,
  notification,
}) {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const notificationType = notification?.message_type;
  const currentNotificationSchema = get(
    notificationSchema,
    notificationType,
  );
  const path = get(currentNotificationSchema, 'path');
  const {
    patchCollaborationsAsync,
    loading,
    error,
    isError,
  } = usePatchCollaboration(); // TODO once individual merge is fleshed out, change this
  //TODO will likely need individual IDs
  const grantOnClickFn = async () => {
    const response = await patchCollaborationsAsync(collaborationId, [
      //TODO this will change
      {
        op: 'replace',
        path,
        value: 'approved',
      },
    ]);
    if (response?.status === 200) {
      onClose();
      queryClient.invalidateQueries(queryKeys.me);
    }
  };
  const declineOnClickFn = async () => {
    const response = await patchCollaborationsAsync(collaborationId, [
      // TODO this will change
      {
        op: 'replace',
        path,
        value: 'declined',
      },
    ]);
    if (response?.status === 200) {
      // onCloseDialog();
      onClose();
      queryClient.invalidateQueries(queryKeys.me); // TODO this might change
    }
  };
  const availableButtons = [
    {
      name: 'grant', //TODO allow instead of grant?
      buttonId: 'GRANT_ACCESS',
      onClick: grantOnClickFn,
    },
    {
      name: 'decline',
      buttonId: 'DECLINE_REQUEST',
      onClick: declineOnClickFn,
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
      buttons={availableButtons} //   currentNotificationSchema, // availableButtons={get(
      //   'availableButtons',
      //   [],
      // ).filter(candidateButton => candidateButton !== 'view')}
      // path={path}
      isError={isError}
      error={error}
    />
  );
}
