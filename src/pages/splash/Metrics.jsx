import React from 'react';
import { FormattedNumber } from 'react-intl';
import { isNil } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import UsersIcon from '@material-ui/icons/People';
import SightingsIcon from '@material-ui/icons/PhotoCamera';
import IndividualsIcon from '@material-ui/icons/Fingerprint';

import Text from '../../components/Text';
import usePublicData from '../../models/site/usePublicData';

function getMetrics(data) {
  const {
    num_sightings: numSightings,
    num_pending_sightings: numPendingSightings,
  } = data || {};

  let numReportedSightings;
  if (!isNil(numSightings)) {
    numReportedSightings = isNil(numPendingSightings)
      ? numSightings
      : numSightings + numPendingSightings;
  } else if (!isNil(numPendingSightings)) {
    numReportedSightings = numPendingSightings;
  }

  return [
    {
      labelId: 'IDENTIFIED_INDIVIDUALS',
      count: data?.num_individuals,
      icon: IndividualsIcon,
    },
    {
      labelId: 'REPORTED_SIGHTINGS',
      count: numReportedSightings,
      icon: SightingsIcon,
    },
    {
      labelId: 'USERS',
      count: data?.num_users,
      icon: UsersIcon,
    },
  ];
}

export default function Metrics() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { data } = usePublicData();
  const metrics = getMetrics(data);

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
        justifyContent="space-around"
        direction={isSm ? 'column' : 'row'}
        style={{
          width: '100vw',
          padding: '0 20px',
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        }}
      >
        {metrics
          .filter(metric => !isNil(metric.count))
          .map(metric => (
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
                style={{ fontSize: 52, marginRight: isSm ? 0 : 12 }}
              />
              <div style={{ textAlign: isSm ? 'center' : 'unset' }}>
                <Text
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    fontSize: isSm ? '1.8rem' : '1.2rem',
                  }}
                >
                  <FormattedNumber value={metric.count} />
                </Text>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                  id={metric.labelId}
                />
              </div>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
