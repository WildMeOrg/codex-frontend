import React from 'react';

import Link from '../Link';
import DataDisplay from './DataDisplay';
import { cellRendererTypes } from './cellRenderers';

export default function ElasticsearchEncountersDisplay({
  encounters,
  loading,
  dataCount,
  formFilters,
  ...rest
}) {
  const title = `${dataCount || encounters?.length} matching animals`;

  const columns = [
    {
      name: 'individualContext',
      labelId: 'NAME',
      sortable: false,
      align: 'left',
    },
    {
      name: 'autogenName',
      labelId: 'CODEX_ID',
      sortable: false,
      align: 'left',
    },
    {
      name: 'taxonomy_guid',
      labelId: 'SPECIES',
      align: 'left',
      sortable: false,
      options: { cellRenderer: cellRendererTypes.species },
    },
    {
      name: 'state',
      labelId: 'STATE',
      sortable: false,
      align: 'left',
      options: {
        customBodyRender: (
          match_state,
          sighting, // eslint-disable-line
        ) => (
          <Link to={`/sightings/${sighting}`}>
            {match_state || 'Unprocessed'}
          </Link>
        ),
      },
    },
    {
      name: 'time',
      sortName: 'time.datetime',
      labelId: 'ENCOUNTER_TIME',
      options: {
        cellRenderer: cellRendererTypes.specifiedTime,
      },
    },
    {
      name: 'locationId_value',
      labelId: 'REGION',
      sortable: false,
      align: 'left',
    },
    {
      name: 'decimalLatitude',
      labelId: 'LATITUDE',
      sortable: false,
      align: 'left',
    },
    {
      name: 'decimalLongitude',
      labelId: 'LONGTITUDE',
      sortable: false,
      align: 'left',
    },
    {
      name: 'verbatimLocality',
      labelId: 'FREEFORM_LOCATION',
      sortable: false,
      align: 'left',
    },
  ];

  return (
    <DataDisplay
      idKey="guid"
      columns={columns}
      data={encounters}
      title={title}
      loading={loading}
      showNoResultsBao
      formFilters={formFilters}
      {...rest}
    />
  );
}
