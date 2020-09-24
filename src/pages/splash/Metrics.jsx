import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      style={{
        marginTop: 40,
        padding: '40px 0',
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <Grid
        container
        justify="space-around"
        direction={isSm ? 'column' : 'row'}
        style={{
          width: '100vw',
          padding: '0 20px',
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        }}
      >
        {metrics.map(metric => (
          <Grid
            item
            style={{
              display: 'flex',
              margin: '32px 0',
              flexDirection: isSm ? 'column' : 'row',
              alignItems: 'center',
            }}
          >
            <metric.icon
              style={{ fontSize: '4rem', marginRight: isSm ? 0 : 12 }}
            />
            <div style={{ textAlign: isSm ? 'center' : 'unset' }}>
              <Typography
                style={{
                  color: theme.palette.primary.main,
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  fontSize: isSm ? '1.8rem' : '1.2rem',
                }}
              >
                {metric.count}
              </Typography>
              <Typography
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                <FormattedMessage id={metric.labelId} />
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
