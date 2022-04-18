import React, { useState } from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import useMatchAnnotation from '../../../models/annotation/useMatchAnnotation';
import CustomAlert from '../../../components/Alert';
import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';
import Text from '../../../components/Text';
import CustomMatchingSetForm from './CustomMatchingSetForm';

export default function KickoffAnnotationDialog({
  annotationGuid,
  open,
  onClose,
}) {
  const [idConfig, setIdConfig] = useState(null);

  const {
    mutate: matchAnnotation,
    loading,
    error,
    clearError,
  } = useMatchAnnotation();

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="xl"
      open={open}
      onClose={() => {
        clearError();
        onClose();
      }}
      titleId="START_IDENTIFICATION"
    >
      <DialogContent style={{ minWidth: 200 }}>
        <CustomMatchingSetForm
          idConfig={idConfig}
          setIdConfig={setIdConfig}
        />
        {error && (
          <CustomAlert severity="error" titleId="SERVER_ERROR">
            <Text variant="body2">{error}</Text>
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose} id="CANCEL" />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            const response = await matchAnnotation({
              annotationGuid,
              data: [idConfig],
            });
            if (response.status === 200) onClose();
          }}
          id="START_IDENTIFICATION"
        />
      </DialogActions>
    </StandardDialog>
  );
}
