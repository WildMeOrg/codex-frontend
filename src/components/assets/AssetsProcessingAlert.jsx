import React from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { isNil, pick } from 'lodash-es';

import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTheme } from '@material-ui/core/styles';

import CustomAlert from '../Alert';
import Text from '../Text';
import LinearProgressWithLabel from '../LinearProgressWithLabel';
import useProgressQuery from '../../models/progress/useProgressQuery';
import { stage as agsStage } from '../../constants/assetGroupSighting';
import {
  progressStatus,
  progressProperties,
} from '../../constants/progress';
import {
  formatProgressMetrics,
  isProgressResolved,
} from '../../utils/progressUtils';

const relevantDataByStatus = {
  [progressStatus.created]: [
    progressProperties.status,
    progressProperties.ahead,
  ],
  [progressStatus.healthy]: [
    progressProperties.status,
    progressProperties.percentage,
    progressProperties.eta,
  ],
  [progressStatus.completed]: [
    progressProperties.status,
    progressProperties.percentage,
  ],
  [progressStatus.cancelled]: [
    progressProperties.status,
    progressProperties.percentage,
  ],
  [progressStatus.failed]: [
    progressProperties.status,
    progressProperties.percentage,
  ],
  error: [progressProperties.percentage],
};

const metricsShim = {
  percentage: 99,
  eta: 0,
  status: progressStatus.healthy,
};

const defaultResolvedMetrics = {
  percentage: 100,
  status: progressStatus.completed,
};

export function deriveMetrics(
  intl,
  isLoading,
  data,
  error,
  sightingStage,
) {
  if (isLoading) {
    return {
      formattedMetrics: intl.formatMessage({
        id: 'PROGRESS_STATUS_LOADING',
      }),
    };
  }

  const isResolved = isProgressResolved(data, error);

  // The sighting needs time to re-fetch after processing is complete
  if (isResolved && sightingStage === agsStage.preparation) {
    const { percentage, ...rest } = metricsShim;
    return {
      percentage,
      formattedMetrics: formatProgressMetrics(intl, rest),
    };
  }

  const status = data?.status;
  // A 404 response is a successful resolution, but there is no data
  if (isResolved && status !== progressStatus.completed) {
    const { percentage, ...rest } = defaultResolvedMetrics;
    return {
      percentage,
      formattedMetrics: formatProgressMetrics(intl, rest),
    };
  }

  if (error) {
    const relevantMetrics = pick(data, relevantDataByStatus.error);
    const { percentage } = relevantMetrics;

    return {
      percentage,
      formattedMetrics: intl.formatMessage({
        id: 'PROGRESS_STATUS_ERROR',
      }),
    };
  }

  const relevantMetrics =
    data && pick(data, relevantDataByStatus[status]);
  const { percentage, ...rest } = relevantMetrics || {};

  return {
    percentage,
    formattedMetrics:
      formatProgressMetrics(intl, rest) ||
      intl.formatMessage({ id: 'PROGRESS_STATUS_UNKNOWN' }),
  };
}

export default function AssetsProcessingAlert({
  progressGuid,
  sightingStage,
}) {
  const intl = useIntl();
  const theme = useTheme();

  const { isLoading, data, error } = useProgressQuery(progressGuid, {
    notifyOnChangeProps: ['isLoading', 'data', 'error'],
  });

  const { percentage, formattedMetrics } = deriveMetrics(
    intl,
    isLoading,
    data,
    error,
    sightingStage,
  );

  return (
    <CustomAlert
      titleId="PENDING_IMAGE_PROCESSING"
      descriptionId="PENDING_IMAGE_PROCESSING_MESSAGE"
      severity="info"
    >
      <Box mt={2} minHeight="2em" display="flex" alignItems="center">
        {isNil(percentage) ? (
          <LinearProgress style={{ width: '100%' }} />
        ) : (
          <LinearProgressWithLabel
            variant="determinate"
            value={percentage}
            label={
              <FormattedNumber
                value={percentage / 100}
                style="percent"
              />
            }
            containerStyle={{ width: '100%' }}
          />
        )}
      </Box>
      <Text
        variant="body2"
        style={{ marginTop: `-${theme.spacing(1)}px` }}
      >
        {formattedMetrics}
      </Text>
    </CustomAlert>
  );
}
