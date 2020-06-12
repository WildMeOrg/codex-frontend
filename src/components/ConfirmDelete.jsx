import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

export default function ConfirmDelete({
  open,
  onClose,
  onDelete,
  entityToDelete,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="CONFIRM_DELETE" />
      </DialogTitle>
      <DialogContent>
        <Typography>
          <FormattedMessage
            id="CONFIRM_DELETE_DESCRIPTION"
            values={{ entity: entityToDelete }}
          />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button onClick={onDelete}>
          <FormattedMessage id="DELETE" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
