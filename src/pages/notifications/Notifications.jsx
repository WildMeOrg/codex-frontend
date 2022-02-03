import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

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
import CollaborationRequestDialog from '../../components/dialogs/CollaborationRequestDialog';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import Text from '../../components/Text';
import useNotifications from '../../models/notification/useNotifications';
import usePatchNotification from '../../models/notification/usePatchNotification';
import { calculatePrettyTimeElapsedSince } from '../../utils/formatters';

export default function Notifications() {
  const intl = useIntl();
  const theme = useTheme();

  useDocumentTitle('NOTIFICATIONS');

  const {
    data: notifications,
    loading: notificationsLoading,
    refresh: refreshNotifications,
  } = useNotifications(true);

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
      <CollaborationRequestDialog
        open={Boolean(activeCollaborationNotification)}
        onClose={() => setActiveCollaborationNotification(null)}
        notification={activeCollaborationNotification}
      />
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
                const read = get(notification, 'is_read', false);
                const hasSenderName =
                  get(notification, 'sender_name') &&
                  get(notification, 'sender_name') !== 'N/A';
                const senderName = get(
                  notification,
                  'sender_name',
                  'Unnamed User',
                );
                const createdDate = notification?.created;
                const timeSince = calculatePrettyTimeElapsedSince(
                  createdDate,
                );
                const senderNameText = (
                  <Text
                    style={{
                      color: read
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                    }}
                    variant="body2"
                  >
                    {`${senderName}`}{' '}
                    {intl.formatMessage({
                      id: 'SENT_YOU_A_COLLABORATION_REQUEST',
                    })}
                  </Text>
                );
                const noSenderNameText = (
                  <Text
                    style={{
                      color: read
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                    }}
                    variant="body2"
                  >
                    {intl.formatMessage({
                      id:
                        'A_COLLABORATION_WAS_CREATED_ON_YOUR_BEHALF',
                    })}
                  </Text>
                );
                const howLongAgoText = (
                  <Text
                    style={{
                      color: read
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                      fontSize: '14px',
                    }}
                  >
                    {timeSince}{' '}
                    {intl.formatMessage({
                      id: 'AGO',
                    })}
                  </Text>
                );

                return (
                  <ListItem
                    onClick={async () => {
                      setActiveCollaborationNotification(
                        notification,
                      );
                      await markRead(get(notification, 'guid'));
                      refreshNotifications();
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
                        >
                          Collaboration request
                        </Text>
                      }
                      secondary={
                        hasSenderName
                          ? [senderNameText, howLongAgoText]
                          : [noSenderNameText, howLongAgoText]
                      }
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
