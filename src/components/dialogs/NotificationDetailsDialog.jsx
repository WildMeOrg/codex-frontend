import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import StandardDialog from '../StandardDialog';
import Text from '../Text';
import Link from '../Link';
import ButtonLink from '../ButtonLink';
import Button from '../Button';
import CustomAlert from '../Alert';
import { getNotificationProps } from '../../utils/notificationUtils';
import useGetMe from '../../models/users/useGetMe';

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
  const { data: currentUserData } = useGetMe();

  const {
    userName,
    userNameGuid,
    user1Name,
    user2Name,
    yourIndName,
    yourIndividualGuid,
    theirIndividualName,
    theirIndividualGuid,
    formattedDeadline,
    otherUserGuidForManagerNotifications,
    otherUserNameForManagerNotifications,
    managerName,
  } = getNotificationProps(intl, notification, currentUserData?.guid);

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
            userName: (
              <span>
                <Link newTab href={`/users/${userNameGuid}`}>
                  {userName}
                </Link>
              </span>
            ),
            user1Name,
            user2Name,
            yourIndividualName: (
              <span>
                <Link
                  newTab
                  href={`/individuals/${yourIndividualGuid}`}
                >
                  {yourIndName}
                </Link>
              </span>
            ),
            theirIndividualName: (
              <span>
                <Link
                  newTab
                  href={`/individuals/${theirIndividualGuid}`}
                >
                  {theirIndividualName}
                </Link>
              </span>
            ),
            formattedDeadline,
            otherUserNameForManagerNotifications: (
              <span>
                <Link
                  newTab
                  href={`/users/${otherUserGuidForManagerNotifications}`}
                >
                  {otherUserNameForManagerNotifications}
                </Link>
              </span>
            ),
            managerName,
          }}
        />
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        {buttons.map(currentButton => (
          <div>
            {get(currentButton, 'onClick') && (
              <Button
                display="primary"
                id={get(currentButton, 'buttonId')}
                loading={get(currentButton, 'loading')}
                onClick={get(currentButton, 'onClick')}
              />
            )}
            {get(currentButton, 'href') && (
              <ButtonLink
                display="primary"
                id={get(currentButton, 'buttonId')}
                loading={get(currentButton, 'loading')}
                href={get(currentButton, 'href')}
              />
            )}
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
