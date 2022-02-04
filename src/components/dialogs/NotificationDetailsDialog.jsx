import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import queryKeys from '../../constants/queryKeys';
import CustomAlert from '../Alert';

import usePatchCollaboration from '../../models/collaboration/usePatchCollaboration';
import StandardDialog from '../StandardDialog';
import Text from '../Text';
import Button from '../Button';
import { notificationSchema } from '../../constants/notificationSchema';

export default function NotificationDetailsDialog({
  open,
  onClose,
  notification,
}) {
  const queryClient = useQueryClient();
  const {
    patchCollaborationsAsync,
    loading,
    error,
    isError,
  } = usePatchCollaboration();
  const intl = useIntl();

  const notificationType = notification?.message_type;
  const currentNotificationSchema = get(
    notificationSchema,
    notificationType,
  );

  const onCloseDialog = () => {
    onClose();
  };

  const collaborationId = get(notification, [
    'message_values',
    'collaboration_guid',
  ]);
  const senderName = get(notification, 'sender_name', 'Unnamed User');
  const user1Name = get(notification, [
    'message_values',
    'user1_name',
  ]);
  const user2Name = get(notification, [
    'message_values',
    'user2_name',
  ]);
  const path = get(currentNotificationSchema, 'path', '');

  // TODO revokeCollabButton
  // TODO requestCollab/orEdit Button

  const declineRequestButton = (
    <Button
      display="basic"
      id="DECLINE_REQUEST"
      onClick={async () => {
        const response = await patchCollaborationsAsync(
          collaborationId,
          [
            {
              op: 'replace',
              path,
              value: 'declined',
            },
          ],
        );
        if (response?.status === 200) {
          onCloseDialog();
          queryClient.invalidateQueries(queryKeys.me);
        }
      }}
    />
  );

  const grantAccessButton = (
    <Button
      loading={loading}
      display="primary"
      onClick={async () => {
        const response = await patchCollaborationsAsync(
          collaborationId,
          [
            {
              op: 'replace',
              path,
              value: 'approved',
            },
          ],
        );
        if (response?.status === 200) {
          onCloseDialog();
          queryClient.invalidateQueries(queryKeys.me);
        }
      }}
      id="GRANT_ACCESS"
    />
  );

  return (
    <StandardDialog
      open={open}
      onClose={onCloseDialog}
      titleId={get(currentNotificationSchema, 'titleId')}
    >
      <DialogContent>
        <Text
          style={{ marginBottom: 20 }}
          id={currentNotificationSchema?.moreDetailedDescription}
          values={{
            userName: senderName,
            user1Name,
            user2Name,
          }}
        />
        {isError && (
          <CustomAlert
            severity="error"
            titleId="SERVER_ERROR"
            description={
              error || intl.formatMessage({ id: 'UNKNOWN_ERROR' })
            }
          />
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        {get(
          currentNotificationSchema,
          'availableButtons',
          [],
        ).includes('decline') && declineRequestButton}
        {get(
          currentNotificationSchema,
          'availableButtons',
          [],
        ).includes('grant') && grantAccessButton}
      </DialogActions>
    </StandardDialog>
  );
}
