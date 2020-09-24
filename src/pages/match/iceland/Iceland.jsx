import React, { useState } from 'react';
import { get } from 'lodash-es';

import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { DataGrid } from '@material-ui/data-grid';

import MainColumn from '../../../components/MainColumn';
import InlineButton from '../../../components/InlineButton';
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
      field: 'status',
      headerName: 'Status',
      renderCell: ({ value }) => (loading ? <Skeleton /> : value),
    },
    {
      field: 'acmId',
      headerName: 'Job Id (ACM Id)',
      width: 400,
      renderCell: ({ data: rowData, value }) => (
        <InlineButton
          onClick={() => {
            setSelectedJob(rowData);
          }}
        >
          {value}
        </InlineButton>
      ),
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
      <DataGrid
        columns={columns}
        rows={data}
        rowHeight={36}
        autoHeight
        pageSize={50}
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
