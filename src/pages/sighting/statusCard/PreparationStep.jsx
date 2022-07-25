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
              { id: 'SIGHTING_PREPARATION_STARTED_ON_MESSAGE' },
              { date: formattedStart },
            )
          : intl.formatMessage({
              id: 'SIGHTING_PREPARATION_STARTED_ON_UNKNOWN_MESSAGE',
            })
      }
      finishedText={
        formattedEnd
          ? intl.formatMessage(
              { id: 'SIGHTING_PREPARATION_FINISHED_MESSAGE' },
              {
                photoCount: assetCount,
                date: formattedEnd,
                nonWrapping: withNonWrappingSpan,
              },
            )
          : intl.formatMessage(
              { id: 'SIGHTING_PREPARATION_FINISHED_MESSAGE_UNKNOWN' },
              {
                photoCount: assetCount,
                nonWrapping: withNonWrappingSpan,
              },
            )
      }
      skippedText={intl.formatMessage({
        id: 'SIGHTING_PREPARATION_SKIPPED_MESSAGE',
      })}
      failedText={intl.formatMessage({
        id: 'SIGHTING_PREPARATION_FAILED',
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
