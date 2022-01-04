import React from 'react';

import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import ProgressIcon from '@material-ui/icons/Cached';

import Text from '../../../components/Text';
import stages from './stages';

export default function TimelineStep({
  titleId,
  Icon,
  stage,
  notStartedText,
  inProgressText,
  finishedText,
  skippedText,
}) {
  let descriptionText = notStartedText;
  if (stage === stages.current) descriptionText = inProgressText;
  if (stage === stages.finished) descriptionText = finishedText;
  if (stage === stages.skipped) descriptionText = skippedText;

  const stepComplete =
    stage === stages.finished || stage === stages.skipped;

  return (
    <TimelineItem style={{ minHeight: 100 }}>
      <TimelineSeparator>
        <TimelineDot color={stepComplete ? 'primary' : undefined}>
          {stage === 'current' ? <ProgressIcon /> : <Icon />}
        </TimelineDot>
      </TimelineSeparator>
      <TimelineContent>
        <Text variant="h6" id={titleId} />
        <Text variant="caption">{descriptionText}</Text>
      </TimelineContent>
    </TimelineItem>
  );
}
