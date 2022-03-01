import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTheme } from '@material-ui/core/styles';

import usePatchNotification from '../../models/notification/usePatchNotification';
import Link from '../Link';
import Text from '../Text';
import Button from '../Button';
import shane from '../../assets/shane.jpg';
import { notificationSchema } from '../../constants/notificationSchema';
import { calculatePrettyTimeElapsedSince } from '../../utils/formatters';
import { notificationTypes } from '../dialogs/notificationDialogUtils';

function renderDisplayTextBasedOnMessageType(
  currentNotificationSchema,
  userName,
  intl,
) {
  return (
    <Text style={{ maxWidth: 200, margin: '0 20px' }}>
      {intl.formatMessage(
        { id: currentNotificationSchema?.notificationMessage },
        { userName },
      )}
    </Text>
  );
}

export default function NotificationsPane({
  anchorEl,
  setAnchorEl,
  notifications,
  notificationsLoading,
  refreshNotifications,
}) {
  const intl = useIntl();
  const theme = useTheme();
  const [
    activeCollaborationNotification,
    setActiveCollaborationNotification,
  ] = useState(null);
  const { markRead } = usePatchNotification();

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      PaperProps={{ style: { marginTop: -8 } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
    >
      {Boolean(activeCollaborationNotification) && (
        <activeCollaborationNotification.dialog
          open={Boolean(activeCollaborationNotification)}
          onClose={() => setActiveCollaborationNotification(null)}
          notification={activeCollaborationNotification?.notification}
        />
      )}
      <Grid container direction="column">
        <Grid item style={{ padding: 16 }}>
          <Text style={{ fontWeight: 'bold' }} id="NOTIFICATIONS" />
        </Grid>
        {notificationsLoading ? (
          <div style={{ width: 300, margin: '20px 16px' }}>
            <LinearProgress />
          </div>
        ) : (
          notifications.map(notification => {
            const notificationType = notification?.message_type;
            const currentNotificationSchema = get(
              notificationSchema,
              notificationType,
            );
            const showViewButton =
              currentNotificationSchema?.viewInNotificationPane &&
              refreshNotifications !== undefined;
            const senderName = get(
              notification,
              'sender_name',
              'Unnamed User',
            );
            const createdDate = notification?.created;
            const timeSince = calculatePrettyTimeElapsedSince(
              createdDate,
            );
            return (
              <React.Fragment key={notification.guid}>
                <Grid
                  item
                  style={{
                    display: 'flex',
                    padding: 12,
                    margin: 4,
                    width: 'max-content',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <Avatar src={shane} variant="circular" />
                    {renderDisplayTextBasedOnMessageType(
                      currentNotificationSchema,
                      senderName,
                      intl,
                    )}
                  </div>
                  {showViewButton && (
                    <Button
                      display="basic"
                      id="VIEW"
                      onClick={async () => {
                        const clickedNotificationType =
                          notification?.message_type;
                        const notificationDialog =
                          notificationTypes[clickedNotificationType];
                        setActiveCollaborationNotification({
                          notification,
                          dialog: notificationDialog,
                        });
                        await markRead(get(notification, 'guid'));
                        refreshNotifications();
                      }}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  style={{
                    display: 'flex',
                    paddingLeft: 12,
                    marginLeft: 4,
                    width: 'max-content',
                  }}
                >
                  <Text
                    style={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {intl.formatMessage(
                      { id: 'TIME_SINCE' },
                      { timeSince },
                    )}
                  </Text>
                </Grid>
                <Grid item>
                  <Divider />
                </Grid>
              </React.Fragment>
            );
          })
        )}
        {!notifications ||
          (notifications.length === 0 && (
            <Grid item style={{ padding: 16 }}>
              <Text>You have no unread notifications.</Text>
            </Grid>
          ))}
        <Divider />
        <Grid item style={{ padding: 16 }}>
          <Link to="/notifications" noUnderline>
            <Text>View all notifications</Text>
          </Link>
        </Grid>
      </Grid>
    </Popover>
  );
}
