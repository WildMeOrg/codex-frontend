import React from 'react';

import DataDisplay from './DataDisplay';
import ActionIcon from '../ActionIcon';

export default function RelationshipDisplay({
  data,
  loading,
  setConfirmDeleteDialog,
  ...rest
}) {
  const relationshipCols = [
    {
      reference: 'nonSelfFirstName',
      name: 'nonSelfFirstName',
      label: 'Individual',
    },
    { reference: 'type', name: 'type', label: 'Type' },
    { reference: 'role', name: 'role', label: 'Role' },
    {
      reference: 'actions',
      name: 'guid',
      label: 'Actions',
      options: {
        customBodyRender: (_, relationship) => {
          return [
            <ActionIcon
              variant="view"
              href={`/individuals/${relationship?.nonSelfGuid}`}
              linkProps={{ newTab: true }}
            />,
            <ActionIcon
              variant={'delete'}
              onClick={() => {
                setConfirmDeleteDialog({
                  relationshipGuid: relationship?.guid,
                  open: true,
                });
              }}
            />,
          ];
        },
      },
    },
  ];

  return (
    <DataDisplay
      tableSize="medium"
      columns={relationshipCols}
      data={data}
      loading={loading}
    />
  );
}
