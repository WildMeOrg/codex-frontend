import React from 'react';

import DialogActions from '@material-ui/core/DialogActions';

import Text from '../Text';
import Button from '../Button';
import StandardDialog from '../StandardDialog';

export default function ErrorDialog({ open, onClose, errorMessage }) {
  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId="AN_ERROR_OCCURRED"
    >
      <div style={{ padding: '16px 24px' }}>
        <Text variant="body2">{errorMessage}</Text>
      </div>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="primary" onClick={onClose} id="CLOSE" />
      </DialogActions>
    </StandardDialog>
  );
}
