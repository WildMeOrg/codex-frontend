import React from 'react';
import { get } from 'lodash-es';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import ProgressIcon from '@material-ui/icons/Cached';
import FinishedIcon from '@material-ui/icons/Done';
import CurationIcon from '@material-ui/icons/FilterNone';
import MatchingIcon from '@material-ui/icons/LowPriority';

import { formatDate } from '../../utils/formatters';
import Text from '../../components/Text';
import Card from '../../components/cards/Card';

export default function StatusCard({ sightingData }) {
  const photoCount = get(sightingData, ['assets', 'length'], 0);
  const dateCreated = get(sightingData, 'createdHouston');
  const dateString = dateCreated
    ? formatDate(dateCreated, true)
    : 'unknown date';
  return (
    <Card titleId="IDENTIFICATION_PIPELINE_STATUS">
      <Timeline>
        <TimelineItem style={{ minHeight: 100 }}>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <FinishedIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Text variant="h6" id="SIGHTING_SUBMISSION" />
            <Text
              variant="caption"
              id={
                photoCount > 0
                  ? 'SIGHTING_CREATED_WITH_ASSETS_DESCRIPTION'
                  : 'SIGHTING_CREATED_NO_ASSETS_DESCRIPTION'
              }
              values={{ photoCount, date: dateString }}
            />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem style={{ minHeight: 100 }}>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <ProgressIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Text variant="h6">Animal Detection</Text>
            <Text variant="caption">
              17th in line (42 minutes so far).
            </Text>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem style={{ minHeight: 100 }}>
          <TimelineSeparator>
            <TimelineDot>
              <CurationIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Text variant="h6">Sighting Curation</Text>
            <Text variant="caption">
              Waiting for animal detection to finish.
            </Text>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot>
              <MatchingIcon />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Text variant="h6">Matching</Text>
            <Text variant="caption">
              Waiting for sighting curation to finish.
            </Text>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Card>
  );
}
