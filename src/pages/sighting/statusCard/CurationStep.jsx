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

function getFinishedTextIntlArgs(end, migrated, migratedSiteName) {
  const formattedEnd = getDateString(end);

  if (!migrated) {
    if (formattedEnd) {
      return [
        { id: 'STATUS_CURATION_FINISHED_ON' },
        { date: formattedEnd },
      ];
    }

    return [{ id: 'STATUS_CURATION_FINISHED_ON_UNKNOWN' }];
  }

  if (!migratedSiteName) {
    if (formattedEnd) {
      return [
        {
          id: 'STATUS_CURATION_MIGRATED_FROM_UNKNOWN_SITE_FINISHED_ON',
        },
        { date: formattedEnd },
      ];
    }

    return [
      {
        id: 'STATUS_CURATION_MIGRATED_FROM_UNKNOWN_SITE_FINISHED_ON_UNKNOWN',
      },
    ];
  }

  if (formattedEnd) {
    return [
      { id: 'STATUS_CURATION_MIGRATED_FROM_SITE_FINISHED_ON' },
      { date: formattedEnd, migratedSiteName },
    ];
  }

  return [
    { id: 'STATUS_CURATION_MIGRATED_FROM_SITE_FINISHED_ON_UNKNOWN' },
    { migratedSiteName },
  ];
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
          ? intl.formatMessage({ id: 'STATUS_CURATION_CURRENT_EDIT' })
          : intl.formatMessage({ id: 'STATUS_CURATION_CURRENT_VIEW' })
      }
      finishedText={intl.formatMessage(
        ...getFinishedTextIntlArgs(end, migrated, migratedSiteName),
      )}
      skippedText={intl.formatMessage({
        id: 'STATUS_CURATION_SKIPPED',
      })}
      failedText={intl.formatMessage({
        id: 'STATUS_CURATION_FAILED',
      })}
      failedAlertDescription={message}
    >
      {isInProgress && currentUserHasEditPermission && (
        <div style={{ marginTop: 4, marginBottom: 20 }}>
          <ButtonLink
            id={
              someAssetsHaveAnnotations
                ? 'STATUS_CURATION_CURRENT_ASSIGN_ANNOTATIONS'
                : 'STATUS_CURATION_CURRENT_ANNOTATE_PHOTOS'
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
