import React, { useState } from 'react';
import { get } from 'lodash-es';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';

function getCellAlignment(cellIndex) {
  if (cellIndex === 0) return undefined;
  return 'right';
}

function defaultCellRenderer(value) {
  return value || '';
}

export default function CollabsibleRow({
  columns,
  datum,
  renderExpandedRow,
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        {renderExpandedRow && (
          <TableCell style={{ borderBottom: 'none' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <UpIcon /> : <DownIcon />}
            </IconButton>
          </TableCell>
        )}
        {columns.map((c, i) => {
          const cellValue = get(datum, c.name);
          const cellRenderer = get(
            c,
            'options.customBodyRender',
            defaultCellRenderer,
          );

          return (
            <TableCell
              key={c.name}
              align={getCellAlignment(i)}
              style={{
                borderBottom: renderExpandedRow ? 'none' : undefined,
              }}
            >
              {cellRenderer(cellValue)}
            </TableCell>
          );
        })}
      </TableRow>
      {renderExpandedRow && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              {renderExpandedRow(datum)}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
