import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import LastPageIcon from '@material-ui/icons/LastPage';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import FirstPageIcon from '@material-ui/icons/FirstPage';

export default function TablePaginationActions() {
  return (
    <div style={{ width: 300, marginLeft: 20 }}>
      <IconButton>
        <FirstPageIcon />
      </IconButton>
      <IconButton>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton>
        <KeyboardArrowRight />
      </IconButton>
      <IconButton>
        <LastPageIcon />
      </IconButton>
    </div>
  );
}
