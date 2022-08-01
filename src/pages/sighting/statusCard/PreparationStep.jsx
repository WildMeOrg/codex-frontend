import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import PreparationIcon from '@material-ui/icons/FileCopy';

import { getProgress } from '../../../utils/pipelineStatusUtils';
import ProgressMetrics from '../../../components/progress/ProgressMetrics';
import TimelineStep from './TimelineStep';
import {
  getDateString,
  getDateTimeString,
  getStage,
} from './statusCardUtils';

function withNonWrappingSpan(chunk) {
  return <span style={{ whiteSpace: 'nowrap' }}>{chunk}</span>;
}

export default function PreparationStep({ sightingData }) {
  const intl = useIntl();

  const assetCount = get(sightingData, 'assets.length');

  const preparationState = get(
    sightingData,
    'pipeline_status.preparation',
    {},
  );

  const {
    start,
    end,
    inProgress: isInProgress,
    message,
  } = preparationState;

  const stage = getStage(preparationState);

  const formattedStart = getDateTimeString(start);
  const formattedEnd = getDateString(end);

  return (
    <TimelineStep
      Icon={PreparationIcon}
      titleId="SIGHTING_PREPARATION"
      stage={stage}
      notStartedText={intl.formatMessage({
        id: 'WAITING_ELLIPSES',
      })}
      inProgressText={
        formattedStart
          ? intl.formatMessage(
              { id: 'STATUS_PREPARATION_STARTED_ON' },
              { date: formattedStart },
            )
          : intl.formatMessage({
              id: 'STATUS_PREPARATION_STARTED_ON_UNKNOWN',
            })
      }
      finishedText={
        formattedEnd
          ? intl.formatMessage(
              { id: 'STATUS_PREPARATION_FINISHED_ON' },
              {
                photoCount: assetCount,
                date: formattedEnd,
                nonWrapping: withNonWrappingSpan,
              },
            )
          : intl.formatMessage(
              { id: 'STATUS_PREPARATION_FINISHED_ON_UNKNOWN' },
              {
                photoCount: assetCount,
                nonWrapping: withNonWrappingSpan,
              },
            )
      }
      skippedText={intl.formatMessage({
        id: 'STATUS_PREPARATION_SKIPPED',
      })}
      failedText={intl.formatMessage({
        id: 'STATUS_PREPARATION_FAILED',
      })}
      failedAlertDescription={message}
    >
      {isInProgress && (
        <ProgressMetrics
          progress={getProgress(preparationState)}
          style={{ marginTop: 20 }}
        />
      )}
    </TimelineStep>
  );
}
