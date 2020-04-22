import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { selectTermsAndConditions } from '../../modules/site/selectors';

export default function EditAvatar({ visible, onClose }) {
  const termsAndConditions = useSelector(selectTermsAndConditions);

  return (
    <Dialog open={visible} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <FormattedMessage id="TERMS_AND_CONDITIONS" />
        <IconButton
          style={{ position: 'absolute', top: 8, right: 16 }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ marginBottom: 24 }}>
        <Typography
          style={{ whiteSpace: 'pre-line', maxHeight: 400 }}
        >
          {termsAndConditions}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
