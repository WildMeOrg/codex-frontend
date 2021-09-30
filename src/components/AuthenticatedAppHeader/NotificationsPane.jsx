import React, { useState } from 'react';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import usePatchNotification from '../../models/notification/usePatchNotification';
import CollaborationRequestDialog from '../dialogs/CollaborationRequestDialog';
import Link from '../Link';
import Text from '../Text';
import Button from '../Button';
import shane from '../../assets/shane.jpg';

export default function NotificationsPane({
  anchorEl,
  setAnchorEl,
  notifications,
  notificationsLoading,
  refreshNotifications,
}) {
  const [
    activeCollaborationNotification,
    setActiveCollaborationNotification,
  ] = useState(null);

  const { markRead } = usePatchNotification();

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      PaperProps={{ style: { marginTop: -8 } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
    >
      <CollaborationRequestDialog
        open={Boolean(activeCollaborationNotification)}
        onClose={() => setActiveCollaborationNotification(null)}
        notification={activeCollaborationNotification}
      />
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
            const senderName = get(
              notification,
              'sender_name',
              'Unnamed User',
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
                    <Text style={{ maxWidth: 200, margin: '0 20px' }}>
                      {`${senderName} sent you a collaboration request`}
                    </Text>
                  </div>
                  <Button
                    onClick={async () => {
                      setActiveCollaborationNotification(
                        notification,
                      );
                      await markRead(get(notification, 'guid'));
                      refreshNotifications();
                    }}
                    style={{ maxHeight: 40 }}
                    id="VIEW"
                  />
                </Grid>
                <Grid item>
                  <Divider />
                </Grid>
              </React.Fragment>
            );
          })
        )}
        {!notifications || notifications.length === 0 && (
          <Grid item style={{ padding: 16 }}>
        <Text>You have no unread notifications.</Text>
        </Grid>
        )}
        <Divider />
        <Grid item style={{ padding: 16 }}>

        <Link to="/notifications" noUnderline><Text>View all notifications</Text></Link>
        </Grid>
      </Grid>
    </Popover>
  );
}
