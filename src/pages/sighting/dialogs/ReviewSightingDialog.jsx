import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import useReviewSighting from '../../../models/sighting/useReviewSighting';
import StandardDialog from '../../../components/StandardDialog';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import Alert from '../../../components/Alert';

export default function SightingHistoryDialog({
  sightingGuid,
  open,
  onClose,
}) {
  const {
    mutate: reviewSighting,
    loading,
    error,
    clearError,
  } = useReviewSighting();

  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId="MARK_SIGHTING_REVIEWED"
      PaperProps={{
        style: { width: 680, maxWidth: '90%' },
      }}
    >
      <DialogContent>
        <Text id="MARK_SIGHTING_REVIEWED_CONFIRMATION" />
        {error && (
          <Alert
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
            onClose={clearError}
            titleId="SERVER_ERROR"
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose} id="CANCEL" />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            const response = await reviewSighting({ sightingGuid });
            if (response.status === 200) onClose();
          }}
          id="MARK_SIGHTING_REVIEWED"
        />
      </DialogActions>
    </StandardDialog>
  );
}
