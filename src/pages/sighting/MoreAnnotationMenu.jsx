import React from 'react';
import { FormattedMessage } from 'react-intl';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function MoreAnnotationMenu({
  id,
  anchorEl,
  // pending,
  open,
  onClose,
  // onClickStartIdentification = Function.prototype,
  // onClickEditAnnotation = Function.prototype,
  onClickDelete = Function.prototype,
}) {
  return (
    <Menu id={id} anchorEl={anchorEl} open={open} onClose={onClose}>
      {/* <MenuItem onClick={onClickEditAnnotation}>
        <FormattedMessage id="EDIT_ANNOTATION" />
      </MenuItem> */}
      {/* <MenuItem
        disabled={pending}
        onClick={onClickStartIdentification}
      >
        <FormattedMessage id="START_IDENTIFICATION" />
      </MenuItem> */}
      <MenuItem onClick={onClickDelete}>
        <FormattedMessage id="DELETE_ANNOTATION" />
      </MenuItem>
    </Menu>
  );
}
