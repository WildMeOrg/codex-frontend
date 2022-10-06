import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import usePatchNotification from '../../models/notification/usePatchNotification';
import Link from '../Link';
import Text from '../Text';
import Button from '../Button';
import ButtonLink from '../ButtonLink';
import NotificationPaneDisplayText from './NotificationPaneDisplayText';
import { notificationSchema } from '../../constants/notificationSchema';
import { getNotificationProps } from '../../utils/notificationUtils';
import { notificationTypes } from '../dialogs/notificationDialogUtils';
import { calculatePrettyTimeElapsedSince } from '../../utils/formatters';
import queryKeys from '../../constants/queryKeys';

export default function NotificationsPane({
  anchorEl,
  notifications,
  notificationsLoading,
  refreshNotifications,
  shouldOpen,
  setShouldOpen,
  currentUserGuid,
}) {
  const intl = useIntl();
  const queryClient = useQueryClient();
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
              const mergedIndividualGuid =
                notification?.message_values?.target_individual_guid;

              const currentNotificationSchema = get(
                notificationSchema,
                notificationType,
              );
              const showNotificationDialog =
                currentNotificationSchema?.showNotificationDialog &&
                refreshNotifications !== undefined;
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
              } = getNotificationProps(
                intl,
                notification,
                currentUserGuid,
              );
              const deriveButtonPath = get(
                currentNotificationSchema,
                'deriveButtonPath',
              );
              const defaultButtonPath = get(
                currentNotificationSchema,
                'buttonPath',
                '/#collab-card',
              );
              const buttonPath = deriveButtonPath
                ? deriveButtonPath(mergedIndividualGuid)
                : defaultButtonPath;
              const createdDate = notification?.created;
              const timeSince =
                calculatePrettyTimeElapsedSince(createdDate);

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
                      <Avatar style={{ width: 56, height: 56 }}>
                        {userName[0].toUpperCase()}
                      </Avatar>
                      <NotificationPaneDisplayText
                        currentNotificationSchema={
                          currentNotificationSchema
                        }
                        userName={userName}
                        userNameGuid={userNameGuid}
                        user1Name={user1Name}
                        user2Name={user2Name}
                        yourIndName={yourIndName}
                        yourIndividualGuid={yourIndividualGuid}
                        theirIndividualName={theirIndividualName}
                        theirIndividualGuid={theirIndividualGuid}
                        formattedDeadline={formattedDeadline}
                        otherUserGuidForManagerNotifications={
                          otherUserGuidForManagerNotifications
                        }
                        otherUserNameForManagerNotifications={
                          otherUserNameForManagerNotifications
                        }
                        managerName={managerName}
                        timeSince={timeSince}
                      />
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
                          href={buttonPath}
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
                <Text id="NO_UNREAD_NOTIFICATIONS" />
              </Grid>
            ))}
          <Divider />
          <Grid item style={{ padding: 16 }}>
            <Link to="/notifications" noUnderline>
              <Text id="VIEW_ALL_NOTIFICATIONS" />
            </Link>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
}
