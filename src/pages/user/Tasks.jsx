import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '../../components/Button';
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

export default function Tasks() {
  return (
    <div style={{ margin: 12 }}>
      <Typography variant="subtitle1">
        <FormattedMessage id="RECENT_NOTIFICATIONS" />
      </Typography>
      <Grid container>
        {fakeData.map(task => (
          <Grid
            item
            style={{
              display: 'flex',
              padding: 12,
              margin: 4,
              border: '1px solid rgba(0,0,0,0.12)',
              width: 'max-content',
            }}
          >
            <div style={{ display: 'flex' }}>
              <Avatar
                src={task.userAvatar || task.ecologicalAvatar}
                variant={task.ecologicalAvatar ? 'square' : 'circle'}
              />
              <Typography style={{ maxWidth: 200, margin: '0 20px' }}>
                {task.name}
              </Typography>
            </div>
            <Button style={{ maxHeight: 40 }}>
              <FormattedMessage id="VIEW" />
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
