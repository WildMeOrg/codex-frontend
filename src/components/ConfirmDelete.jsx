import React from 'react';
import { FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import CustomAlert from './Alert';
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
  deleteDisabled = false,
  messageId,
  message,
  errorTitleId = 'SERVER_ERROR',
  error,
  titleId,
  severity = 'error',
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
          <CustomAlert
            style={{ marginTop: 16, marginBottom: 8 }}
            severity={severity}
            onClose={onClearError}
            titleId={errorTitleId}
          >
            {error}
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button
          disabled={deleteDisabled}
          loading={deleteInProgress}
          display="primary"
          onClick={onDelete}
        >
          <FormattedMessage id="DELETE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
