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
      name: 'individualNamesWithContexts.FirstName',
      labelId: 'NAME',
      sortable: false,
      align: 'left',
    },
    {
      name: 'individualNamesWithContexts',
      labelId: 'CODEX_ID',
      sortable: false,
      align: 'left',
      options: {
        customBodyRender: (
          // eslint-disable-line
          objects,
          encounter,
        ) => {
          const autogenKeys = Object.keys(objects).filter(key =>
            key.startsWith('autogen-'),
          );
          const autogenContent = autogenKeys
            .map(key => objects[key])
            .join(', ');
          return (
            <Link to={`/individuals/${encounter?.individual_guid}`}>
              {autogenContent}
            </Link>
          );
        },
      },
    },
    {
      name: 'taxonomy_guid',
      labelId: 'SPECIES',
      align: 'left',
      sortable: false,
      options: { cellRenderer: cellRendererTypes.species },
    },
    {
      name: 'match_state',
      labelId: 'STATE',
      sortable: false,
      align: 'left',
      options: {
        customBodyRender: (
          // eslint-disable-line
          match_state,
          encounter,
        ) => (
          <Link to={`/sightings/${encounter?.sighting_guid}`}>
            {match_state || 'Unprocessed'}
          </Link>
        ),
      },
    },
    {
      name: 'time',
      sortName: 'time.datetime',
      labelId: 'ENCOUNTER_TIME',
      align: 'left',
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
      name: 'location_geo_point.lat',
      labelId: 'LATITUDE',
      sortable: false,
      align: 'left',
    },
    {
      name: 'location_geo_point.lon',
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
      titleId="encounters"
      loading={loading}
      showNoResultsBao
      formFilters={formFilters}
      {...rest}
    />
  );
}
