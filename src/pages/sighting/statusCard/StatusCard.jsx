import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { formatDistance } from 'date-fns';

import Timeline from '@material-ui/lab/Timeline';
import ReportIcon from '@material-ui/icons/ArtTrack';
import ImageProcessingIcon from '@material-ui/icons/Image';
import DetectionIcon from '@material-ui/icons/Search';
import CurationIcon from '@material-ui/icons/LowPriority';
import IdentificationIcon from '@material-ui/icons/Visibility';

import { formatDate } from '../../../utils/formatters';
import Card from '../../../components/cards/Card';
import ButtonLink from '../../../components/ButtonLink';
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

function scrollToTop() {
  window.scrollTo(0, 0);
}

export default function StatusCard({ sightingData }) {
  const intl = useIntl();

  const photoCount = get(sightingData, ['assets', 'length'], 0);
  const dateCreated = get(sightingData, 'createdHouston');
  const hasEditPermission = get(sightingData, 'hasEdit', false);

  const {
    preparation: imageProcessingStep,
    detection: detectionStep,
    curation: curationStep,
    identification: identificationStep,
  } = sightingData?.pipeline_status || {};

  const {
    start: imageProcessingStartTime,
    end: imageProcessingEndTime,
  } = imageProcessingStep || {};

  const imageProcessingStage = getStage(imageProcessingStep);

  const { start: detectionStartTime, end: detectionEndTime } =
    detectionStep || {};

  const detectionStage = getStage(detectionStep);

  const {
    start: curationStartTime,
    end: curationEndTime,
    inProgress: isCurationInProgress,
  } = curationStep || {};

  const curationStage = getStage(curationStep);

  const {
    start: identificationStartTime,
    end: identificationEndTime,
    complete: isIdentificationComplete,
    failed: isIdentificationFailed,
  } = identificationStep || {};

  const identificationStage = getStage(identificationStep);

  return (
    <Card titleId="IDENTIFICATION_PIPELINE_STATUS" maxHeight={900}>
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
          Icon={ImageProcessingIcon}
          titleId="IMAGE_PROCESSING"
          stage={imageProcessingStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(
            intl,
            imageProcessingStartTime,
          )}
          finishedText={`Image processing finished on ${getDateString(
            imageProcessingEndTime,
          )}.`}
          skippedText={intl.formatMessage({
            id: 'IMAGE_PROCESSING_SKIPPED_MESSAGE',
          })}
          failedText={intl.formatMessage({
            id: 'IMAGE_PROCESSING_FAILED',
          })}
        />
        <TimelineStep
          Icon={DetectionIcon}
          titleId="ANIMAL_DETECTION"
          stage={detectionStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(intl, detectionStartTime)}
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
          inProgressText={
            hasEditPermission
              ? intl.formatMessage({ id: 'CURATION_INSTRUCTIONS' })
              : getProgressText(intl, curationStartTime)
          }
          finishedText={`Curation finished on ${getDateString(
            curationEndTime,
          )}.`}
          skippedText={intl.formatMessage({
            id: 'CURATION_SKIPPED_MESSAGE',
          })}
          failedText={intl.formatMessage({ id: 'CURATION_FAILED' })}
        >
          {isCurationInProgress && hasEditPermission && (
            <div style={{ marginTop: 4, marginBottom: 20 }}>
              <ButtonLink
                id="CURATION_ASSIGN_ANNOTATIONS"
                href="#individuals"
                display="primary"
                size="small"
                onClick={scrollToTop}
              />
            </div>
          )}
        </TimelineStep>
        <TimelineStep
          Icon={IdentificationIcon}
          titleId="IDENTIFICATION"
          stage={identificationStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(
            intl,
            identificationStartTime,
          )}
          finishedText={`Identification finished on ${getDateString(
            identificationEndTime,
          )}.`}
          skippedText={intl.formatMessage({
            id: 'IDENTIFICATION_SKIPPED_MESSAGE',
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
