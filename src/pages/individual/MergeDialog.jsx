import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import StandardDialog from '../../components/StandardDialog';
import Button from '../../components/Button';
import IndividualSelector from '../../components/IndividualSelector';

export default function MergeDialog({
  open,
  onClose,
  individualGuid,
}) {
  const [selectedIndividualId, setSelectedIndividualId] = useState(
    null,
  );

  const onCloseDialog = () => {
    setSelectedIndividualId(null);
    onClose();
  };

  return (
    <StandardDialog
      maxWidth="xl"
      titleId="MERGE_WITH_ANOTHER_INDIVIDUAL"
      open={open}
      onClose={onCloseDialog}
    >
      <DialogContent>
        <IndividualSelector
          selectedIndividualId={selectedIndividualId}
          setSelectedIndividualId={setSelectedIndividualId}
        />
      </DialogContent>
      <DialogActions>
        <Button display="basic" onClick={onCloseDialog} id="CLOSE" />
        <Button
          display="primary"
          disabled={!selectedIndividualId}
          onClick={async () => {
            console.log('clicky');
          }}
          id="CONTINUE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
