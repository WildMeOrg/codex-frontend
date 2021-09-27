import React from 'react';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import Text from '../Text';
import Button from '../Button';
import shane from '../../assets/shane.jpg';

export default function NotificationsPane({
  anchorEl,
  setAnchorEl,
  notifications,
  notificationsLoading,
}) {
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
                  <Button style={{ maxHeight: 40 }} id="VIEW" />
                </Grid>
                <Grid item>
                  <Divider />
                </Grid>
              </React.Fragment>
            );
          })
        )}
      </Grid>
    </Popover>
  );
}
