import React from 'react';
import { get } from 'lodash-es';

import ActionIcon from '../ActionIcon';
import Link from '../Link';
import DataDisplay from './DataDisplay';
import { cellRendererTypes } from '../dataDisplays/cellRenderers';

export default function SightingsDisplay({
  sightings,
  loading,
  dataCount,
  ...rest
}) {
  const title = `${dataCount || sightings.length} matching sightings`;

  const tableData = sightings.map(sighting => {
    const encounters = sighting?.encounters || [];
    const photoCount = encounters.reduce((memo, e) => {
      memo += e.images.length;
      return memo;
    }, 0);

    const individuals = encounters.reduce((memo, e) => {
      const individual = get(e, 'individual.id', null);
      return individual ? [...memo, individual] : null;
    }, []);

    return {
      ...sighting,
      photoCount,
      individuals,
    };
  });

  const columns = [
    {
      name: 'time',
      sortName: 'time.datetime',
      labelId: 'SIGHTING_TIME',
      options: {
        cellRenderer: cellRendererTypes.specifiedTime,
      },
    },
    {
      name: 'locationId_value',
      sortName: 'elasticsearch.locationId_keyword',
      labelId: 'REGION',
      sortable: true,
      align: 'left',
    },
    {
      name: 'owners',
      sortName: 'owners.full_name',
      labelId: 'REPORTER',
      sortable: false,
      align: 'left',
      options: {
        customBodyRender: owners => {
          const ownerName = get(
            owners,
            [0, 'full_name'],
            'Unknown User',
          );
          const ownerGuid = get(owners, [0, 'guid']);
          return (
            <Link href={`/users/${ownerGuid}`}>{ownerName}</Link>
          );
        },
      },
    },
    {
      name: 'created',
      labelId: 'CREATION_DATE_RANGE',
      align: 'left',
      options: { cellRenderer: cellRendererTypes.date },
    },
    {
      name: 'guid',
      labelId: 'ACTIONS',
      sortable: false,
      options: {
        customBodyRender: guid => {
          return (
            <ActionIcon
              labelId="VIEW"
              variant="view"
              href={`/sightings/${guid}`}
              linkProps={{ newTab: true }}
            />
          );
        },
      },
    },
  ];

  return (
    <DataDisplay
      idKey="guid"
      columns={columns}
      data={tableData}
      title={title}
      loading={loading}
      showNoResultsBao
      // renderExpandedRow={expandedSighting => (
      //   <div style={{ display: 'flex' }}>
      //     <img
      //       src={expandedSighting.profile}
      //       alt="Expanded sighting"
      //       style={{
      //         width: 200,
      //         height: 160,
      //         padding: 20,
      //       }}
      //     />
      //     <div style={{ padding: '20px 0' }}>
      //       <Text variant="subtitle1" id="SIGHTING_DETAILS" />
      //       <Text>Species: Megaptera novaeangliae</Text>
      //       <Text>Region: South Sahara</Text>
      //       <ButtonLink
      //         display="panel"
      //         style={{ marginTop: 16 }}
      //         href={`/sightings/${expandedSighting.id}`}
      //       >
      //         <FormattedMessage id="VIEW_SIGHTING" />
      //       </ButtonLink>
      //     </div>
      //   </div>
      // )}
      {...rest}
    />
  );
}
