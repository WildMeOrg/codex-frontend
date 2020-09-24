import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

export default function AlertModal({
  open,
  onClose,
  title,
  severity = 'warning',
  ...rest
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        {title}
        <IconButton
          style={{ position: 'absolute', top: 8, right: 16 }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        <Alert severity={severity} {...rest} />
      </DialogContent>
    </Dialog>
  );
}
