import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import IdentificationIcon from '@material-ui/icons/Visibility';

import { getProgress } from '../../../utils/pipelineStatusUtils';
import ButtonLink from '../../../components/ButtonLink';
import ProgressMetrics from '../../../components/progress/ProgressMetrics';
import TimelineStep from './TimelineStep';
import {
  getDateString,
  getDateTimeString,
  getStage,
} from './statusCardUtils';
import useSiteSettings from '../../../models/site/useSiteSettings';
import wildbookBySystemGuid from '../../../constants/wildbookBySystemGuid';

export default function IdentificationStep({ sightingData }) {
  const intl = useIntl();
  const systemGuid = get(useSiteSettings(), 'data.system_guid.value');
  const migratedSiteName = get(wildbookBySystemGuid, systemGuid);

  const assetCount = get(sightingData, 'assets.length');

  const { identification: identificationState, migrated } =
    sightingData?.pipeline_status || {};

  const {
    start,
    end,
    inProgress: isInProgress,
    complete: isComplete,
    message,
  } = identificationState || {};

  const stage = getStage(identificationState);
  let skippedLabel;
  if (migrated) {
    skippedLabel = migratedSiteName
      ? intl.formatMessage(
          { id: 'STATUS_IDENTIFICATION_SKIPPED_MIGRATED_FROM_SITE' },
          { migratedSiteName },
        )
      : intl.formatMessage({
          id: 'STATUS_IDENTIFICATION_SKIPPED_MIGRATED_FROM_UNKNOWN_SITE',
        });
  } else if (assetCount === 0) {
    skippedLabel = intl.formatMessage({
      id: 'STATUS_IDENTIFICATION_SKIPPED_NO_IMAGES',
    });
  } else {
    skippedLabel = intl.formatMessage({
      id: 'STATUS_IDENTIFICATION_SKIPPED',
    });
  }

  const formattedStart = getDateTimeString(start);
  const formattedEnd = getDateString(end);

  return (
    <TimelineStep
      Icon={IdentificationIcon}
      titleId="IDENTIFICATION"
      stage={stage}
      notStartedText={intl.formatMessage({
        id: 'WAITING_ELLIPSES',
      })}
      inProgressText={
        formattedStart
          ? intl.formatMessage(
              { id: 'STATUS_IDENTIFICATION_STARTED_ON' },
              { date: formattedStart },
            )
          : intl.formatMessage({
              id: 'STATUS_IDENTIFICATION_STARTED_ON_UNKNOWN',
            })
      }
      finishedText={
        formattedEnd
          ? intl.formatMessage(
              { id: 'STATUS_IDENTIFICATION_FINISHED_ON' },
              { date: formattedEnd },
            )
          : intl.formatMessage({
              id: 'STATUS_IDENTIFICATION_FINISHED_ON_UNKNOWN',
            })
      }
      skippedText={skippedLabel}
      failedText={intl.formatMessage({
        id: 'STATUS_IDENTIFICATION_FAILED',
      })}
      failedAlertDescription={message}
    >
      {isInProgress && (
        <ProgressMetrics
          progress={getProgress(identificationState)}
          style={{ marginTop: 20 }}
        />
      )}
      {isComplete && (
        <div style={{ marginTop: 4 }}>
          <ButtonLink
            id="STATUS_IDENTIFICATION_FINISHED_VIEW_RESULTS"
            href={`/match-results/${sightingData?.guid}`}
            display="panel"
            size="small"
          />
        </div>
      )}
    </TimelineStep>
  );
}
