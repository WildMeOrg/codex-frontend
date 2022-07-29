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
    success,
    loading,
    error,
    clearSuccess,
  } = useAssignEncountersToIndividual();

  const [selectedIndividualGuid, setSelectedIndividualGuid] =
    useState(null);

  const onCloseDialog = () => {
    setSelectedIndividualGuid(null);
    onClose();
    clearSuccess();
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
            setSelectedIndividualGuid={setSelectedIndividualGuid}
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
          id={success ? 'CLOSE' : 'CANCEL'}
        />
        {success ? (
          <ButtonLink
            id="VIEW_INDIVIDUAL"
            display="primary"
            href={`/individuals/${selectedIndividualGuid}`}
          />
        ) : (
          <Button
            display="primary"
            disabled={!selectedIndividualGuid}
            loading={loading}
            onClick={async () => {
              await assignEncounters({
                sightingGuid,
                individualGuid: selectedIndividualGuid,
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
