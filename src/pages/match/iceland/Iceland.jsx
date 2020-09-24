import React, { useState } from 'react';
import { get } from 'lodash-es';

import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import MainColumn from '../../../components/MainColumn';
import InlineButton from '../../../components/InlineButton';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import JobModal from './JobModal';
import ids from './icelandIds';
import useStatus from './useStatus';

export default function Iceland() {
  const [selectedJob, setSelectedJob] = useState(null);
  const { data: statuses, loading } = useStatus(selectedJob);

  const data = ids.map(datum => ({
    ...datum,
    id: datum.acmId,
    status: get(statuses, datum.acmId, 'To do'),
  }));

  const columns = [
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: status => (loading ? <Skeleton /> : status),
      },
    },
    {
      name: 'acmId',
      label: 'ACM ID',
      options: {
        customBodyRender: (acmId, job) => (
          <InlineButton
            onClick={() => {
              setSelectedJob(job);
            }}
          >
            {acmId}
          </InlineButton>
        ),
      },
    },
    {
      name: 'annotationId',
      label: 'Target annotation ID',
    },
  ];

  return (
    <MainColumn>
      <Typography
        variant="h5"
        component="h5"
        style={{
          marginTop: 120,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        Iceland Many-to-Many Matching Tool
      </Typography>
      <DataDisplay
        title={`${ids.length} match results`}
        data={data}
        columns={columns}
      />
      <JobModal
        open={Boolean(selectedJob)}
        acmId={get(selectedJob, 'acmId')}
        taskId={get(selectedJob, 'taskId')}
        onClose={() => setSelectedJob(null)}
      />
    </MainColumn>
  );
}
