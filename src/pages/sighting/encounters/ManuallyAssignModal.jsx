import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import useAssignEncountersToIndividual from '../../../models/individual/useAssignEncountersToIndividual';
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
  sightingGuid,
}) {
  const {
    mutate: assignEncounters,
    isSuccess,
    loading,
    error,
  } = useAssignEncountersToIndividual();

  const [selectedIndividualId, setSelectedIndividualId] = useState(
    null,
  );

  const onCloseDialog = () => {
    setSelectedIndividualId(null);
    onClose();
  };

  return (
    <StandardDialog
      maxWidth={isSuccess ? 'sm' : 'xl'}
      titleId={
        isSuccess
          ? 'CLUSTER_ASSIGNED'
          : 'ASSIGN_CLUSTER_TO_INDIVIDUAL'
      }
      open={open}
      onClose={onCloseDialog}
    >
      <DialogContent>
        {isSuccess ? (
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
            style={{ marginTop: 16, marginBottom: 8, width: 520 }}
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
          id={isSuccess ? 'CLOSE' : 'CANCEL'}
        />
        {isSuccess ? (
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
              await assignEncounters({
                sightingGuid,
                individualGuid: selectedIndividualId,
                encounterGuids: [encounterId],
              });
            }}
            id="ASSIGN_CLUSTER"
          />
        )}
      </DialogActions>
    </StandardDialog>
  );
}
