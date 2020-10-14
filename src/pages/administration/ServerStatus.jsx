import React from 'react';
import { css } from '@emotion/core';
import {
  useIntl,
  FormattedMessage,
  FormattedNumber,
} from 'react-intl';
import { get, round } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useServerStatus from '../../modules/administration/useServerStatus';
import MainColumn from '../../components/MainColumn';
import SummaryCard from './components/SummaryCard';
import LegendItem from './components/LegendItem';
import WaffleSquare from './components/WaffleSquare';
import { getElapsedTimeInWords } from '../../utils/formatters';

const skeletonHeight = `${16 / 0.6}px`;

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

  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'SERVER_STATUS' }));

  const [results, error, isFetched] = useServerStatus();
  const { lastHour, twoWeeks, byStatus } = results;

  const jobsProcessedInLastHour = get(lastHour, 'jobsProcessed', 0);
  const jobsProcessedInTwoWeeks = get(twoWeeks, 'jobsProcessed', 0);

  const lastHourAverageTurnaroundTime = round(
    get(lastHour, 'totalTurnaroundTime') / jobsProcessedInLastHour,
    ROUND_PRECISION,
  );
  const lastHourAverageRunTime = round(
    get(lastHour, 'totalRunTime') / jobsProcessedInLastHour,
    ROUND_PRECISION,
  );
  const twoWeeksAverageTurnaroundTime = round(
    get(twoWeeks, 'totalTurnaroundTime') / jobsProcessedInTwoWeeks,
    ROUND_PRECISION,
  );
  const twoWeeksAverageRunTime = round(
    get(twoWeeks, 'totalRunTime') / jobsProcessedInTwoWeeks,
    ROUND_PRECISION,
  );

  return (
    <MainColumn>
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        <FormattedMessage id="SERVER_STATUS" />
      </Typography>
      <div style={{ padding: 16, boxSizing: 'border-box' }}>
        {error ? (
          <Typography color="error">
            <FormattedMessage id="REQUEST_ERROR" />
          </Typography>
        ) : (
          <>
            <Typography
              variant="h5"
              component="h5"
              style={{
                margin: '16px 0',
              }}
            >
              <FormattedMessage id="SERVER_LAST_HOUR" />
            </Typography>
            <Grid
              container
              component="dl"
              spacing={isXs ? 1 : 2}
              style={{ marginBottom: 32 }}
            >
              {lastHour.error ? (
                <Typography color="error">
                  <FormattedMessage id="SERVER_LAST_HOUR_ERROR" />
                </Typography>
              ) : (
                <>
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
                          getElapsedTimeInWords(
                            lastHourAverageTurnaroundTime,
                          ).value
                        }
                        unit={
                          getElapsedTimeInWords(
                            lastHourAverageTurnaroundTime,
                          ).unit
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
                          getElapsedTimeInWords(
                            lastHourAverageRunTime,
                          ).value
                        }
                        unit={
                          getElapsedTimeInWords(
                            lastHourAverageRunTime,
                          ).unit
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
                      <FormattedNumber
                        value={lastHour.jobsProcessed}
                      />
                    }
                  />
                </>
              )}
            </Grid>
            <Typography
              variant="h5"
              component="h5"
              style={{
                margin: '16px 0',
              }}
            >
              <FormattedMessage id="SERVER_ALL_JOBS" />
            </Typography>
            <Grid
              container
              component="dl"
              spacing={isXs ? 1 : 2}
              style={{ marginBottom: 32 }}
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
                      getElapsedTimeInWords(
                        twoWeeksAverageTurnaroundTime,
                      ).value
                    }
                    unit={
                      getElapsedTimeInWords(
                        twoWeeksAverageTurnaroundTime,
                      ).unit
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
                      getElapsedTimeInWords(twoWeeksAverageRunTime)
                        .value
                    }
                    unit={
                      getElapsedTimeInWords(twoWeeksAverageRunTime)
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
              <div style={{ padding: 0, margin: -3 }}>
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
                            size={16}
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
                <Skeleton height={skeletonHeight} />
                <Skeleton height={skeletonHeight} />
                <Skeleton height={skeletonHeight} />
                <Skeleton height={skeletonHeight} />
                <Skeleton height={skeletonHeight} width="60%" />
              </>
            )}
          </>
        )}
      </div>
    </MainColumn>
  );
}
