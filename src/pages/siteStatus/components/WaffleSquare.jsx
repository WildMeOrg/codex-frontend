import React from 'react';
import { css } from '@emotion/core';
import { useIntl } from 'react-intl';
import parse from 'date-fns/parse';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme, withStyles } from '@material-ui/core/styles';
import Text from '../../../components/Text';

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[20],
  },
  arrow: {
    color: theme.palette.common.white,
  },
}))(Tooltip);

const WaffleSquare = function ({
  job,
  size = 10,
  gap = '3px',
  categoryData,
}) {
  const theme = useTheme();
  const intl = useIntl();

  const waffleSquareCSS = css`
    padding: 4px 12px;

    dt {
      display: inline-block;
    }

    div:first-of-type dt,
    div:first-of-type dd {
      border-bottom: 1px solid ${theme.palette.text.primary};
      margin-bottom: 0.5em;
    }

    dd {
      display inline-block;
      margin-inline-start: 0;
      padding-left: 4px;
    }
  `;

  const { status, jobcounter, time_received } = job;
  const formattedJobData = {};

  const jobCounterLabel = intl.formatMessage({
    id: 'SERVER_TOOLTIP_JOBCOUNTER_LABEL',
  });
  const jobCounterValue = intl.formatNumber(jobcounter, {
    useGrouping: false,
  });
  formattedJobData[jobCounterLabel] = jobCounterValue;

  const statusLabel = intl.formatMessage({
    id: 'SERVER_TOOLTIP_STATUS_LABEL',
  });
  const statusValue = intl.formatMessage({
    id: `SERVER_STATUS_${status.toUpperCase()}`,
  });
  formattedJobData[statusLabel] = statusValue;

  const dateReceivedLabel = intl.formatMessage({
    id: 'SERVER_TOOLTIP_DATE_RECEIVED_LABEL',
  });

  const timeReceived = parse(
    time_received.substring(0, 19),
    'yyyy-MM-dd HH:mm:ss',
    new Date(),
  );
  const dateReceivedValue = intl.formatDate(timeReceived, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  formattedJobData[dateReceivedLabel] = dateReceivedValue;

  const ariaLabel = intl.formatMessage(
    { id: 'SERVER_TOOLTIP_SUMMARY' },
    {
      jobcounter: jobCounterValue,
      status: statusValue,
      dateReceived: dateReceivedValue,
    },
  );

  return (
    <LightTooltip
      arrow
      placement="top"
      aria-label={ariaLabel}
      title={
        <dl css={waffleSquareCSS}>
          {Object.entries(formattedJobData).map(([key, value]) => (
            <div key={key}>
              <Text variant="body1" component="dt" gutterBottom>
                {key}
              </Text>
              <Text variant="body1" component="dd" gutterBottom>
                {value}
              </Text>
            </div>
          ))}
        </dl>
      }
    >
      <li
        style={{
          width: size,
          height: size,
          margin: `${gap} ${gap} 0 ${gap}`,
          display: 'inline-block',
          backgroundColor: categoryData.color || 'black',
        }}
      />
    </LightTooltip>
  );
};

export default WaffleSquare;
