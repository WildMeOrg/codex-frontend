import React from 'react';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

import Text from '../Text';
import Button from '../Button';
import shane from '../../assets/shane.jpg';
import fluke from '../../assets/fluke.png';

const fakeData = [
  {
    id: '123',
    name: 'Jonathan Moore sent you a collaboration request.',
    userAvatar: shane,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '231',
    name: 'Finished identifying individuals for sighting #251.',
    ecologicalAvatar: fluke,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '452',
    name: 'Vanessa Moreno wants to join Indocet.',
    userAvatar: shane,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '212',
    name: 'Tyler Hogstrom wants to join Indocet.',
    userAvatar: shane,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
  {
    id: '663',
    name: 'Finished identifying individuals for sighting #250.',
    ecologicalAvatar: fluke,
    display: {
      type: 'button',
      data: 'VIEW',
    },
  },
];

export default function NotificationsPane({ anchorEl, setAnchorEl }) {
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
        {fakeData.map(task => (
          <React.Fragment key={task.id}>
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
                <Avatar
                  src={task.userAvatar || task.ecologicalAvatar}
                  variant={
                    task.ecologicalAvatar ? 'square' : 'circular'
                  }
                />
                <Text style={{ maxWidth: 200, margin: '0 20px' }}>
                  {task.name}
                </Text>
              </div>
              <Button style={{ maxHeight: 40 }}>
                <FormattedMessage id="VIEW" />
              </Button>
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Popover>
  );
}
