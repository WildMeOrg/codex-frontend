import React from 'react';
import { isValid } from 'date-fns';
import { FormattedMessage } from 'react-intl';

import Paper from '@material-ui/core/Paper';

import { formatDateCustom } from '../../utils/formatters';
import Text from '../Text';

function emphasized(chunk) {
  return (
    <Text
      component="strong"
      variant="body1"
      style={{ display: 'inline-block' }}
    >
      {chunk}
    </Text>
  );
}

export default function StartDateCard({ startDate, style }) {
  return (
    <Paper variant="outlined" style={{ padding: 4, ...style }}>
      <Text variant="caption" component="p" align="center">
        {isValid(new Date(startDate)) ? (
          <FormattedMessage
            id="PROGRESS_STATISTICS_STARTED_ON"
            values={{
              date: formatDateCustom(startDate, 'PPp'),
              focus: emphasized,
            }}
          />
        ) : (
          <FormattedMessage
            id="PROGRESS_STATISTICS_STARTED_ON_UNKNOWN"
            values={{ focus: emphasized }}
          />
        )}
      </Text>
    </Paper>
  );
}
