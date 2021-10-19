import React, { useState } from 'react';
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

import CollaborationRequestDialog from '../../components/dialogs/CollaborationRequestDialog';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import Text from '../../components/Text';
import useNotifications from '../../models/notification/useNotifications';
import usePatchNotification from '../../models/notification/usePatchNotification';

export default function Notifications() {
  const theme = useTheme();
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
                        <Text
                          style={{
                            color: read
                              ? theme.palette.text.secondary
                              : theme.palette.text.primary,
                          }}
                          variant="body2"
                        >
                          {`${get(
                            notification,
                            'sender_name',
                            'Unnamed User',
                          )} sent you a collaboration request.`}
                        </Text>
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
