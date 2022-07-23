import React from 'react';
import { isFinite, round } from 'lodash-es';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  formatDuration,
  intervalToDuration,
  secondsToMilliseconds,
} from 'date-fns';

import LinearProgress from '@material-ui/core/LinearProgress';

import Text from '../Text';

function getSubtitleIntlProps({ ahead, eta }) {
  const isAheadValid = isFinite(ahead);
  const isEtaValid = isFinite(eta);
  const isEtaLessThanOne = isEtaValid && eta < 1;

  if (!isEtaValid && !isAheadValid) {
    return { id: 'PROGRESS_STATISTICS_UNKNOWN_ETA_&_UNKNOWN_QUEUE' };
  }

  if (!isEtaValid && isAheadValid) {
    return {
      id: 'PROGRESS_STATISTICS_UNKNOWN_ETA_&_QUEUE',
      values: { ahead },
    };
  }

  if (isEtaLessThanOne && !isAheadValid) {
    return { id: 'PROGRESS_STATISTICS_WRAPPING_ETA_&_UNKNOWN_QUEUE' };
  }

  if (isEtaLessThanOne && isAheadValid) {
    return {
      id: 'PROGRESS_STATISTICS_WRAPPING_ETA_&_QUEUE',
      values: { ahead },
    };
  }

  const interval = {
    start: 0,
    end: secondsToMilliseconds(eta),
  };
  const duration = intervalToDuration(interval);
  const timeRemaining = formatDuration(duration);

  if (!isAheadValid) {
    return {
      id: 'PROGRESS_STATISTICS_ETA_&_UNKNOWN_QUEUE',
      values: { timeRemaining },
    };
  }

  return {
    id: 'PROGRESS_STATISTICS_ETA_&_QUEUE',
    values: { ahead, timeRemaining },
  };
}

export default function ProgressMetrics({
  progress: progressObj,
  style,
}) {
  const { ahead, eta, progress } = progressObj || {};

  const isProgressValid = isFinite(progress);
  const roundedProgress = isProgressValid ? round(progress, 2) : null;

  const subtitleIntlProps = getSubtitleIntlProps({ ahead, eta });

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            minWidth: 20,
            paddingRight: 8,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={roundedProgress ? roundedProgress * 100 : 0}
          />
        </div>
        <Text
          variant="caption"
          component="p"
          style={{ minWidth: '2.5rem', flexShrink: 0 }}
        >
          {isProgressValid ? (
            <FormattedNumber
              value={roundedProgress}
              style="percent"
            />
          ) : (
            <FormattedMessage id="PROGRESS_STATISTICS_UNKNOWN_PROGRESS" />
          )}
        </Text>
      </div>
      <Text
        variant="subtitle2"
        component="p"
        style={{ marginTop: 4 }}
        {...subtitleIntlProps}
      />
    </div>
  );
}
