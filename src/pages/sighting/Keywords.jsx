import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Cancel';

import { getKeywordColor } from '../../utils/colorUtils';

export default function Keywords({
  annotation,
  style,
  children,
  ...rest
}) {
  const theme = useTheme();

  return (
    <div
      style={{
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...style,
      }}
      {...rest}
    >
      <Chip
        style={{
          marginRight: 4,
          color: theme.palette.common.white,
          backgroundColor: getKeywordColor('iewja'),
        }}
        label="Hey"
        deleteIcon={
          <DeleteIcon style={{ fill: theme.palette.common.white }} />
        }
        onDelete={() => {}}
      />
      <Chip
        style={{
          marginRight: 4,
          color: theme.palette.common.white,
          backgroundColor: getKeywordColor('Notmuchmang'),
        }}
        label="Notmuchmang"
        deleteIcon={
          <DeleteIcon style={{ fill: theme.palette.common.white }} />
        }
        onDelete={() => {}}
      />
      {children}
    </div>
  );
}
