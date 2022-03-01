import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Text from './Text';

export default function MoreMenu({ menuId, items = [], ...rest }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleClick}
        style={{ marginLeft: 4 }}
        {...rest}
      >
        <MoreIcon />
      </IconButton>
      <Menu
        id={`${menuId}-menu`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {items.map(item => (
          <MenuItem
            key={item.id}
            onClick={e => {
              item.onClick(e);
              handleClose();
            }}
          >
            <Text id={item.labelId}>{item.label}</Text>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
