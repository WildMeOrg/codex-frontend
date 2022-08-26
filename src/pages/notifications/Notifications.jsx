import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CircleIcon from '@material-ui/icons/Lens';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import Text from '../../components/Text';
import Link from '../../components/Link';
import useNotifications from '../../models/notification/useNotifications';
import usePatchNotification from '../../models/notification/usePatchNotification';
import { calculatePrettyTimeElapsedSince } from '../../utils/formatters';
import { notificationSchema } from '../../constants/notificationSchema';
import { notificationTypes } from '../../components/dialogs/notificationDialogUtils';
import queryKeys from '../../constants/queryKeys';
import { getNotificationProps } from '../../utils/notificationUtils';

export default function Notifications() {
  const intl = useIntl();
  const theme = useTheme();
  const queryClient = useQueryClient();

  useDocumentTitle('NOTIFICATIONS');

  const { data: notifications, loading: notificationsLoading } =
    useNotifications(true);

  const { markRead } = usePatchNotification();

  const [
    activeCollaborationNotification,
    setActiveCollaborationNotification,
  ] = useState(null);

  const safeNotifications = notifications || [];

  if (notificationsLoading) return <LoadingScreen />;

  return (
    <MainColumn
      style={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: 1000,
      }}
    >
      {!notificationsLoading &&
        Boolean(activeCollaborationNotification) && (
          <activeCollaborationNotification.dialog
            open={Boolean(activeCollaborationNotification)}
            onClose={() => setActiveCollaborationNotification(null)}
            notification={
              activeCollaborationNotification?.notification
            }
          />
        )}
      <Grid container direction="column" style={{ padding: 32 }}>
        <Grid item>
          <Text id="NOTIFICATIONS" variant="h4" />
        </Grid>
        <Grid item>
          <Paper
            elevation={2}
            style={{
              margin: '32px 0',
              padding: '0px 12px 20px 12px',
            }}
          >
            <List>
              {safeNotifications.map(notification => {
                const notificationType = notification?.message_type;
                const currentNotificationSchema = get(
                  notificationSchema,
                  notificationType,
                );
                const read = get(notification, 'is_read', false);
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
                } = getNotificationProps(intl, notification);
                const createdDate = notification?.created;
                const timeSince =
                  calculatePrettyTimeElapsedSince(createdDate);
                const notificationText =
                  currentNotificationSchema?.notificationMessage ? (
                    <Text
                      key={notification?.guid}
                      style={{
                        color: read
                          ? theme.palette.text.secondary
                          : theme.palette.text.primary,
                      }}
                      variant="body2"
                    >
                      {intl.formatMessage(
                        {
                          id: currentNotificationSchema.notificationMessage,
                        },
                        {
                          userName: (
                            <span>
                              <Link
                                newTab
                                href={`/users/${userNameGuid}`}
                              >
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
                        },
                      )}
                    </Text>
                  ) : null;
                const howLongAgoText = (
                  <Text
                    style={{
                      color: read
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                      fontSize: '14px',
                    }}
                  >
                    {intl.formatMessage(
                      { id: 'TIME_SINCE' },
                      { timeSince },
                    )}
                  </Text>
                );

                return (
                  <ListItem
                    key={get(notification, 'guid')}
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
                      queryClient.invalidateQueries(
                        queryKeys.allNotifications,
                      );
                      queryClient.invalidateQueries(
                        queryKeys.unreadNotifications,
                      );
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <ListItemAvatar>
                      <ListItemIcon>
                        {read ? (
                          <CheckCircleIcon
                            color="disabled"
                            fontSize="small"
                          />
                        ) : (
                          <CircleIcon
                            color="primary"
                            fontSize="small"
                          />
                        )}
                      </ListItemIcon>
                    </ListItemAvatar>
                    <ListItemText
                      style={{ flex: '1 1 0' }}
                      primary={
                        <Text
                          style={{
                            color: read
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary,
                            fontWeight: 'bold',
                          }}
                          id={currentNotificationSchema?.titleId}
                        />
                      }
                      secondary={[notificationText, howLongAgoText]}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
