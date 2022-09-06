import React from 'react';
import { css } from '@emotion/core';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { get, round } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import version from '../../constants/version';
import useGetSiteInfo from '../../models/site/useGetSiteInfo';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useSageJobs from '../../models/sage/useSageJobs';
import MainColumn from '../../components/MainColumn';
import SuperText, {
  superTextTypes,
} from '../../components/SuperText';
import Text from '../../components/Text';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import SummaryCard from './components/SummaryCard';
import LegendItem from './components/LegendItem';
import WaffleSquare from './components/WaffleSquare';
import { getElapsedTimeInWords } from '../../utils/formatters';
import { getSageJobsStatistics } from '../../utils/sageUtils';

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

export default function SiteStatus() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const { data: siteInfo, loading: siteInfoLoading } =
    useGetSiteInfo();

  useDocumentTitle('SITE_STATUS_PAGE_TITLE');

  const { data, error, isLoading } = useSageJobs();
  const { lastHour, twoWeeks, byStatus } =
    getSageJobsStatistics(data);

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

  const houstonVersion = get(siteInfo, ['houston', 'version']);
  const sageVersion = get(siteInfo, ['sage', 'version']);
  const houstonHash = get(siteInfo, ['houston', 'git_version']);

  return (
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="SITE_STATUS_PAGE_TITLE"
      />
      <SettingsBreadcrumbs currentPageTextId="SITE_STATUS_PAGE_TITLE" />
      <div style={{ padding: 16, boxSizing: 'border-box' }}>
        <Text variant="h5" id="VERSIONS" />
        <SuperText
          loading={siteInfoLoading}
          data={[
            {
              type: superTextTypes.text,
              id: 'COMPONENT_VERSION',
              values: { component: 'Frontend' },
            },
            {
              key: 'only-spacer',
              type: superTextTypes.spacer,
            },
            {
              key: 'version',
              types: superTextTypes.text,
              children: version.packageVersion,
              hide: !version.packageVersion,
            },
            {
              types: superTextTypes.text,
              id: 'UNKNOWN',
              hide: Boolean(version.packageVersion),
            },
          ]}
        />
        <SuperText
          loading={siteInfoLoading}
          data={[
            {
              type: superTextTypes.text,
              id: 'COMPONENT_VERSION',
              values: { component: 'Houston' },
            },
            {
              key: 'only-spacer',
              type: superTextTypes.spacer,
            },
            {
              key: 'version',
              types: superTextTypes.text,
              children: houstonVersion,
              hide: !houstonVersion,
            },
            {
              types: superTextTypes.text,
              id: 'UNKNOWN',
              hide: Boolean(houstonVersion),
            },
          ]}
        />
        <SuperText
          loading={siteInfoLoading}
          data={[
            {
              type: superTextTypes.text,
              id: 'COMPONENT_VERSION',
              values: { component: 'Sage' },
            },
            {
              key: 'only-spacer',
              type: superTextTypes.spacer,
            },
            {
              key: 'version',
              types: superTextTypes.text,
              children: sageVersion,
              hide: !sageVersion,
            },
            {
              types: superTextTypes.text,
              id: 'UNKNOWN',
              hide: Boolean(sageVersion),
            },
          ]}
        />
        <Text
          variant="h5"
          id="COMMIT_HASHES"
          style={{ marginTop: 20 }}
        />
        <SuperText
          loading={siteInfoLoading}
          data={[
            {
              type: superTextTypes.text,
              id: 'COMPONENT_COMMIT_HASH',
              values: { component: 'Frontend' },
            },
            {
              key: 'only-spacer',
              type: superTextTypes.spacer,
            },
            {
              key: 'commit-hash',
              types: superTextTypes.text,
              children: version.commitHash,
              hide: !version.commitHash,
            },
            {
              types: superTextTypes.text,
              id: 'UNKNOWN',
              hide: Boolean(version.commitHash),
            },
          ]}
        />
        <SuperText
          loading={siteInfoLoading}
          data={[
            {
              type: superTextTypes.text,
              id: 'COMPONENT_COMMIT_HASH',
              values: { component: 'Houston' },
            },
            {
              key: 'only-spacer',
              type: superTextTypes.spacer,
            },
            {
              key: 'commit-hash',
              types: superTextTypes.text,
              children: houstonHash,
              hide: !houstonHash,
            },
            {
              types: superTextTypes.text,
              id: 'UNKNOWN',
              hide: Boolean(houstonHash),
            },
          ]}
        />
        {error ? (
          <Text color="error" id="REQUEST_ERROR" />
        ) : (
          <>
            <Text
              variant="h5"
              component="h5"
              style={{
                margin: '16px 0',
              }}
              id="SERVER_LAST_HOUR"
            />
            <Grid
              container
              component="dl"
              spacing={isXs ? 1 : 2}
              style={{ marginBottom: 32 }}
            >
              {lastHour.error ? (
                <Text color="error" id="SERVER_LAST_HOUR_ERROR" />
              ) : (
                <>
                  <SummaryCard
                    xs={12}
                    sm={4}
                    loading={isLoading}
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
                        style="unit"
                      />
                    }
                  />
                  <SummaryCard
                    xs={12}
                    sm={4}
                    loading={isLoading}
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
                        style="unit"
                      />
                    }
                  />
                  <SummaryCard
                    xs={12}
                    sm={4}
                    loading={isLoading}
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
            <Text
              variant="h5"
              component="h5"
              style={{
                margin: '16px 0',
              }}
              id="SERVER_ALL_JOBS"
            />
            <Grid
              container
              component="dl"
              spacing={isXs ? 1 : 2}
              style={{ marginBottom: 32 }}
            >
              <SummaryCard
                xs={12}
                sm={4}
                loading={isLoading}
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
                    style="unit"
                  />
                }
              />
              <SummaryCard
                xs={12}
                sm={4}
                loading={isLoading}
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
                    style="unit"
                  />
                }
              />
              <SummaryCard
                xs={12}
                sm={4}
                loading={isLoading}
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
            {isLoading ? (
              <>
                <Skeleton height={skeletonHeight} />
                <Skeleton height={skeletonHeight} />
                <Skeleton height={skeletonHeight} />
                <Skeleton height={skeletonHeight} />
                <Skeleton height={skeletonHeight} width="60%" />
              </>
            ) : (
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
            )}
          </>
        )}
      </div>
    </MainColumn>
  );
}
