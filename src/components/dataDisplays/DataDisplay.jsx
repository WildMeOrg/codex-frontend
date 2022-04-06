import React, { useState } from 'react';
import { get, sortBy } from 'lodash-es';
import { useIntl } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LinearProgress from '@material-ui/core/LinearProgress';

import Print from '@material-ui/icons/Print';
import FilterList from '@material-ui/icons/FilterList';
import CloudDownload from '@material-ui/icons/CloudDownload';

import BaoDetective from '../svg/BaoDetective';
import FilterBar from '../FilterBar';
import Text from '../Text';
import TablePaginationActions from './TablePaginationActions';
import CollapsibleRow from './CollapsibleRow';
import sendCsv from './sendCsv';

function getCellAlignment(cellIndex, columnDefinition) {
  if (columnDefinition.align) return columnDefinition.align;
  if (cellIndex === 0) return undefined;
  return 'right';
}

/* Note for component consumers: every data item needs a unique ID!
   Yeah yeah typescript proptypes yeah yeah */
export default function DataDisplay({
  columns,
  data,
  title,
  titleId,
  onPrint,
  initiallySelectedRow = null,
  onSelectRow = Function.prototype,
  hideFilterSearch = false,
  showNoResultsBao = false,
  noResultsTextId,
  noResultsText,
  renderExpandedRow,
  variant = 'primary',
  idKey = 'id',
  tableSize = 'small',
  noTitleBar,
  loading,
  paginated = false,
  paginatedExternally = true, // display all data provided and let parent component(s) paginate
  page,
  onChangePage,
  rowsPerPage,
  dataCount, // in a paginated table there will be more data than provided to the data prop
  paperStyles = {},
  cellStyles = {},
  ...rest
}) {
  const intl = useIntl();
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;

  const initialColumnNames = columns
    .filter(c => get(c, 'options.display', true))
    .map(c => c.name);

  const [selectedRow, setSelectedRow] = useState(
    initiallySelectedRow,
  );
  const [visibleColumnNames, setVisibleColumnNames] = useState(
    initialColumnNames,
  );
  const [filter, setFilter] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const filterPopperOpen = Boolean(anchorEl);

  const startIndex = paginated ? page * rowsPerPage : 0;
  const endIndex = paginated
    ? (page + 1) * rowsPerPage - 1
    : Infinity;

  const visibleData = data?.filter((datum, index) => {
    if (index < startIndex && !paginatedExternally) return false;
    if (index > endIndex && !paginatedExternally) return false;

    let match = false;
    columns.forEach(c => {
      const userSuppliedDataParser = get(c, 'options.getStringValue');
      const rawValue = get(datum, c.name, '');
      let dataValue;
      if (userSuppliedDataParser) {
        const userValue = userSuppliedDataParser(rawValue, datum);
        dataValue = userValue
          ? userValue.toLowerCase().trim()
          : userValue;
      } else {
        const stringifiedValue = JSON.stringify(rawValue) || '';
        dataValue = stringifiedValue.toLowerCase().trim();
      }
      if (dataValue && dataValue.includes(filter.toLowerCase()))
        match = true;
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

  const noData = !loading && data && data?.length === 0;
  const useNoResultsUI =
    noResultsText || noResultsTextId || showNoResultsBao;
  const noResults = useNoResultsUI && noData;

  return (
    <div {...rest}>
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
                {!hideFilterSearch && (
                  <FilterBar
                    size="small"
                    width={140}
                    style={{ margin: '0 0 12px 0' }}
                    value={filter}
                    onChange={setFilter}
                  />
                )}
                {columns
                  .filter(c =>
                    get(c, 'options.displayInFilter', true),
                  )
                  .map(c =>
                  {
                    const columnLabel = c?.labelId ? intl.formatMessage({ id: c.labelId }) : c.label;
                    return (
                      <FormControlLabel
                        key={c.name}
                        control={
                          <Checkbox
                            size="small"
                            checked={visibleColumnNames.includes(
                              c.name,
                            )}
                            onClick={() =>
                            {
                              if (visibleColumnNames.includes(c.name))
                              {
                                if (visibleColumnNames.length === 1)
                                  return;
                                setVisibleColumnNames(
                                  visibleColumnNames.filter(
                                    vc => vc !== c.name,
                                  ),
                                );
                              } else
                              {
                                setVisibleColumnNames([
                                  ...visibleColumnNames,
                                  c.name,
                                ]);
                              }
                            }}
                          />
                        }
                        label={<Text variant="body2">{columnLabel}</Text>}
                      />
                    );
                  })}
              </Grid>
            </Paper>
          </Fade>
        )}
      </Popper>
      {!noTitleBar && (
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          style={{ margin: '16px 0' }}
        >
          <Grid item>
            <Text
              variant={
                variant === 'primary' ? 'subtitle1' : 'subtitle2'
              }
              style={{
                margin:
                  variant === 'secondary' ? '12px 0 0 12px' : 'unset',
              }}
              id={titleId}
            >
              {title}
            </Text>
          </Grid>
          <Grid item>
            {variant === 'primary' && (
              <IconButton
                onClick={() => sendCsv(visibleColumns, visibleData)}
                size="small"
              >
                <CloudDownload style={{ marginRight: 4 }} />
              </IconButton>
            )}
            {onPrint && (
              <IconButton onClick={onPrint} size="small">
                <Print style={{ marginRight: 4 }} />
              </IconButton>
            )}
            <IconButton
              onClick={event => {
                setAnchorEl(anchorEl ? null : event.currentTarget);
              }}
              size="small"
            >
              <FilterList />
            </IconButton>
          </Grid>
        </Grid>
      )}
      <TableContainer
        component={variant === 'secondary' ? Paper : undefined}
        elevation={variant === 'secondary' ? 2 : undefined}
        style={paperStyles}
      >
        <Table
          style={{ minWidth: 10 }}
          size={tableSize}
          aria-label={title}
        >
          <TableHead>
            <TableRow>
              {renderExpandedRow && <TableCell />}
              {visibleColumns.map((c, i) => {
                const activeSort = c.name === sortColumn;
                const columnLabel = c?.labelId ? intl.formatMessage({ id: c.labelId }) : c.label;
                return (
                  <TableCell
                    key={c.name}
                    align={getCellAlignment(i, c)}
                    sortDirection={activeSort ? sortDirection : false}
                    style={{ whiteSpace: 'nowrap' }}
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
                      {columnLabel}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              sortedData?.map(datum => (
                <CollapsibleRow
                  key={get(datum, idKey)}
                  onClick={() => {
                    if (selectedRow === get(datum, idKey)) {
                      setSelectedRow(null);
                      onSelectRow(null);
                    } else {
                      setSelectedRow(get(datum, idKey));
                      onSelectRow(datum);
                    }
                  }}
                  selected={selectedRow === get(datum, idKey)}
                  datum={datum}
                  cellStyles={cellStyles}
                  columns={visibleColumns}
                  renderExpandedRow={renderExpandedRow}
                />
              ))}
          </TableBody>
          {paginated && !loading && !noResults && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  page={page}
                  count={dataCount || get(data, 'length', 0)}
                  onChangePage={onChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[rowsPerPage]}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      {noResults && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {showNoResultsBao && (
            <BaoDetective
              style={{ width: 240, marginTop: 40 }}
              themeColor={themeColor}
            />
          )}
          <Text
            id={noResultsTextId}
            variant="body2"
            style={{ marginTop: 12 }}
          >
            {noResultsText ||
              'Your search did not match any records.'}
          </Text>
        </div>
      )}
      {loading && <LinearProgress style={{ margin: '16px 32px' }} />}
    </div>
  );
}
