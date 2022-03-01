import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import StandardDialog from '../StandardDialog';
import Text from '../Text';
import Button from '../Button';
import CustomAlert from '../Alert';

export default function NotificationDetailsDialog({
  open,
  onClose,
  notification,
  titleId,
  moreDetailedDescription,
  buttons,
  isError = false,
  error = null,
}) {
  const intl = useIntl();
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

  return (
    <StandardDialog
      open={open}
      onClose={onCloseDialog}
      titleId={titleId}
    >
      <DialogContent>
        <Text
          style={{ marginBottom: 20 }}
          id={moreDetailedDescription}
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
        {buttons.map(currentButton => (
          <div>
            <Button
              display="primary"
              id={get(currentButton, 'buttonId')}
              loading={get(currentButton, 'loading')}
              onClick={get(currentButton, 'onClick')}
            />
          </div>
        ))}
      </DialogActions>
      {isError && (
        <CustomAlert
          severity="error"
          titleId="SERVER_ERROR"
          description={
            error || intl.formatMessage({ id: 'UNKNOWN_ERROR' })
          }
        />
      )}
    </StandardDialog>
  );
}
