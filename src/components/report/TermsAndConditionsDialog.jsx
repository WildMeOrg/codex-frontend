import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Text from '../Text';
import StandardDialog from '../StandardDialog';

export default function TermsAndConditionsDialog({
  visible,
  onClose,
}) {
  const termsAndConditions = 'These are our terms: liberty or death!';

  return (
    <StandardDialog
      open={visible}
      onClose={onClose}
      titleId="TERMS_AND_CONDITIONS"
    >
      <DialogContent style={{ marginBottom: 24 }}>
        <Text style={{ whiteSpace: 'pre-line', maxHeight: 400 }}>
          {termsAndConditions}
        </Text>
      </DialogContent>
    </StandardDialog>
  );
}
