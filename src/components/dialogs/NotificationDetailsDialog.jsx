import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import StandardDialog from '../StandardDialog';
import Text from '../Text';
import Button from '../Button';
import CustomAlert from '../Alert';
import { getNotificationProps } from '../../utils/notificationUtils';

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

  const {
    senderName,
    user1Name,
    user2Name, // individual1AdoptionName, // TODO deleteMe
    // individual2AdoptionName, // TODO deleteMe
    yourIndividualName,
    theirIndividualName,
  } = getNotificationProps(notification);

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
            // individual1AdoptionName,
            // individual2AdoptionName,
            yourIndividualName,
            theirIndividualName,
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
