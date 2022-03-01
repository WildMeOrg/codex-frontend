import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import ActionIcon from '../../components/ActionIcon';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { cellRendererTypes } from '../../components/dataDisplays/cellRenderers';

export default function AGSTable({ assetGroupSightings }) {
  const intl = useIntl();

  const transformedData = assetGroupSightings.map(ags => ({
    ...ags,
    time: ags?.config?.time,
    timeSpecificity: ags?.config?.timeSpecificity,
    locationId: ags?.config?.locationId,
    assetCount: get(ags, ['assets', 'length'], 0),
  }));

  const columns = [
    {
      reference: 'date',
      name: 'time',
      label: 'Date',
      options: {
        cellRenderer: cellRendererTypes.specifiedTime,
      },
    },
    {
      reference: 'locationId',
      name: 'formattedLocation',
      label: 'Location',
      options: {
        cellRenderer: cellRendererTypes.location,
      },
    },
    {
      reference: 'assetCount',
      name: 'assetCount',
      label: 'Asset count',
    },
    {
      reference: 'actions',
      name: 'guid',
      label: 'Actions',
      options: {
        customBodyRender: value => (
          <div>
            <ActionIcon
              variant="view"
              href={`/pending-sightings/${value}`}
            />
          </div>
        ),
      },
    },
  ];

  const tableTitle = intl.formatMessage(
    { id: 'X_SIGHTINGS' },
    { x: transformedData?.length },
  );

  return (
    <DataDisplay
      variant="secondary"
      title={tableTitle}
      idKey="guid"
      data={transformedData}
      columns={columns}
      style={{ marginTop: 20 }}
    />
  );
}
