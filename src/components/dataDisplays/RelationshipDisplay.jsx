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
      labelId: 'INDIVIDUAL',
    },
    { reference: 'type', name: 'type', labelId: 'TYPE' },
    { reference: 'role', name: 'role', labelId: 'ROLE' },
    {
      reference: 'actions',
      name: 'guid',
      labelId: 'ACTIONS',
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
      idKey="guid"
      tableSize="medium"
      columns={relationshipCols}
      data={data}
      loading={loading}
      tableContainerStyles={{ maxHeight: 400 }}
    />
  );
}
