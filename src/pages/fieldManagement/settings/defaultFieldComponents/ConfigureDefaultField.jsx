import React from 'react';
import { FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CustomAlert from '../../../../components/Alert';

import Button from '../../../../components/Button';
import StandardDialog from '../../../../components/StandardDialog';

export default function EditField({
  open,
  onClose,
  onSubmit,
  error,
  children,
}) {
  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      titleId="EDIT_FIELD"
    >
      <DialogContent style={{ minWidth: 200 }}>
        {children}
        {error && (
          <CustomAlert
            severity="error"
            titleId="SUBMISSION_ERROR"
            description={error}
          />
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button display="primary" onClick={onSubmit}>
          <FormattedMessage id="SAVE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
