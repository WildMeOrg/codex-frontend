import React from 'react';
import { FormattedMessage } from 'react-intl';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '../../components/Button';
import Text from '../../components/Text';
import StandardDialog from '../../components/StandardDialog';

export default function ConfirmDelete({
  open,
  onClose,
  onDelete,
  username,
}) {
  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId="CONFIRM_DELETE"
    >
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
    </StandardDialog>
  );
}
