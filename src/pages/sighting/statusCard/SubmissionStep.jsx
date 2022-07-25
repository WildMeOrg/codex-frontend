import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import ReportIcon from '@material-ui/icons/ArtTrack';

import TimelineStep from './TimelineStep';
import stages from './stages';
import { getDateString } from './statusCardUtils';

export default function SubmissionStep({ sightingData }) {
  const intl = useIntl();

  const dateCreated = get(sightingData, 'submissionTime');

  const formattedDateCreated = getDateString(dateCreated);

  return (
    <TimelineStep
      Icon={ReportIcon}
      titleId="SIGHTING_SUBMISSION"
      stage={stages.finished}
      finishedText={
        formattedDateCreated
          ? intl.formatMessage(
              { id: 'STATUS_SUBMISSION_REPORT_ON' },
              { date: formattedDateCreated },
            )
          : intl.formatMessage({
              id: 'STATUS_SUBMISSION_REPORT_ON_UNKNOWN',
            })
      }
    />
  );
}
