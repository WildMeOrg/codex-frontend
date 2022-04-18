import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import CustomAlert from '../../../components/Alert';
import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';
import Text from '../../../components/Text';
import CustomMatchingSetForm from './CustomMatchingSetForm';

export default function KickoffAnnotationDialog({ open, onClose }) {
  const intl = useIntl();

  const [idConfig, setIdConfig] = useState(null);

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="xl"
      open={open}
      onClose={onClose}
      titleId="START_IDENTIFICATION"
    >
      <DialogContent style={{ minWidth: 200 }}>
        <CustomMatchingSetForm
          idConfig={idConfig}
          setIdConfig={setIdConfig}
        />
        {false && (
          <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
            <Text variant="body2">There was an error</Text>
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose} id="CANCEL" />
        <Button
          loading={false}
          display="primary"
          onClick={Function.prototype}
          id="START_IDENTIFICATION"
        />
      </DialogActions>
    </StandardDialog>
  );
}
