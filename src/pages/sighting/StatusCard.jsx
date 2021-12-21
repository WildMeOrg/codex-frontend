import React, { useMemo } from 'react';
import { get } from 'lodash-es';
import { formatDistanceStrict } from 'date-fns';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import ProgressIcon from '@material-ui/icons/Cached';
import ReportIcon from '@material-ui/icons/ArtTrack';
import DetectionIcon from '@material-ui/icons/Search';
import CurationIcon from '@material-ui/icons/LowPriority';
import MatchingIcon from '@material-ui/icons/Visibility';

import { formatDate } from '../../utils/formatters';
import Text from '../../components/Text';
import Card from '../../components/cards/Card';

function getDateString(date) {
  return date ? formatDate(date, true) : 'unknown date';
}

function ProgressText({ startDate }) {
  const timeDelta = useMemo(
    () => {
      const currentTime = new Date();
      const startTime = new Date(startDate);
      try {
        return formatDistanceStrict(currentTime, startTime);
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    [startDate],
  );

  if (!timeDelta) return <Text variant="caption" id="IN_PROGRESS" />;
  return (
    <Text
      variant="caption"
      id="SIGHTING_STATE_IN_PROGRESS"
      values={{ timeDelta }}
    />
  );
}

export default function StatusCard({ sightingData }) {
  const photoCount = get(sightingData, ['assets', 'length'], 0);
  const dateCreated = get(sightingData, 'createdHouston');

  const detectionComplete =
    get(sightingData, 'stage') !== 'detection';
  const curationComplete =
    detectionComplete && get(sightingData, 'stage') !== 'curation';
  const matchingComplete =
    curationComplete && get(sightingData, 'stage') !== 'un_reviewed';

  const detectionInProgress = !detectionComplete;
  const curationInProgress = !curationComplete && detectionComplete;
  const matchingInProgress = !matchingComplete && curationComplete;

  const detectionStartTime = get(
    sightingData,
    'detection_start_time',
  );
  const curationStartTime = get(sightingData, 'curation_start_time');
  const matchingStartTime = get(
    sightingData,
    'identification_start_time',
  );

  return (
    <Card titleId="IDENTIFICATION_PIPELINE_STATUS">
      <Timeline>
        <TimelineItem style={{ minHeight: 100 }}>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <ReportIcon />
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
              values={{
                photoCount,
                date: getDateString(dateCreated),
              }}
            />
          </TimelineContent>
        </TimelineItem>
        <TimelineItem style={{ minHeight: 100 }}>
          <TimelineSeparator>
            <TimelineDot
              color={detectionComplete ? 'primary' : undefined}
            >
              {detectionInProgress ? (
                <ProgressIcon />
              ) : (
                <DetectionIcon />
              )}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Text variant="h6" id="ANIMAL_DETECTION" />
            {detectionInProgress ? (
              <ProgressText startDate={detectionStartTime} />
            ) : (
              <Text
                variant="caption"
                id={
                  photoCount === 0
                    ? 'DETECTION_SKIPPED_MESSAGE'
                    : undefined
                }
              >
                {`Detection finished on ${getDateString(
                  curationStartTime,
                )}.`}
              </Text>
            )}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem style={{ minHeight: 100 }}>
          <TimelineSeparator>
            <TimelineDot
              color={curationComplete ? 'primary' : undefined}
            >
              {curationInProgress ? (
                <ProgressIcon />
              ) : (
                <CurationIcon />
              )}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Text variant="h6" id="SIGHTING_CURATION" />
            {curationInProgress ? (
              <ProgressText startDate={curationStartTime} />
            ) : (
              <Text
                variant="caption"
                id={
                  photoCount === 0
                    ? 'CURATION_SKIPPED_MESSAGE'
                    : undefined
                }
              >
                {matchingStartTime
                  ? `Curation finished on ${getDateString(
                      matchingStartTime,
                    )}.`
                  : 'Waiting...'}
              </Text>
            )}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              color={matchingComplete ? 'primary' : undefined}
            >
              {matchingInProgress ? (
                <ProgressIcon />
              ) : (
                <MatchingIcon />
              )}
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Text variant="h6">Matching</Text>
            {matchingInProgress ? (
              <ProgressText startDate={matchingStartTime} />
            ) : (
              <Text
                variant="caption"
                id={
                  photoCount === 0
                    ? 'MATCHING_SKIPPED_MESSAGE'
                    : undefined
                }
              >
                {matchingStartTime
                  ? 'Matching finished'
                  : 'Waiting...'}
              </Text>
            )}
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Card>
  );
}
