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
import useNotes from './useNotes';

export default function Iceland() {
  const [selectedJob, setSelectedJob] = useState(null);
  const { data: statuses, loading: statusLoading } = useStatus(
    selectedJob,
  );
  const { data: notes, loading: notesLoading } = useNotes(
    selectedJob,
  );

  const data = ids.map(datum => ({
    ...datum,
    id: `${datum.acmId}-${datum.taskId}-${datum.annotationID}`,
    status: get(statuses, datum.acmId, 'To do'),
    notes: get(notes, datum.acmId, ''),
  }));

  const columns = [
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: ({ value }) =>
        statusLoading ? <Skeleton /> : value,
    },
    {
      field: 'acmId',
      headerName: 'Job Id (ACM Id)',
      width: 330,
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
    {
      field: 'notes',
      headerName: 'Notes',
      width: 1200,
      renderCell: ({ value }) =>
        notesLoading ? <Skeleton /> : value,
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
        notes={notes}
        onClose={() => setSelectedJob(null)}
      />
    </MainColumn>
  );
}
