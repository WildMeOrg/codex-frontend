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
import ButtonLink from '../../../components/ButtonLink';
import TimelineStep from './TimelineStep';
import stages from './stages';

function getDateString(date) {
  return date ? formatDate(date, true) : 'unknown date';
}

function getProgressText(intl, startDate, currentDate) {
  let timeDelta = '';
  const currentTime = new Date(currentDate);
  const startTime = new Date(startDate);
  try {
    timeDelta = formatDistance(currentTime, startTime);
  } catch (error) {
    console.error(error);
  }

  if (!startDate || !currentDate || !timeDelta)
    return intl.formatMessage({ id: 'IN_PROGRESS' });
  return intl.formatMessage(
    {
      id: 'SIGHTING_STATE_IN_PROGRESS',
    },
    { timeDelta },
  );
}

function getStage(pipelineStep) {
  const { skipped, inProgress, complete, failed } =
    pipelineStep || {};

  if (skipped) return stages.skipped;

  if (inProgress) return stages.current;

  if (complete) {
    if (failed) return stages.failed;
    return stages.finished;
  }

  return stages.waiting;
}

export default function StatusCard({ sightingData }) {
  const intl = useIntl();

  const photoCount = get(sightingData, ['assets', 'length'], 0);
  const dateCreated = get(sightingData, 'createdHouston');

  const {
    now,
    detection: detectionStep,
    curation: curationStep,
    identification: identificationStep,
  } = sightingData?.pipeline_status || {};

  const { start: detectionStartTime, end: detectionEndTime } =
    detectionStep || {};

  const detectionStage = getStage(detectionStep);

  const { start: curationStartTime, end: curationEndTime } =
    curationStep || {};

  const curationStage = getStage(curationStep);

  const {
    start: identificationStartTime,
    end: identificationEndTime,
    complete: isIdentificationComplete,
    failed: isIdentificationFailed,
  } = identificationStep || {};

  const identificationStage = getStage(identificationStep);

  return (
    <Card titleId="IDENTIFICATION_PIPELINE_STATUS" maxHeight={500}>
      <Timeline>
        <TimelineStep
          Icon={ReportIcon}
          titleId="SIGHTING_SUBMISSION"
          stage={stages.finished}
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
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(
            intl,
            detectionStartTime,
            now,
          )}
          finishedText={`Detection finished on ${getDateString(
            detectionEndTime,
          )}.`}
          skippedText={intl.formatMessage({
            id: 'DETECTION_SKIPPED_MESSAGE',
          })}
          failedText={intl.formatMessage({ id: 'DETECTION_FAILED' })}
        />
        <TimelineStep
          Icon={CurationIcon}
          titleId="SIGHTING_CURATION"
          stage={curationStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(
            intl,
            curationStartTime,
            now,
          )}
          finishedText={`Curation finished on ${getDateString(
            curationEndTime,
          )}.`}
          skippedText={intl.formatMessage({
            id: 'CURATION_SKIPPED_MESSAGE',
          })}
          failedText={intl.formatMessage({ id: 'CURATION_FAILED' })}
        />
        <TimelineStep
          Icon={MatchingIcon}
          titleId="MATCHING"
          stage={identificationStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(
            intl,
            identificationStartTime,
            now,
          )}
          finishedText={`Matching finished on ${getDateString(
            identificationEndTime,
          )}.`}
          skippedText={intl.formatMessage({
            id: 'MATCHING_SKIPPED_MESSAGE',
          })}
          failedText={intl.formatMessage({
            id: 'IDENTIFICATION_FAILED',
          })}
        >
          {isIdentificationComplete && !isIdentificationFailed && (
            <div style={{ marginTop: 4 }}>
              <ButtonLink
                href={`/match-results/${sightingData?.guid}`}
                display="panel"
                size="small"
              >
                View match results
              </ButtonLink>
            </div>
          )}
        </TimelineStep>
      </Timeline>
    </Card>
  );
}
