import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export default function DeleteButton({ ...rest }) {
  return (
    <IconButton size="small" {...rest}>
      <DeleteIcon />
    </IconButton>
  );
}
