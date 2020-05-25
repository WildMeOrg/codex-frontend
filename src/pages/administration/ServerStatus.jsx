import React from 'react';
import { css } from '@emotion/core';
import {
  useIntl,
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import { get, round } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, withStyles } from '@material-ui/core/styles';
import useServerStatus from '../../modules/administration/useServerStatus';
import MainColumn from '../../components/MainColumn';

const visuallyHiddenCSS = css`
  position: absolute;
  height: 1px;
  width: 1px;
  clip: rect(1px 1px 1px 1px); // IE 6 and 7
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
  -webkit-clip-path: polygon(0px 0px, 0px 0px, 0px 0px);
  overflow: hidden !important;
`;

const ROUND_PRECISION = 1;

const elapsedTimeInWords = (() => {
  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 60 * 60;
  const SECONDS_PER_DAY = 3600 * 24;
  const cache = {};

  return seconds => {
    if (seconds in cache) {
      return cache[seconds];
    }

    let result;
    if (seconds < SECONDS_PER_MINUTE) {
      result = { value: seconds, unit: 'second' };
    } else if (
      seconds >= SECONDS_PER_MINUTE &&
      seconds < SECONDS_PER_HOUR
    ) {
      result = {
        value: round(seconds / SECONDS_PER_MINUTE, ROUND_PRECISION),
        unit: 'minute',
      };
    } else if (
      seconds >= SECONDS_PER_HOUR &&
      seconds < SECONDS_PER_DAY
    ) {
      result = {
        value: round(seconds / SECONDS_PER_HOUR, ROUND_PRECISION),
        unit: 'hour',
      };
    } else {
      result = {
        value: round(seconds / SECONDS_PER_DAY, ROUND_PRECISION),
        unit: 'day',
      };
    }

    cache[seconds] = result;
    return result;
  };
})();

function SummaryCard({ title, content, loading = false, ...rest }) {
  const isXs = useMediaQuery(theme => theme.breakpoints.only('xs'));

  return (
    <Grid item {...rest}>
      <Paper
        square
        variant="outlined"
        style={{
          padding: '12px',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="body1"
          component="dt"
          gutterBottom
          style={{
            fontWeight: 'bold',
            fontSize: '0.9em',
            display: isXs ? 'inline-block' : 'block',
            marginRight: isXs ? '1em' : 0,
          }}
        >
          {title}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width="45%" />
        ) : (
          <Typography
            variant="body2"
            component="dd"
            style={{
              fontSize: '1.1em',
              marginInlineStart: 0,
              display: isXs ? 'inline-block' : 'block',
            }}
          >
            {content}
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}

function LegendItem({ color, label }) {
  return (
    <div>
      <dt
        aria-label={`color: ${color}`}
        style={{
          backgroundColor: color,
          display: 'inline-block',
          width: '12px',
          height: '12px',
          marginRight: '6px',
        }}
      />
      <Typography
        variant="body1"
        component="dd"
        display="inline"
        style={{ fontSize: '0.9em' }}
      >
        {label}
      </Typography>
    </div>
  );
}

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  arrow: {
    color: theme.palette.common.white,
  },
}))(Tooltip);

const WaffleSquare = ({
  job,
  size = '10px',
  gap = '3px',
  categoryData,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  const waffleSquareCSS = css`
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
  const dateReceivedValue = intl.formatDate(new Date(time_received), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  formattedJobData[dateReceivedLabel] = dateReceivedValue;

  const ariaLabel = intl.formatMessage(
    { id: 'SERVER_TOOLTIP_ARIA_LABEL' },
    {
      jobCounterLabel,
      jobCounterValue,
      statusLabel,
      statusValue,
      dateReceivedLabel,
      dateReceivedValue,
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
              <Typography
                variant="body1"
                component="dt"
                gutterBottom
                style={{ fontSize: 'inherit' }}
              >
                {key}
              </Typography>
              <Typography
                variant="body1"
                component="dd"
                gutterBottom
                style={{ fontSize: 'inherit' }}
              >
                {value}
              </Typography>
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

const categoryData = {
  inDetectionQueue: {
    intlId: 'SERVER_STATUS_CATEGORY_IN_DETECTION_QUEUE',
    color: '#68D9F1',
  },
  inIdentificationQueue: {
    intlId: 'SERVER_STATUS_CATEGORY_IN_IDENTIFICATION_QUEUE',
    color: '#FFC107',
  },
  error: {
    intlId: 'SERVER_STATUS_CATEGORY_ERROR',
    color: '#D61515',
  },
  completed: {
    intlId: 'SERVER_STATUS_CATEGORY_COMPLETED',
    color: '#00C75B',
  },
  inProgress: {
    intlId: 'SERVER_STATUS_CATEGORY_IN_PROGRESS',
    color: '#7816D8',
  },
};

export default function ServerStatus() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));

  const [results, error, isFetched] = useServerStatus();
  const { lastHour, twoWeeks, byStatus } = results;

  const lastHourAverageTurnaroundTime = round(
    get(lastHour, 'totalTurnaroundTime') /
      (get(lastHour, 'jobsProcessed') || 1),
    ROUND_PRECISION,
  );
  const lastHourAverageRunTime = round(
    get(lastHour, 'totalRunTime') /
      (get(lastHour, 'jobsProcessed') || 1),
    ROUND_PRECISION,
  );
  const twoWeeksAverageTurnaroundTime = round(
    get(twoWeeks, 'totalTurnaroundTime') /
      (get(twoWeeks, 'jobsProcessed') || 1),
    ROUND_PRECISION,
  );
  const twoWeeksAverageRunTime = round(
    get(twoWeeks, 'totalRunTime') /
      (get(twoWeeks, 'jobsProcessed') || 1),
    ROUND_PRECISION,
  );

  return (
    <MainColumn
      style={{ padding: '0 16px', boxSizing: 'border-box' }}
    >
      <Typography
        variant="h3"
        component="h3"
        style={{ margin: '16px 0', paddingTop: '16px' }}
      >
        <FormattedMessage id="SERVER_STATUS_PAGE_TITLE" />
      </Typography>
      {error ? (
        <Grid style={{ marginTop: 12 }} item>
          {error && (
            <Typography color="error">
              <FormattedMessage id="REQUEST_ERROR" />
            </Typography>
          )}
        </Grid>
      ) : (
        <>
          <Typography
            variant="h6"
            component="h4"
            style={{
              margin: '16px 0',
              textDecoration: 'underline',
              fontWeight: 'lighter',
            }}
          >
            <FormattedMessage id="SERVER_LAST_HOUR" />
          </Typography>
          <Grid
            container
            component="dl"
            spacing={isXs ? 1 : 2}
            style={{ marginBottom: '32px' }}
          >
            <SummaryCard
              xs={12}
              sm={4}
              loading={!isFetched}
              title={
                <FormattedMessage id="SERVER_SUMMARY_TURNAROUND_TIME" />
              }
              content={
                <FormattedNumber
                  value={
                    elapsedTimeInWords(lastHourAverageTurnaroundTime)
                      .value
                  }
                  unit={
                    elapsedTimeInWords(lastHourAverageTurnaroundTime)
                      .unit
                  }
                  unitDisplay="long"
                  style="unit" // eslint-disable-line react/style-prop-object
                />
              }
            />
            <SummaryCard
              xs={12}
              sm={4}
              loading={!isFetched}
              title={
                <FormattedMessage id="SERVER_SUMMARY_RUN_TIME" />
              }
              content={
                <FormattedNumber
                  value={
                    elapsedTimeInWords(lastHourAverageRunTime).value
                  }
                  unit={
                    elapsedTimeInWords(lastHourAverageRunTime).unit
                  }
                  unitDisplay="long"
                  style="unit" // eslint-disable-line react/style-prop-object
                />
              }
            />
            <SummaryCard
              xs={12}
              sm={4}
              loading={!isFetched}
              title={
                <FormattedMessage id="SERVER_SUMMARY_JOBS_PROCESSED" />
              }
              content={
                <FormattedNumber value={lastHour.jobsProcessed} />
              }
            />
          </Grid>
          <Typography
            variant="h6"
            component="h4"
            style={{
              margin: '16px 0',
              textDecoration: 'underline',
              fontWeight: 'lighter',
            }}
          >
            <FormattedMessage id="SERVER_ALL_JOBS" />
          </Typography>
          <Grid
            container
            component="dl"
            spacing={isXs ? 1 : 2}
            style={{ marginBottom: '32px' }}
          >
            <SummaryCard
              xs={12}
              sm={4}
              loading={!isFetched}
              title={
                <FormattedMessage id="SERVER_SUMMARY_TURNAROUND_TIME" />
              }
              content={
                <FormattedNumber
                  value={
                    elapsedTimeInWords(twoWeeksAverageTurnaroundTime)
                      .value
                  }
                  unit={
                    elapsedTimeInWords(twoWeeksAverageTurnaroundTime)
                      .unit
                  }
                  unitDisplay="long"
                  style="unit" // eslint-disable-line react/style-prop-object
                />
              }
            />
            <SummaryCard
              xs={12}
              sm={4}
              loading={!isFetched}
              title={
                <FormattedMessage id="SERVER_SUMMARY_RUN_TIME" />
              }
              content={
                <FormattedNumber
                  value={
                    elapsedTimeInWords(twoWeeksAverageRunTime).value
                  }
                  unit={
                    elapsedTimeInWords(twoWeeksAverageRunTime).unit
                  }
                  unitDisplay="long"
                  style="unit" // eslint-disable-line react/style-prop-object
                />
              }
            />
            <SummaryCard
              xs={12}
              sm={4}
              loading={!isFetched}
              title={
                <FormattedMessage id="SERVER_SUMMARY_JOBS_IN_QUEUE" />
              }
              content={
                <FormattedNumber value={twoWeeks.jobsInQueue} />
              }
            />
          </Grid>
          <header aria-label="waffle graph legend">
            <dl
              css={css`
                display: grid;
                grid-template-columns: repeat(${isXs ? 1 : 3}, 1fr);
                grid-column-gap: ${theme.spacing(2)}px;
                grid-row-gap: 3px;
              `}
            >
              {Object.values(categoryData).map(
                ({ intlId, color }) => (
                  <LegendItem
                    key={intlId}
                    color={color}
                    label={<FormattedMessage id={intlId} />}
                  />
                ),
              )}
            </dl>
          </header>
          {isFetched ? (
            <div style={{ padding: '0', margin: '-3px' }}>
              {Object.entries(byStatus)
                .filter(entry => entry[1].length > 0)
                .map(([category, jobs]) => (
                  <React.Fragment key={category}>
                    <h5 css={visuallyHiddenCSS}>
                      <FormattedMessage
                        id={categoryData[category].intlId}
                      />
                    </h5>
                    <ul style={{ display: 'contents' }}>
                      {jobs.map(job => (
                        <WaffleSquare
                          key={job.job_id}
                          job={job}
                          size="16px"
                          gap="3px"
                          categoryData={categoryData[category]}
                        />
                      ))}
                    </ul>
                  </React.Fragment>
                ))}
            </div>
          ) : (
            <>
              <Skeleton height={`${16 / 0.6}px`} />
              <Skeleton height={`${16 / 0.6}px`} />
              <Skeleton height={`${16 / 0.6}px`} />
              <Skeleton height={`${16 / 0.6}px`} />
              <Skeleton height={`${16 / 0.6}px`} width="60%" />
            </>
          )}
        </>
      )}
    </MainColumn>
  );
}
