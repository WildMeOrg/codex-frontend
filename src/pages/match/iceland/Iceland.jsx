import React, { useState } from 'react';
import { get } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import MainColumn from '../../../components/MainColumn';
import InlineButton from '../../../components/InlineButton';
import Link from '../../../components/Link';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import JobModal from './JobModal';
import ids from './icelandIds';

export default function Iceland() {
  const [selectedJob, setSelectedJob] = useState(null);
  const data = ids.map(datum => ({
    ...datum,
    id: datum.acmId,
    status: 'To do',
  }));

  const columns = [
    {
      name: 'status',
      label: 'Status',
    },
    {
      name: 'acmId',
      label: 'ACM id',
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
      label: 'Annotation ID',
      options: {
        customBodyRender: annotationId => (
          <Link href="/">{annotationId}</Link>
        ),
      },
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
