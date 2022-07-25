import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import CurationIcon from '@material-ui/icons/LowPriority';

import ButtonLink from '../../../components/ButtonLink';
import TimelineStep from './TimelineStep';
import { getDateString, getStage } from './statusCardUtils';
import useSiteSettings from '../../../models/site/useSiteSettings';
import wildbookBySystemGuid from '../../../constants/wildbookBySystemGuid';

function scrollToTop() {
  window.scrollTo(0, 0);
}

export default function CurationStep({ sightingData }) {
  const intl = useIntl();
  const systemGuid = get(useSiteSettings(), 'data.system_guid.value');
  const migratedSiteName = get(wildbookBySystemGuid, systemGuid);

  const assets = get(sightingData, 'assets', []);
  const currentUserHasEditPermission = get(
    sightingData,
    'hasEdit',
    false,
  );

  const { curation: curationState, migrated } =
    sightingData?.pipeline_status || {};

  const {
    end,
    inProgress: isInProgress,
    message,
  } = curationState || {};

  const stage = getStage(curationState);
  const someAssetsHaveAnnotations = assets.some(
    asset => get(asset, 'annotations.length', 0) > 0,
  );

  let finishedLabel;
  if (migrated) {
    finishedLabel = migratedSiteName
      ? intl.formatMessage(
          { id: 'MIGRATION_FINISHED_MESSAGE_SITE' },
          { date: getDateString(end), migratedSiteName },
        )
      : intl.formatMessage(
          { id: 'MIGRATION_FINISHED_MESSAGE_DEFAULT' },
          { date: getDateString(end) },
        );
  } else {
    finishedLabel = intl.formatMessage(
      { id: 'CURATION_FINISHED_MESSAGE' },
      { date: getDateString(end) },
    );
  }

  return (
    <TimelineStep
      Icon={CurationIcon}
      titleId="SIGHTING_CURATION"
      stage={stage}
      notStartedText={intl.formatMessage({
        id: 'WAITING_ELLIPSES',
      })}
      inProgressText={
        currentUserHasEditPermission
          ? intl.formatMessage({ id: 'CURATION_INSTRUCTIONS' })
          : intl.formatMessage({ id: 'IN_PROGRESS' })
      }
      finishedText={finishedLabel}
      skippedText={intl.formatMessage({
        id: 'CURATION_SKIPPED_MESSAGE',
      })}
      failedText={intl.formatMessage({ id: 'CURATION_FAILED' })}
      failedAlertDescription={message}
    >
      {isInProgress && currentUserHasEditPermission && (
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
  );
}
