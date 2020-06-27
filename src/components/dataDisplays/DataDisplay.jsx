import React, { useState } from 'react';
import { get, sortBy } from 'lodash-es';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Print from '@material-ui/icons/Print';
import FilterList from '@material-ui/icons/FilterList';
import CloudDownload from '@material-ui/icons/CloudDownload';

import FilterBar from '../FilterBar';
import CollabsibleRow from './CollapsibleRow';
import sendCsv from './sendCsv';

function getCellAlignment(cellIndex) {
  if (cellIndex === 0) return undefined;
  return 'right';
}

export default function DataDisplay({
  columns,
  data,
  title,
  onPrint,
  renderExpandedRow,
}) {
  const initialColumnNames = columns
    .filter(c => get(c, 'options.display', true))
    .map(c => c.name);

  const [visibleColumnNames, setVisibleColumnNames] = useState(
    initialColumnNames,
  );
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const filterPopperOpen = Boolean(anchorEl);

  const visibleData = data.filter(datum => {
    let match = false;
    columns.forEach(c => {
      const dataParser =
        get(c, 'options.getStringValue') || JSON.stringify;
      const dataValue = dataParser(get(datum, c.name, ''));
      if (dataValue.includes(filter)) match = true;
    });
    return match;
  });

  let sortedData = visibleData;
  if (sortColumn) {
    sortedData = sortBy(data, sortColumn);
    if (sortDirection === 'asc') sortedData.reverse();
  }

  const visibleColumns = columns.filter(column =>
    visibleColumnNames.includes(column.name),
  );

  return (
    <div>
      <Popper
        open={filterPopperOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              style={{ padding: '20px 32px 20px 20px' }}
              elevation={8}
            >
              <Grid container direction="column">
                <FilterBar
                  size="small"
                  width={140}
                  style={{ margin: '0 0 12px 0' }}
                  value={filter}
                  onChange={setFilter}
                />
                {columns.map(c => (
                  <FormControlLabel
                    key={c.name}
                    control={
                      <Checkbox
                        size="small"
                        checked={visibleColumnNames.includes(c.name)}
                        onClick={() => {
                          if (visibleColumnNames.includes(c.name)) {
                            if (visibleColumnNames.length === 1)
                              return;
                            setVisibleColumnNames(
                              visibleColumnNames.filter(
                                vc => vc !== c.name,
                              ),
                            );
                          } else {
                            setVisibleColumnNames([
                              ...visibleColumnNames,
                              c.name,
                            ]);
                          }
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        {c.label}
                      </Typography>
                    }
                  />
                ))}
              </Grid>
            </Paper>
          </Fade>
        )}
      </Popper>
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
        <Grid item>
          <IconButton
            onClick={() => sendCsv(visibleColumns, visibleData)}
            size="small"
          >
            <CloudDownload style={{ marginRight: 4 }} />
          </IconButton>
          {onPrint && (
            <IconButton onClick={onPrint} size="small">
              <Print style={{ marginRight: 4 }} />
            </IconButton>
          )}
          <IconButton size="small">
            <FilterList
              onClick={event => {
                setAnchorEl(anchorEl ? null : event.currentTarget);
              }}
            />
          </IconButton>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table
          style={{ minWidth: 10 }}
          size="small"
          aria-label={title}
        >
          <TableHead>
            <TableRow>
              {renderExpandedRow && <TableCell />}
              {visibleColumns.map((c, i) => {
                const activeSort = c.name === sortColumn;
                return (
                  <TableCell
                    key={c.name}
                    align={getCellAlignment(i)}
                    sortDirection={activeSort ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={activeSort}
                      direction={activeSort ? sortDirection : 'asc'}
                      onClick={() => {
                        setSortDirection(
                          sortDirection === 'asc' ? 'desc' : 'asc',
                        );
                        setSortColumn(c.name);
                      }}
                    >
                      {c.label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map(datum => (
              <CollabsibleRow
                datum={datum}
                columns={visibleColumns}
                renderExpandedRow={renderExpandedRow}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
