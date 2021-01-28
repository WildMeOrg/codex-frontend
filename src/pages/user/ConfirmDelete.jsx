import React from 'react';
import { FormattedMessage } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '../../components/Button';
import Text from '../../components/Text';

export default function ConfirmDelete({
  open,
  onClose,
  onDelete,
  username,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="CONFIRM_DELETE" />
      </DialogTitle>
      <DialogContent>
        <Text id="CONFIRM_DELETE_DESCRIPTION" values={{ username }} />
      </DialogContent>
      <DialogActions>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button display="basic" onClick={onDelete}>
          <FormattedMessage id="DELETE" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
