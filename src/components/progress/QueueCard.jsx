import React from 'react';
import { isFinite } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

import Paper from '@material-ui/core/Paper';

import Text from '../Text';

function emphasizedH4(chunk) {
  return (
    <Text component="strong" variant="h4">
      {chunk}
    </Text>
  );
}

function emphasizedH5(chunk) {
  return (
    <Text component="strong" variant="h5">
      {chunk}
    </Text>
  );
}

export default function QueueCard({ ahead }) {
  return (
    <Paper variant="outlined" style={{ padding: 4 }}>
      <Text
        variant="caption"
        component="p"
        align="center"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'pre-wrap',
        }}
      >
        {isFinite(ahead) ? (
          <FormattedMessage
            id="PROGRESS_STATISTICS_QUEUE_POSITION_X"
            values={{ ahead, focus: emphasizedH4 }}
          />
        ) : (
          <FormattedMessage
            id="PROGRESS_STATISTICS_QUEUE_POSITION_UNKNOWN"
            values={{ focus: emphasizedH5 }}
          />
        )}
      </Text>
    </Paper>
  );
}
