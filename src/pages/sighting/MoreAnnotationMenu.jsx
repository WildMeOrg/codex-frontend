import React from 'react';
import { FormattedMessage } from 'react-intl';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function MoreAnnotationMenu({
  id,
  anchorEl,
  open,
  onClose,
  // onClickEditAnnotation = Function.prototype,
  onClickDelete = Function.prototype,
}) {
  return (
    <Menu id={id} anchorEl={anchorEl} open={open} onClose={onClose}>
      {/* <MenuItem onClick={onClickEditAnnotation}>
        <FormattedMessage id="EDIT_ANNOTATION" />
      </MenuItem> */}
      <MenuItem onClick={onClickDelete}>
        <FormattedMessage id="DELETE_ANNOTATION" />
      </MenuItem>
    </Menu>
  );
}
