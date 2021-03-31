import React from 'react';
import { FormattedMessage } from 'react-intl';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Button from './Button';
import Text from './Text';
import StandardDialog from './StandardDialog';

export default function ConfirmDelete({
  open,
  onClose,
  onDelete,
  entityToDelete,
  message,
  error,
  titleId,
}) {
  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId={titleId || 'CONFIRM_DELETE'}
    >
      <DialogContent>
        <Text
          id="CONFIRM_DELETE_DESCRIPTION"
          values={{ entity: entityToDelete }}
        >
          {message}
        </Text>
        {error && (
          <Alert severity="error">
            <AlertTitle>
              <FormattedMessage id="SUBMISSION_ERROR" />
            </AlertTitle>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button display="primary" onClick={onDelete}>
          <FormattedMessage id="DELETE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
