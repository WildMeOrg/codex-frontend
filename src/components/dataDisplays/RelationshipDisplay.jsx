import React from 'react';

import DataDisplay from './DataDisplay';
import ActionIcon from '../ActionIcon';

export default function RelationshipDisplay({
  data,
  loading,
  setConfirmDeleteDialog,
}) {
  const relationshipCols = [
    {
      reference: 'nonSelfFirstName',
      name: 'nonSelfFirstName',
      labelId: 'Individual',
    },
    { reference: 'type', name: 'type', labelId: 'Type' },
    { reference: 'role', name: 'role', labelId: 'Role' },
    {
      reference: 'actions',
      name: 'guid',
      labelId: 'Actions',
      options: {
        customBodyRender: (_, relationship) => [
          <ActionIcon
            variant="view"
            href={`/individuals/${relationship?.nonSelfGuid}`}
            linkProps={{ newTab: true }}
          />,
          <ActionIcon
            variant="delete"
            onClick={() => {
              setConfirmDeleteDialog({
                relationshipGuid: relationship?.guid,
                open: true,
              });
            }}
          />,
        ],
      },
    },
  ];

  return (
    <DataDisplay
      tableSize="medium"
      columns={relationshipCols}
      data={data}
      loading={loading}
      maxHeight={400}
    />
  );
}
