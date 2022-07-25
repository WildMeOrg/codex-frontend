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

  return (
    <TimelineStep
      Icon={ReportIcon}
      titleId="SIGHTING_SUBMISSION"
      stage={stages.finished}
      finishedText={intl.formatMessage(
        { id: 'SIGHTING_SUBMISSION_REPORT_DATE' },
        { date: getDateString(dateCreated) },
      )}
    />
  );
}
