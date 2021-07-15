import React from 'react';
import { format } from 'date-fns';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';
import DataDisplay from '../dataDisplays/DataDisplay';
import Link from '../Link';
import Card from './Card';

import defaultProfile from '../../assets/defaultProfile.jpg';

const fakeData = [
  {
    id: 'lkfjaoiwejflkajasd',
    individualId: 'WB-102',
    profile: defaultProfile,
    user: 'Joe Smith',
    userId: 'lajfoiwejoiefjaasdf',
    status: 'ready-for-review',
    photoCount: 14,
    matchCount: 4,
    submissionDate: Date.now(),
  },
  {
    id: 'csljlkdjafljsdlfjs',
    individualId: 'WB-105',
    profile: defaultProfile,
    user: 'Betty Spinoza',
    userId: 'lajfoiwejoiefjaasdf',
    status: 'identification-complete',
    photoCount: 6,
    matchCount: 2,
    submissionDate: Date.now(),
  },
  {
    id: 'dfweaz',
    individualId: 'WB-107',
    profile: defaultProfile,
    user: 'Joe Spinoza',
    userId: 'lajfoiwejoiefjaasdf',
    status: 'identification-complete',
    photoCount: 12,
    matchCount: 6,
    submissionDate: Date.now(),
  },
  {
    id: 'cqwe',
    individualId: 'WB-105',
    profile: defaultProfile,
    user: 'Betty Smith',
    userId: 'lajfoiwejoiefjaasdf',
    status: 'identification-complete',
    photoCount: 50,
    matchCount: 1,
    submissionDate: Date.now(),
  },
];

export default function SightingsCard({
  title,
  titleId = 'SIGHTINGS',
  encounters = fakeData,
  hideIndividual,
}) {
  const theme = useTheme();
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
      />
    </Card>
  );
}
