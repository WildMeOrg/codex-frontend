import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import UsersIcon from '@material-ui/icons/People';
import SightingsIcon from '@material-ui/icons/PhotoCamera';
import IndividualsIcon from '@material-ui/icons/Fingerprint';

const metrics = [
  {
    labelId: 'IDENTIFIED_INDIVIDUALS',
    count: 257,
    icon: IndividualsIcon,
  },
  {
    labelId: 'REPORTED_SIGHTINGS',
    count: 810,
    icon: SightingsIcon,
  },
  {
    labelId: 'USERS',
    count: 951,
    icon: UsersIcon,
  },
];

export default function Testimonial() {
  const theme = useTheme();

  return (
    <Grid
      container
      justify="space-around"
      style={{
        width: '100vw',
        padding: '0 20px',
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      }}
    >
      {metrics.map(metric => (
        <Grid item style={{ display: 'flex', margin: '20px 0' }}>
          <metric.icon
            style={{ fontSize: '3rem', marginRight: 12 }}
          />
          <div>
            <Typography
              style={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
              }}
            >
              {metric.count}
            </Typography>
            <Typography
              variant="subtitle2"
              style={{ textTransform: 'uppercase' }}
            >
              <FormattedMessage id={metric.labelId} />
            </Typography>
          </div>
        </Grid>
      ))}
    </Grid>
  );
}
