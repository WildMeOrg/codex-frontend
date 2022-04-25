import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

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
import ButtonLink from '../ButtonLink';
import shane from '../../assets/shane.jpg';
import { notificationSchema } from '../../constants/notificationSchema';
import { calculatePrettyTimeElapsedSince } from '../../utils/formatters';
import { notificationTypes } from '../dialogs/notificationDialogUtils';
import queryKeys from '../../constants/queryKeys';

function renderDisplayTextBasedOnMessageType(
  currentNotificationSchema,
  userName,
  theirIndividualName,
  intl,
) {
  return (
    <Text style={{ maxWidth: 200, margin: '0 20px' }}>
      {intl.formatMessage(
        { id: currentNotificationSchema?.notificationMessage },
        { userName, theirIndividualName },
      )}
    </Text>
  );
}

export default function NotificationsPane({
  anchorEl,
  notifications,
  notificationsLoading,
  refreshNotifications,
  shouldOpen,
  setShouldOpen,
}) {
  // console.log(
  //   'deleteMe notifications in the notificaitons pane are: ',
  // );
  // console.log(notifications);
  const intl = useIntl();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [
    activeCollaborationNotification,
    setActiveCollaborationNotification,
  ] = useState(null);
  const { markRead } = usePatchNotification();

  return (
    <div>
      {Boolean(activeCollaborationNotification) && (
        <activeCollaborationNotification.dialog
          open={Boolean(activeCollaborationNotification)}
          onClose={() => setActiveCollaborationNotification(null)}
          notification={activeCollaborationNotification?.notification}
        />
      )}
      <Popover
        open={shouldOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{ style: { marginTop: -8 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorEl={anchorEl}
        onClose={() => setShouldOpen(false)}
      >
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
              // TODO deleteMe maybe get the merged individual's guid
              const currentNotificationSchema = get(
                notificationSchema,
                notificationType,
              );
              const showNotificationDialog =
                currentNotificationSchema?.showNotificationDialog &&
                refreshNotifications !== undefined;
              const senderName = get(
                notification,
                'sender_name',
                'Unnamed User',
              );
              // TODO get yourIndividualName deleteMe
              const theirIndividualName = get(
                notification,
                ['message_values', 'target_individual_name'],
                'Unnamed Individual',
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
                        theirIndividualName,
                        intl,
                      )}
                    </div>
                    <div>
                      {showNotificationDialog && (
                        <Button
                          key={notification?.guid}
                          display="primary"
                          id="VIEW"
                          onClick={async () => {
                            if (showNotificationDialog) {
                              const clickedNotificationType =
                                notification?.message_type;
                              const notificationDialog =
                                notificationTypes[
                                  clickedNotificationType
                                ];
                              await markRead(
                                get(notification, 'guid'),
                              );
                              refreshNotifications();
                              setShouldOpen(false);
                              setActiveCollaborationNotification({
                                notification,
                                dialog: notificationDialog,
                              });
                            }
                          }}
                        />
                      )}
                      {!showNotificationDialog && (
                        <ButtonLink
                          key={notification?.guid}
                          display="primary"
                          isHashLink
                          href={get(
                            currentNotificationSchema,
                            'buttonPath',
                            '/#collab-card',
                          )}
                          id="VIEW"
                          onClick={async () => {
                            await markRead(get(notification, 'guid'));
                            queryClient.invalidateQueries(
                              queryKeys.me,
                            );
                            refreshNotifications();
                            setShouldOpen(false);
                          }}
                        />
                      )}
                    </div>
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
              <Text id="VIEW_ALL_NOTIFICATIONS_MORE_DETAIL" />
            </Link>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
}
