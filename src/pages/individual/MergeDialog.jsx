import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import StandardDialog from '../../components/StandardDialog';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import IndividualSelector from '../../components/IndividualSelector';

export default function MergeDialog({
  open,
  onClose,
  individualGuid,
}) {
  const [
    selectedIndividualGuid,
    setSelectedIndividualGuid,
  ] = useState(null);

  const onCloseDialog = () => {
    setSelectedIndividualGuid(null);
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
          excludedIndividuals={[individualGuid]}
          setSelectedIndividualGuid={setSelectedIndividualGuid}
        />
      </DialogContent>
      <DialogActions>
        <Button display="basic" onClick={onCloseDialog} id="CLOSE" />
        <ButtonLink
          display="primary"
          disabled={!selectedIndividualGuid}
          href={`/merge?i=${individualGuid}&i=${selectedIndividualGuid}`}
          id="CONTINUE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
