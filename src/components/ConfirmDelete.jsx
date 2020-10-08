import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from './Button';

export default function ConfirmDelete({
  open,
  onClose,
  onDelete,
  entityToDelete,
  message,
  title,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {title || <FormattedMessage id="CONFIRM_DELETE" />}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {message || (
            <FormattedMessage
              id="CONFIRM_DELETE_DESCRIPTION"
              values={{ entity: entityToDelete }}
            />
          )}
        </Typography>
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button display="primary" onClick={onDelete}>
          <FormattedMessage id="DELETE" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
