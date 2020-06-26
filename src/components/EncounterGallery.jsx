import React, { useState } from 'react';
import { format } from 'date-fns';
import MUIDataTable from 'mui-datatables';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewList from '@material-ui/icons/ViewList';
import EncounterCard from './EncounterCard';
import Link from './Link';
import DataDisplay from './dataDisplays/DataDisplay';

export default function EncounterGallery({
  title,
  encounters,
  hideSubmitted,
  hideIndividual,
}) {
  const [tableView, setTableView] = useState(true);

  return (
    <div style={{ margin: '0 12px' }}>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        style={{ margin: '16px 0' }}
      >
        <Grid item>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
        </Grid>
        <Grid item style={{ marginRight: 4 }}>
          <IconButton
            onClick={() => setTableView(false)}
            style={{ background: tableView ? 'unset' : '#ccc' }}
          >
            <ViewModule />
          </IconButton>
          <IconButton
            onClick={() => setTableView(true)}
            style={{ background: tableView ? '#ccc' : 'unset' }}
          >
            <ViewList />
          </IconButton>
        </Grid>
      </Grid>
      {!tableView && (
        <Grid container spacing={3}>
          {encounters.map(encounter => (
            <Grid item key={encounter.id}>
              <EncounterCard
                encounter={encounter}
                hideSubmitted={hideSubmitted}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {tableView && (
        <MUIDataTable
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
                display: hideSubmitted ? 'false' : 'true',
              },
            },
          ]}
          data={encounters}
          options={{
            elevation: 0,
            pagination: false,
            print: false,
            selectableRows: 'none',
          }}
        />
      )}
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
        title="Sightings of Teddy"
      />
    </div>
  );
}
