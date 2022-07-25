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
  let skippedLabelId = 'DETECTION_SKIPPED_MESSAGE';
  if (assetCount === 0) {
    skippedLabelId = 'DETECTION_SKIPPED_NO_IMAGES_MESSAGE';
  } else if (
    get(sightingData, 'speciesDetectionModel[0]') === 'None'
  ) {
    skippedLabelId = 'DETECTION_SKIPPED_NO_MODEL_MESSAGE';
  }

  const formattedStart = getDateTimeString(start);

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
              { id: 'DETECTION_STARTED_ON_MESSAGE' },
              { date: formattedStart },
            )
          : intl.formatMessage({
              id: 'DETECTION_STARTED_ON_UNKNOWN_MESSAGE',
            })
      }
      finishedText={intl.formatMessage(
        { id: 'DETECTION_FINISHED_MESSAGE' },
        { date: getDateString(end) },
      )}
      skippedText={intl.formatMessage({
        id: skippedLabelId,
      })}
      failedText={intl.formatMessage({ id: 'DETECTION_FAILED' })}
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
