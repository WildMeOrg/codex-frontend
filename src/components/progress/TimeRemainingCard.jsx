import React from 'react';
import { isFinite } from 'lodash-es';
import {
  formatDuration,
  intervalToDuration,
  secondsToMilliseconds,
} from 'date-fns';

import Paper from '@material-ui/core/Paper';

import Text from '../Text';

// timeRemaining is in fractional seconds.
export default function TimeRemainingCard({ timeRemaining }) {
  const intlProps = {
    id: 'PROGRESS_STATISTICS_TIME_REMAINING_UNKNOWN',
  };

  if (isFinite(timeRemaining)) {
    if (timeRemaining < 1) {
      intlProps.id = 'PROGRESS_STATISTICS_TIME_REMAINING_WRAPPING_UP';
    } else {
      intlProps.id = 'PROGRESS_STATISTICS_TIME_REMAINING';

      const interval = {
        start: 0,
        end: secondsToMilliseconds(timeRemaining),
      };
      const duration = intervalToDuration(interval);

      intlProps.values = { timeRemaining: formatDuration(duration) };
    }
  }

  return (
    <Paper variant="outlined" style={{ padding: 4 }}>
      <Text
        variant="caption"
        component="p"
        align="center"
        {...intlProps}
      />
    </Paper>
  );
}
