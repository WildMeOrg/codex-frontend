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
  onClearError,
  deleteInProgress,
  entityToDelete,
  messageId,
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
          id={messageId || 'CONFIRM_DELETE_DESCRIPTION'}
          values={{ entity: entityToDelete }}
        >
          {message}
        </Text>
        {error && (
          <Alert
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
            onClose={onClearError}
          >
            <AlertTitle>
              <FormattedMessage id="SERVER_ERROR" />
            </AlertTitle>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button loading={deleteInProgress} display="primary" onClick={onDelete}>
          <FormattedMessage id="DELETE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
