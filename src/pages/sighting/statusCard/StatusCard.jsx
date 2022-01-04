import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { formatDistance } from 'date-fns';

import Timeline from '@material-ui/lab/Timeline';
import ReportIcon from '@material-ui/icons/ArtTrack';
import DetectionIcon from '@material-ui/icons/Search';
import CurationIcon from '@material-ui/icons/LowPriority';
import MatchingIcon from '@material-ui/icons/Visibility';

import { formatDate } from '../../../utils/formatters';
import Card from '../../../components/cards/Card';
import TimelineStep from './TimelineStep';
import stages from './stages';

function getDateString(date) {
  return date ? formatDate(date, true) : 'unknown date';
}

function getProgressText(intl, startDate) {
  let timeDelta = '';
  const currentTime = new Date();
  const startTime = new Date(startDate);
  try {
    timeDelta = formatDistance(currentTime, startTime);
  } catch (error) {
    console.error(error);
  }

  if (!startDate || !timeDelta)
    return intl.formatMessage({ id: 'IN_PROGRESS' });
  return intl.formatMessage(
    {
      id: 'SIGHTING_STATE_IN_PROGRESS',
    },
    { timeDelta },
  );
}

export default function StatusCard({ sightingData }) {
  const intl = useIntl();

  const photoCount = get(sightingData, ['assets', 'length'], 0);
  const dateCreated = get(sightingData, 'createdHouston');

  const detectionComplete =
    get(sightingData, 'stage') !== 'detection';
  const curationComplete =
    detectionComplete && get(sightingData, 'stage') !== 'curation';
  const matchingComplete =
    curationComplete && get(sightingData, 'stage') !== 'un_reviewed';

  const detectionStartTime = get(
    sightingData,
    'detection_start_time',
  );
  const curationStartTime = get(sightingData, 'curation_start_time');
  const matchingStartTime = get(
    sightingData,
    'identification_start_time',
  );

  let detectionStage = stages.waiting;
  let curationStage = stages.waiting;
  let matchingStage = stages.waiting;

  if (detectionStartTime) detectionStage = stages.current;
  if (curationStartTime) {
    detectionStage = stages.finished;
    curationStage = stages.current;
  }
  if (matchingStartTime) {
    curationStage = stages.finished;
    matchingStage = stages.current;
  }
  if (matchingComplete) matchingStage = stages.finished;

  if (photoCount === 0) {
    detectionStage = stages.skipped;
    curationStage = stages.skipped;
    matchingStage = stages.skipped;
  }

  return (
    <Card titleId="IDENTIFICATION_PIPELINE_STATUS">
      <Timeline>
        <TimelineStep
          Icon={ReportIcon}
          titleId="SIGHTING_SUBMISSION"
          stage="finished"
          finishedText={intl.formatMessage(
            {
              id:
                photoCount > 0
                  ? 'SIGHTING_CREATED_WITH_ASSETS_DESCRIPTION'
                  : 'SIGHTING_CREATED_NO_ASSETS_DESCRIPTION',
            },
            {
              photoCount,
              date: getDateString(dateCreated),
            },
          )}
        />
        <TimelineStep
          Icon={DetectionIcon}
          titleId="ANIMAL_DETECTION"
          stage={detectionStage}
          inProgressText={getProgressText(intl, detectionStartTime)}
          finishedText={`Detection finished on ${getDateString(
            curationStartTime,
          )}.`}
          skippedText={intl.formatMessage({
            id: 'DETECTION_SKIPPED_MESSAGE',
          })}
        />
        <TimelineStep
          Icon={CurationIcon}
          titleId="SIGHTING_CURATION"
          stage={curationStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(intl, curationStartTime)}
          finishedText={`Curation finished on ${getDateString(
            matchingStartTime,
          )}.`}
          skippedText={intl.formatMessage({
            id: 'CURATION_SKIPPED_MESSAGE',
          })}
        />
        <TimelineStep
          Icon={MatchingIcon}
          titleId="MATCHING"
          stage={matchingStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(intl, matchingStartTime)}
          finishedText="Matching finished"
          skippedText={intl.formatMessage({
            id: 'MATCHING_SKIPPED_MESSAGE',
          })}
        />
      </Timeline>
    </Card>
  );
}
