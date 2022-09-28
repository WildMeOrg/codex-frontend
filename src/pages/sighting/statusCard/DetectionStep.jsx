import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import DetectionIcon from '@material-ui/icons/Search';

import { getProgress } from '../../../utils/pipelineStatusUtils';
import ProgressMetrics from '../../../components/progress/ProgressMetrics';
import TimelineStep from './TimelineStep';
import {
  getDateString,
  getDateTimeString,
  getStage,
} from './statusCardUtils';

export default function DetectionStep({ sightingData }) {
  const intl = useIntl();

  const assetCount = get(sightingData, 'assets.length');

  const detectionState = get(
    sightingData,
    'pipeline_status.detection',
    {},
  );

  const {
    start,
    end,
    inProgress: isInProgress,
    message,
  } = detectionState;

  const stage = getStage(detectionState);
  let skippedLabelId = 'STATUS_DETECTION_SKIPPED';
  if (assetCount === 0) {
    skippedLabelId = 'STATUS_DETECTION_SKIPPED_NO_IMAGES';
  } else if (
    get(sightingData, 'speciesDetectionModel[0]') === 'None'
  ) {
    skippedLabelId = 'STATUS_DETECTION_SKIPPED_NO_MODEL';
  }

  const formattedStart = getDateTimeString(start);
  const formattedEnd = getDateString(end);

  return (
    <TimelineStep
      Icon={DetectionIcon}
      titleId="ANIMAL_DETECTION"
      stage={stage}
      notStartedText={intl.formatMessage({
        id: 'WAITING_ELLIPSES',
      })}
      inProgressText={
        formattedStart
          ? intl.formatMessage(
              { id: 'STATUS_DETECTION_STARTED_ON' },
              { date: formattedStart },
            )
          : intl.formatMessage({
              id: 'STATUS_DETECTION_STARTED_ON_UNKNOWN',
            })
      }
      finishedText={
        formattedEnd
          ? intl.formatMessage(
              { id: 'STATUS_DETECTION_FINISHED_ON' },
              { date: formattedEnd },
            )
          : intl.formatMessage({
              id: 'STATUS_DETECTION_FINISHED_ON_UNKNOWN',
            })
      }
      skippedText={intl.formatMessage({
        id: skippedLabelId,
      })}
      failedText={intl.formatMessage({
        id: 'STATUS_DETECTION_FAILED',
      })}
      failedAlertDescription={message}
    >
      {isInProgress && (
        <ProgressMetrics
          progress={getProgress(detectionState)}
          style={{ marginTop: 20 }}
        />
      )}
    </TimelineStep>
  );
}
