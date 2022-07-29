import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { formatDistance } from 'date-fns';

import Timeline from '@material-ui/lab/Timeline';
import ReportIcon from '@material-ui/icons/ArtTrack';
import PreparationIcon from '@material-ui/icons/FileCopy';
import DetectionIcon from '@material-ui/icons/Search';
import CurationIcon from '@material-ui/icons/LowPriority';
import IdentificationIcon from '@material-ui/icons/Visibility';

import { formatDate } from '../../../utils/formatters';
import Card from '../../../components/cards/Card';
import ButtonLink from '../../../components/ButtonLink';
import TimelineStep from './TimelineStep';
import stages from './stages';
import useSiteSettings from '../../../models/site/useSiteSettings';
import wildbookBySystemGuid from '../../../constants/wildbookBySystemGuid';

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

  if (failed) return stages.failed;

  if (complete) return stages.finished;

  return stages.waiting;
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function withNonWrappingSpan(chunk) {
  return <span style={{ whiteSpace: 'nowrap' }}>{chunk}</span>;
}

export default function StatusCard({ sightingData }) {
  const intl = useIntl();
  const systemGuid = get(useSiteSettings(), 'data.system_guid.value');
  const migratedSiteName = get(wildbookBySystemGuid, systemGuid);

  const assets = get(sightingData, 'assets', []);
  const assetCount = assets.length;
  const dateCreated = get(sightingData, 'submissionTime');
  const currentUserHasEditPermission = get(
    sightingData,
    'hasEdit',
    false,
  );

  const {
    preparation: preparationStep,
    detection: detectionStep,
    curation: curationStep,
    identification: identificationStep,
    migrated,
  } = sightingData?.pipeline_status || {};

  const {
    start: preparationStartTime,
    end: preparationEndTime,
    message: preparationMessage,
  } = preparationStep || {};

  const preparationStage = getStage(preparationStep);

  const {
    start: detectionStartTime,
    end: detectionEndTime,
    message: detectionMessage,
  } = detectionStep || {};

  const detectionStage = getStage(detectionStep);
  let detectionSkippedLabelId = 'DETECTION_SKIPPED_MESSAGE';
  if (assetCount === 0) {
    detectionSkippedLabelId = 'DETECTION_SKIPPED_NO_IMAGES_MESSAGE';
  } else if (
    get(sightingData, 'speciesDetectionModel[0]') === 'None'
  ) {
    detectionSkippedLabelId = 'DETECTION_SKIPPED_NO_MODEL_MESSAGE';
  }

  const {
    start: curationStartTime,
    end: curationEndTime,
    inProgress: isCurationInProgress,
    message: curationMessage,
  } = curationStep || {};

  const curationStage = getStage(curationStep);
  const someAssetsHaveAnnotations = assets.some(
    asset => get(asset, 'annotations.length', 0) > 0,
  );

  let curationFinishedLabel;
  if (migrated) {
    curationFinishedLabel = migratedSiteName
      ? intl.formatMessage(
          { id: 'MIGRATION_FINISHED_MESSAGE_SITE' },
          { date: getDateString(curationEndTime), migratedSiteName },
        )
      : intl.formatMessage(
          { id: 'MIGRATION_FINISHED_MESSAGE_DEFAULT' },
          { date: getDateString(curationEndTime) },
        );
  } else {
    curationFinishedLabel = intl.formatMessage(
      { id: 'CURATION_FINISHED_MESSAGE' },
      { date: getDateString(curationEndTime) },
    );
  }

  const {
    start: identificationStartTime,
    end: identificationEndTime,
    complete: isIdentificationComplete,
    message: identificationMessage,
  } = identificationStep || {};

  const identificationStage = getStage(identificationStep);
  let identificationSkippedLabel;
  if (migrated) {
    identificationSkippedLabel = migratedSiteName
      ? intl.formatMessage(
          { id: 'IDENTIFICATION_SKIPPED_MIGRATED_MESSAGE_SITE' },
          { migratedSiteName },
        )
      : intl.formatMessage({
          id: 'IDENTIFICATION_SKIPPED_MIGRATED_MESSAGE_DEFAULT',
        });
  } else if (assetCount === 0) {
    identificationSkippedLabel = intl.formatMessage({
      id: 'IDENTIFICATION_SKIPPED_NO_IMAGES_MESSAGE',
    });
  } else {
    identificationSkippedLabel = intl.formatMessage({
      id: 'IDENTIFICATION_SKIPPED_MESSAGE',
    });
  }

  return (
    <Card titleId="IDENTIFICATION_PIPELINE_STATUS">
      <Timeline>
        <TimelineStep
          Icon={ReportIcon}
          titleId="SIGHTING_SUBMISSION"
          stage={stages.finished}
          finishedText={intl.formatMessage(
            { id: 'SIGHTING_SUBMISSION_REPORT_DATE' },
            { date: getDateString(dateCreated) },
          )}
        />
        <TimelineStep
          Icon={PreparationIcon}
          titleId="SIGHTING_PREPARATION"
          stage={preparationStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(intl, preparationStartTime)}
          finishedText={intl.formatMessage(
            { id: 'SIGHTING_PREPARATION_FINISHED_MESSAGE' },
            {
              photoCount: assetCount,
              date: getDateString(preparationEndTime),
              nonWrapping: withNonWrappingSpan,
            },
          )}
          skippedText={intl.formatMessage({
            id: 'SIGHTING_PREPARATION_SKIPPED_MESSAGE',
          })}
          failedText={intl.formatMessage({
            id: 'SIGHTING_PREPARATION_FAILED',
          })}
          failedAlertDescription={preparationMessage}
        />
        <TimelineStep
          Icon={DetectionIcon}
          titleId="ANIMAL_DETECTION"
          stage={detectionStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={getProgressText(intl, detectionStartTime)}
          finishedText={intl.formatMessage(
            { id: 'DETECTION_FINISHED_MESSAGE' },
            { date: getDateString(detectionEndTime) },
          )}
          skippedText={intl.formatMessage({
            id: detectionSkippedLabelId,
          })}
          failedText={intl.formatMessage({ id: 'DETECTION_FAILED' })}
          failedAlertDescription={detectionMessage}
        />
        <TimelineStep
          Icon={CurationIcon}
          titleId="SIGHTING_CURATION"
          stage={curationStage}
          notStartedText={intl.formatMessage({
            id: 'WAITING_ELLIPSES',
          })}
          inProgressText={
            currentUserHasEditPermission
              ? intl.formatMessage({ id: 'CURATION_INSTRUCTIONS' })
              : getProgressText(intl, curationStartTime)
          }
          finishedText={curationFinishedLabel}
          skippedText={intl.formatMessage({
            id: 'CURATION_SKIPPED_MESSAGE',
          })}
          failedText={intl.formatMessage({ id: 'CURATION_FAILED' })}
          failedAlertDescription={curationMessage}
        >
          {isCurationInProgress && currentUserHasEditPermission && (
            <div style={{ marginTop: 4, marginBottom: 20 }}>
              <ButtonLink
                id={
                  someAssetsHaveAnnotations
                    ? 'CURATION_ASSIGN_ANNOTATIONS'
                    : 'CURATION_ANNOTATE_PHOTOS'
                }
                href={
                  someAssetsHaveAnnotations
                    ? '#individuals'
                    : '#photographs'
                }
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
          finishedText={intl.formatMessage(
            { id: 'IDENTIFICATION_FINISHED_MESSAGE' },
            { date: getDateString(identificationEndTime) },
          )}
          skippedText={identificationSkippedLabel}
          failedText={intl.formatMessage({
            id: 'IDENTIFICATION_FAILED',
          })}
          failedAlertDescription={identificationMessage}
        >
          {isIdentificationComplete && (
            <div style={{ marginTop: 4 }}>
              <ButtonLink
                id="IDENTIFICATION_VIEW_RESULTS"
                href={`/match-results/${sightingData?.guid}`}
                display="panel"
                size="small"
              />
            </div>
          )}
        </TimelineStep>
      </Timeline>
    </Card>
  );
}
