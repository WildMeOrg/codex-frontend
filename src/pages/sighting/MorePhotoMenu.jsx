import React from 'react';
import { FormattedMessage } from 'react-intl';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function MorePhotoMenu({
  id,
  anchorEl,
  open,
  onClose,
  onClickAddAnnotation = Function.prototype,
  // onClickDelete = Function.prototype,
}) {
  return (
    <Menu id={id} anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={onClickAddAnnotation}>
        <FormattedMessage id="ADD_ANNOTATION" />
      </MenuItem>
      {/* <MenuItem onClick={onClickDelete}>
        <FormattedMessage id="DELETE_PHOTOGRAPH" />
      </MenuItem> */}
    </Menu>
  );
}
