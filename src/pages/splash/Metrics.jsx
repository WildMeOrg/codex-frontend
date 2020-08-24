import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import UsersIcon from '@material-ui/icons/People';
import SightingsIcon from '@material-ui/icons/PhotoCamera';
import IndividualsIcon from '@material-ui/icons/Fingerprint';

const metrics = [
  {
    label: 'Identified whale sharks',
    count: 257,
    icon: IndividualsIcon,
  },
  {
    label: 'Reported sightings',
    count: 810,
    icon: SightingsIcon,
  },
  {
    label: 'Users',
    count: 951,
    icon: UsersIcon,
  },
];

export default function Testimonial() {
  const themeColor = '#00fff7';

  return (
    <Grid
      container
      justify="space-around"
      style={{
        width: '100vw',
        padding: '0 20px',
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      {metrics.map(metric => (
        <Grid item style={{ display: 'flex', margin: '20px 0' }}>
          <metric.icon
            style={{ fontSize: '3rem', marginRight: 12 }}
          />
          <div>
            <Typography
              style={{ color: themeColor, fontWeight: 'bold' }}
            >
              {metric.count}
            </Typography>
            <Typography
              variant="subtitle2"
              style={{ textTransform: 'uppercase' }}
            >
              {metric.label}
            </Typography>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
