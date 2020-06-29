import React from 'react';
import { format } from 'date-fns';
import Link from './Link';
import DataDisplay from './dataDisplays/DataDisplay';

export default function EncounterGallery({
  title,
  encounters,
  hideIndividual,
}) {
  return (
    <div style={{ margin: '0 12px' }}>
      <DataDisplay
        columns={[
          {
            name: 'id',
            label: 'Sighting ID',
            options: {
              customBodyRender: value => (
                <Link href={`/sightings/${value}`}>{value}</Link>
              ),
            },
          },
          {
            name: 'individualId',
            label: 'Individual',
            options: {
              customBodyRender: value => (
                <Link href={`/individuals/${value}`}>{value}</Link>
              ),
              display: hideIndividual ? 'false' : 'true',
            },
          },
          {
            name: 'submissionDate',
            label: 'Date',
            options: {
              customBodyRender: value => format(value, 'M/dd/yy'),
              getStringValue: value => format(value, 'M/dd/yy'),
            },
          },
          {
            name: 'photoCount',
            label: 'Photographs',
          },
          {
            name: 'user',
            label: 'Submitter',
            options: {
              customBodyRender: value => (
                <Link href={`/users/${value}`}>{value}</Link>
              ),
              display: false,
            },
          },
        ]}
        data={encounters}
        title={title}
      />
    </div>
  );
}
