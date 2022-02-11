import React from 'react';
import { get } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import StandardDialog from '../StandardDialog';
import Text from '../Text';
import { notificationSchema } from '../../constants/notificationSchema';
import { notificationButtons } from './notificationDialogUtils';

export default function NotificationDetailsDialog({
  open,
  onClose,
  notification,
}) {
  const notificationType = notification?.message_type;
  const currentNotificationSchema = get(
    notificationSchema,
    notificationType,
  );

  const onCloseDialog = () => {
    onClose();
  };

  const senderName = get(notification, 'sender_name', 'Unnamed User');
  const user1Name = get(notification, [
    'message_values',
    'user1_name',
  ]);
  const user2Name = get(notification, [
    'message_values',
    'user2_name',
  ]);
  const individual1Names = notification?.names || []; // TODO flesh out more once this is included in notifications DEX-739
  const individual1NicknameObject = individual1Names.find(
    n => n.context === 'nickname',
  );
  const individual1Nickname =
    individual1NicknameObject?.value || 'Unnamed individual';
  const individual2Names = notification?.names || []; // TODO flesh out more once this is included in notifications DEX-739
  const individual2NicknameObject = individual2Names.find(
    n => n.context === 'nickname',
  );
  const individual2Nickname =
    individual2NicknameObject?.value || 'Unnamed individual';
  const path = get(currentNotificationSchema, 'path', '');

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
            individual1Nickname,
            individual2Nickname,
          }}
        />
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        {get(currentNotificationSchema, 'availableButtons', [])
          .filter(candidateButton => candidateButton !== 'view')
          .map(notificationButton => {
            const NotificationButtonComponent =
              notificationButtons[notificationButton];
            const notificationButtonOptionProps = {
              onCloseDialog,
              path,
            };
            return (
              <NotificationButtonComponent
                key={notification?.guid}
                notification={notification}
                {...notificationButtonOptionProps}
              />
            );
          })}
      </DialogActions>
    </StandardDialog>
  );
}
