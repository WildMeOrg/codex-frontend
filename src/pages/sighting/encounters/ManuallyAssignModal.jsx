import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePatchIndividual from '../../../models/individual/usePatchIndividual';
import StandardDialog from '../../../components/StandardDialog';
import Button from '../../../components/Button';
import ButtonLink from '../../../components/ButtonLink';
import Alert from '../../../components/Alert';
import Text from '../../../components/Text';
import IndividualSelector from '../../../components/IndividualSelector';

export default function ManuallyAssignModal({
  open,
  onClose,
  encounterId,
}) {
  const {
    addEncounterToIndividual,
    success,
    loading,
    error,
  } = usePatchIndividual();

  const [selectedIndividualId, setSelectedIndividualId] = useState(
    null,
  );

  const onCloseDialog = () => {
    setSelectedIndividualId(null);
    onClose();
  };

  return (
    <StandardDialog
      maxWidth={success ? 'sm' : 'xl'}
      titleId={
        success ? 'CLUSTER_ASSIGNED' : 'ASSIGN_CLUSTER_TO_INDIVIDUAL'
      }
      open={open}
      onClose={onCloseDialog}
    >
      <DialogContent>
        {success ? (
          <Text id="ASSIGN_CLUSTER_TO_INDIVIDUAL_DESCRIPTION" />
        ) : (
          <IndividualSelector
            selectedIndividualId={selectedIndividualId}
            setSelectedIndividualId={setSelectedIndividualId}
          />
        )}
        {error && (
          <Alert
            titleId="SERVER_ERROR"
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          display="basic"
          onClick={onCloseDialog}
          id={success ? 'CLOSE' : 'CANCEL'}
        />
        {success ? (
          <ButtonLink
            id="VIEW_INDIVIDUAL"
            display="primary"
            href={`/individuals/${selectedIndividualId}`}
          />
        ) : (
          <Button
            display="primary"
            disabled={!selectedIndividualId}
            loading={loading}
            onClick={async () => {
              const result = await addEncounterToIndividual(
                selectedIndividualId,
                encounterId,
              );
              console.log(result);
              /* pick up here when success happens */
            }}
            id="ASSIGN_CLUSTER"
          />
        )}
      </DialogActions>
    </StandardDialog>
  );
}
