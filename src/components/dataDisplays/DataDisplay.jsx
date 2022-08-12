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
  selectionControlled = false,
  selectedRow: selectedRowFromProps,
  onSelectRow = Function.prototype,
  hideFilterSearch = false,
  hideFilterColumns = false,
  hideDownloadCsv = false,
  showNoResultsBao = false,
  noResultsTextId,
  noResultsText,
  renderExpandedRow,
  variant = 'primary',
  idKey = 'id',
  tableSize = 'small',
  noTitleBar,
  loading,
  sortExternally,
  searchParams,
  setSearchParams,
  tableStyles = {},
  cellStyles = {},
  stickyHeader = true,
  tableContainerStyles = {},
  ...rest
}) {
  const intl = useIntl();
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;

  const initialColumnNames = columns
    .filter(c => get(c, 'options.display', true))
    .map(c => c.name);

  const [internalSelectedRow, setInternalSelectedRow] = useState();
  const [visibleColumnNames, setVisibleColumnNames] = useState(
    initialColumnNames,
  );
  const [filter, setFilter] = useState('');
  const [internalSortColumn, setInternalSortColumn] = useState(null);
  const [internalSortDirection, setInternalSortDirection] =
    useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const filterPopperOpen = Boolean(anchorEl);

  const selectedRow = selectionControlled
    ? selectedRowFromProps
    : internalSelectedRow;

  const visibleData = data?.filter(datum => {
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
  if (internalSortColumn) {
    sortedData = sortBy(data, internalSortColumn);
    if (internalSortDirection === 'asc') sortedData.reverse();
  }
  const sortColumn = sortExternally
    ? searchParams?.sort
    : internalSortColumn;
  const externalSortDirection = searchParams?.reverse
    ? 'desc'
    : 'asc';
  const sortDirection = sortExternally
    ? externalSortDirection
    : internalSortDirection;

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
        style={{ zIndex: theme.zIndex.appBar - 1 }}
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
                  .map(c => {
                    const columnLabel = c?.labelId
                      ? intl.formatMessage({ id: c.labelId })
                      : c?.label;
                    return (
                      <FormControlLabel
                        key={c.name}
                        control={
                          <Checkbox
                            size="small"
                            checked={visibleColumnNames.includes(
                              c.name,
                            )}
                            onClick={() => {
                              if (
                                visibleColumnNames.includes(c.name)
                              ) {
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
                          <Text variant="body2">{columnLabel}</Text>
                        }
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
            {variant === 'primary' && !hideDownloadCsv && (
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
            {!hideFilterColumns && (
              <IconButton
                onClick={event => {
                  setAnchorEl(anchorEl ? null : event.currentTarget);
                }}
                size="small"
              >
                <FilterList />
              </IconButton>
            )}
          </Grid>
        </Grid>
      )}
      <TableContainer
        component={variant === 'secondary' ? Paper : undefined}
        elevation={variant === 'secondary' ? 2 : undefined}
        style={tableContainerStyles}
      >
        <Table
          stickyHeader={stickyHeader}
          style={{ minWidth: 10, ...tableStyles }}
          size={tableSize}
          aria-label={title}
        >
          <colgroup>
            {columns.map(c => (
              <col
                key={c.name}
                style={
                  get(c, 'options.width')
                    ? { width: c.options.width }
                    : {}
                }
              />
            ))}
          </colgroup>
          <TableHead>
            <TableRow>
              {renderExpandedRow && <TableCell />}
              {visibleColumns.map((c, i) => {
                const sortable = get(c, 'sortable', true);
                const activeSort =
                  c.name === sortColumn || c.sortName === sortColumn;
                const columnLabel = c?.labelId
                  ? intl.formatMessage({ id: c.labelId })
                  : c?.label;
                return (
                  <TableCell
                    key={c.name}
                    align={getCellAlignment(i, c)}
                    sortDirection={activeSort ? sortDirection : false}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {sortable ? (
                      <TableSortLabel
                        active={activeSort}
                        direction={activeSort ? sortDirection : 'asc'}
                        onClick={() => {
                          if (sortExternally) {
                            const nextReverse = activeSort
                              ? !searchParams?.reverse
                              : false;
                            setSearchParams({
                              ...searchParams,
                              sort: c.sortName || c.name,
                              reverse: nextReverse,
                            });
                          } else {
                            setInternalSortDirection(
                              sortDirection === 'asc'
                                ? 'desc'
                                : 'asc',
                            );
                            setInternalSortColumn(c.name);
                          }
                        }}
                      >
                        {columnLabel}
                      </TableSortLabel>
                    ) : (
                      columnLabel
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              sortedData?.map((datum, rowIndex) => (
                <CollapsibleRow
                  key={get(datum, idKey)}
                  onClick={() => {
                    if (selectedRow === get(datum, idKey)) {
                      if (!selectionControlled)
                        setInternalSelectedRow(null);
                      onSelectRow(null);
                    } else {
                      if (!selectionControlled)
                        setInternalSelectedRow(get(datum, idKey));
                      onSelectRow(datum);
                    }
                  }}
                  selected={selectedRow === get(datum, idKey)}
                  datum={datum}
                  cellStyles={cellStyles}
                  columns={visibleColumns}
                  renderExpandedRow={renderExpandedRow}
                  rowIndex={rowIndex}
                />
              ))}
          </TableBody>
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
