import React from 'react';
import { format } from 'date-fns';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ViewList from '@material-ui/icons/ViewList';
import ViewMap from '@material-ui/icons/Language';
import DataDisplay from '../dataDisplays/DataDisplay';
import Link from '../Link';
import Card from './Card';

export default function SightingsCard({
  title,
  titleId = 'SIGHTINGS',
  encounters,
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
