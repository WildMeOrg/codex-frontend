import React from 'react';
import Typography from '@material-ui/core/Typography';
import MainColumn from '../../../components/MainColumn';
import DataDisplay from '../../../components/dataDisplays/DataDisplay';
import ids from './icelandIds';

const columns = [
  {
    name: 'status',
    label: 'Status',
  },
  {
    name: 'id',
    label: 'Job id',
  },
  {
    name: 'match',
    label: 'Match',
  },
];

export default function Iceland() {
  const data = ids.map(id => ({ id, status: 'To do', match: '-' }));

  return (
    <MainColumn>
      <Typography
        variant="h5"
        component="h5"
        style={{ marginTop: 120, textAlign: 'center' }}
      >
        Iceland Many-to-Many Matching Tool
      </Typography>
      <DataDisplay
        title={`${ids.length} match results`}
        data={data}
        columns={columns}
      />
    </MainColumn>
  );
}
