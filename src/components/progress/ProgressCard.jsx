import React from 'react';
import { isFinite } from 'lodash-es';
import { FormattedNumber } from 'react-intl';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

import Text from '../Text';

export default function ProgressCard({ progress, style }) {
  const isProgressFinite = isFinite(progress);
  const progressPercentage = isProgressFinite ? progress * 100 : 0;

  return (
    <Paper variant="outlined" style={{ padding: 4, ...style }}>
      <div
        style={{
          display: 'flex',
          flexWrap: isProgressFinite ? 'nowrap' : 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            minWidth: 20,
            paddingRight: 4,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            style={{ height: 8 }}
          />
        </div>
        {isProgressFinite ? (
          <Text variant="h4" component="p" style={{ width: '8rem' }}>
            <FormattedNumber value={progress} style="percent" />
          </Text>
        ) : (
          <Text
            variant="h5"
            component="p"
            align="center"
            id="PROGRESS_STATISTICS_PROGRESS_UNKNOWN"
          />
        )}
      </div>
    </Paper>
  );
}
