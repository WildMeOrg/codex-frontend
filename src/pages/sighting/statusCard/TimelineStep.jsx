import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import ProgressIcon from '@material-ui/icons/HourglassEmpty';
import ErrorIcon from '@material-ui/icons/PriorityHigh';

import CustomAlert from '../../../components/Alert';
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
  failedText,
  failedAlertDescription,
  children,
}) {
  const theme = useTheme();

  let descriptionText = notStartedText;
  if (stage === stages.current) descriptionText = inProgressText;
  if (stage === stages.finished) descriptionText = finishedText;
  if (stage === stages.skipped) descriptionText = skippedText;
  if (stage === stages.failed) descriptionText = failedText;

  const stepComplete =
    stage === stages.finished || stage === stages.skipped;

  let IconToRender = Icon;
  if (stage === stages.current) IconToRender = ProgressIcon;
  if (stage === stages.failed) IconToRender = ErrorIcon;

  let iconColor;
  if (stepComplete) iconColor = theme.palette.primary.dark;
  if (stage === stages.failed) iconColor = theme.palette.error.main;

  return (
    <TimelineItem style={{ minHeight: 100 }}>
      <TimelineSeparator>
        <TimelineDot style={{ backgroundColor: iconColor }}>
          <IconToRender />
        </TimelineDot>
      </TimelineSeparator>
      <TimelineContent>
        <Text variant="h6" id={titleId} />
        <Text variant="caption">{descriptionText}</Text>
        {stage === stages.failed && failedAlertDescription && (
          <CustomAlert
            description={failedAlertDescription}
            severity="error"
            style={{ marginTop: '4px' }}
          />
        )}
        {children}
      </TimelineContent>
    </TimelineItem>
  );
}
