import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import MainColumn from '../../../components/MainColumn';
import InlineButton from '../../../components/InlineButton';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import JobModal from './JobModal';
import ids from './icelandIds';

export default function Iceland() {
  const [selectedJob, setSelectedJob] = useState(null);
  const data = ids.map(id => ({ id, status: 'To do', match: '-' }));

  const columns = [
    {
      name: 'status',
      label: 'Status',
    },
    {
      name: 'id',
      label: 'Job id',
      options: {
        customBodyRender: id => (
          <InlineButton onClick={() => setSelectedJob(id)}>
            {id}
          </InlineButton>
        ),
      },
    },
    {
      name: 'match',
      label: 'Match',
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
        jobId={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </MainColumn>
  );
}
