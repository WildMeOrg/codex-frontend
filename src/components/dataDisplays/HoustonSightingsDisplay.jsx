import React from 'react';

import ActionIcon from '../ActionIcon';
import { cellRendererTypes } from './cellRenderers';
import DataDisplay from './DataDisplay';

export default function HoustonSightingsDisplay({
  sightings,
  columns = ['date', 'location', 'actions'],
  onDelete,
  linkPath = 'sightings',
  noSightingsMsg = 'NO_SIGHTINGS',
  loading,
  ...rest
}) {
  const allColumns = [
    {
      reference: 'date',
      name: 'time',
      labelId: 'DATE_OF_SIGHTING',
      options: {
        cellRenderer: cellRendererTypes.specifiedTime,
      },
    },
    {
      reference: 'location',
      name: 'formattedLocation',
      labelId: 'LOCATION',
      options: {
        cellRenderer: cellRendererTypes.location,
      },
    },
    {
      reference: 'locationIdValue',
      name: 'locationId_value',
      labelId: 'LOCATION',
    },
    {
      reference: 'created',
      name: 'created',
      labelId: 'DATE_REPORTED',
      options: {
        cellRenderer: cellRendererTypes.date,
      },
    },
    {
      reference: 'submissionTime',
      name: 'submissionTime',
      labelId: 'DATE_REPORTED',
      options: {
        cellRenderer: cellRendererTypes.date,
        cellRendererProps: { accessor: 'submissionTime' },
      },
    },
    {
      reference: 'stage',
      name: 'stage',
      labelId: 'STAGE',
      options: {
        cellRenderer: cellRendererTypes.capitalizedString,
      },
    },
    {
      reference: 'actions',
      name: 'guid',
      labelId: 'ACTIONS',
      options: {
        customBodyRender: value => (
          <div>
            <ActionIcon
              variant="view"
              href={`/${linkPath}/${value}`}
            />
            {onDelete && (
              <ActionIcon
                labelId="REMOVE"
                variant="delete"
                onClick={() => onDelete(value)}
              />
            )}
          </div>
        ),
      },
    },
  ];

  const filteredColumns = allColumns?.filter(c =>
    columns.includes(c.reference),
  );

  return (
    <DataDisplay
      idKey="guid"
      columns={filteredColumns}
      data={sightings}
      loading={loading}
      noResultsTextId={noSightingsMsg}
      {...rest}
    />
  );
}
