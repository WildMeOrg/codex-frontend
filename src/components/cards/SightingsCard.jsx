import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';

import { formatDate } from '../../utils/formatters';
import defaultProfile from '../../assets/defaultProfile.jpg';
import ActionIcon from '../ActionIcon';
import DataDisplay from '../dataDisplays/DataDisplay';
import Link from '../Link';
import Card from './Card';

// const fakeData = [ // TODO deleteMe
//   {
//     id: 'a83a65f9-f2c9-416e-b110-2a73732f943d',
//     individualId: 'WB-102',
//     profile: defaultProfile,
//     user: 'Joe Smith',
//     userId: 'lajfoiwejoiefjaasdf',
//     status: 'ready-for-review',
//     photoCount: 14,
//     matchCount: 4,
//     submissionDate: Date.now(),
//     verbatimLocality: 'Kenya',
//   },
//   {
//     id: 'csljlkdjafljsdlfjs',
//     individualId: 'WB-105',
//     profile: defaultProfile,
//     user: 'Betty Spinoza',
//     userId: 'lajfoiwejoiefjaasdf',
//     status: 'identification-complete',
//     photoCount: 6,
//     matchCount: 2,
//     submissionDate: Date.now(),
//     verbatimLocality: 'Kenya',
//   },
//   {
//     id: 'dfweaz',
//     individualId: 'WB-107',
//     profile: defaultProfile,
//     user: 'Joe Spinoza',
//     userId: 'lajfoiwejoiefjaasdf',
//     status: 'identification-complete',
//     photoCount: 12,
//     matchCount: 6,
//     submissionDate: Date.now(),
//     verbatimLocality: 'Kenya',
//   },
//   {
//     id: 'cqwe',
//     individualId: 'WB-105',
//     profile: defaultProfile,
//     user: 'Betty Smith',
//     userId: 'lajfoiwejoiefjaasdf',
//     status: 'identification-complete',
//     photoCount: 50,
//     matchCount: 1,
//     submissionDate: Date.now(),
//     verbatimLocality: 'Kenya',
//   },
// ];

const getAllColumns = onDelete => [
  {
    reference: 'individual',
    name: 'individualId',
    label: 'Individual',
    options: {
      customBodyRender: value => (
        <Link href={`/individuals/${value}`}>{value}</Link>
      ),
    },
  },
  {
    reference: 'date',
    name: 'submissionDate',
    label: 'Date',
    options: {
      customBodyRender: value => formatDate(value, true),
      getStringValue: value => formatDate(value, true),
    },
  },
  {
    reference: 'location',
    name: 'verbatimLocality',
    label: 'Location',
  },
  {
    reference: 'submitter',
    name: 'user',
    label: 'Submitter',
    options: {
      customBodyRender: value => (
        <Link href={`/users/${value}`}>{value}</Link>
      ),
    },
  },
  {
    reference: 'actions',
    name: 'id',
    label: 'Actions',
    options: {
      customBodyRender: value => (
        <div>
          <ActionIcon variant="view" href={`/individuals/${value}`} />
          <ActionIcon
            labelId="REMOVE"
            variant="delete"
            onClick={() => onDelete(value)}
          />
        </div>
      ),
    },
  },
];

export default function SightingsCard({
  title,
  titleId = 'SIGHTINGS',
  encounters,
  columns = [
    'individual',
    'date',
    'submitter',
    'location',
    'actions',
  ],
  onDelete,
}) {
  const theme = useTheme();

  const allColumns = getAllColumns(onDelete);
  const filteredColumns = allColumns.filter(c =>
    columns.includes(c.reference),
  );

  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        <div>
          <IconButton
            style={{ color: theme.palette.primary.main }}
            aria-label="View list"
          >
            <ViewList />
          </IconButton>
          <IconButton aria-label="View chart">
            <ViewMap />
          </IconButton>
        </div>
      }
    >
      <DataDisplay
        noTitleBar
        columns={filteredColumns}
        data={encounters}
      />
    </Card>
  );
}
