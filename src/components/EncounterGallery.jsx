import React, { useState } from 'react';
import { format } from 'date-fns';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ViewModule from '@material-ui/icons/ViewModule';
import ViewList from '@material-ui/icons/ViewList';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import EncounterCard from './EncounterCard';
import TablePaginationActions from './TablePaginationActions';
import Link from './Link';

export default function EncounterGallery({
  title,
  encounters,
  hideSubmitted,
}) {
  const [tableView, setTableView] = useState(true);

  return (
    <div style={{ marginLeft: 12 }}>
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Individual</TableCell>
                <TableCell>Photographs</TableCell>
                <TableCell>Submitter</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {encounters.map(encounter => (
                <TableRow>
                  <TableCell>
                    {format(encounter.submissionDate, 'M/dd/yy')}
                  </TableCell>
                  <TableCell>
                    <Link href="https://www.google.com/">
                      {encounter.individualId}
                    </Link>
                  </TableCell>
                  <TableCell>{encounter.photoCount}</TableCell>
                  <TableCell>
                    <Link href="https://www.google.com/">
                      {encounter.user}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {encounters.length > 20 && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    ActionsComponent={TablePaginationActions}
                    rowsPerPageOptions={[20]}
                    count={encounters.length}
                    page={0}
                    rowsPerPage={20}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
