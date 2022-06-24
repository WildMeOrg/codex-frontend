import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link as RouterLink } from 'react-router-dom';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DownIcon from '@material-ui/icons/ArrowDropDown';

import Button from './Button';

export default function ButtonMenu({
  children,
  buttonId,
  actions,
  ...rest
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick} endIcon={<DownIcon />} {...rest}>
        {children}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        id={buttonId}
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
        {actions.map(action => (
          <MenuItem
            key={action.id}
            onClick={e => {
              if (action.onClick) action.onClick(e);
              handleClose();
            }}
            component={action.href ? RouterLink : undefined}
            to={action.href}
          >
            {action?.labelId ? (
              <FormattedMessage id={action.labelId} />
            ) : (
              action.label
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
