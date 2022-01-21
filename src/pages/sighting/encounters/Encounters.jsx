import React, { useState, useEffect } from 'react';
import { get } from 'lodash-es';

import AddIcon from '@material-ui/icons/Add';

import CustomAlert from '../../../components/Alert';
import CardContainer from '../../../components/cards/CardContainer';
import MetadataCard from '../../../components/cards/MetadataCardNew';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import ButtonMenu from '../../../components/ButtonMenu';
import MoreMenu from '../../../components/MoreMenu';
import ConfirmDelete from '../../../components/ConfirmDelete';
import useEncounterFieldSchemas from '../../../models/encounter/useEncounterFieldSchemas';
import useAddEncounter from '../../../models/encounter/useAddEncounter';
import useDeleteEncounter from '../../../models/encounter/useDeleteEncounter';
import useAddEncounterToAGS from '../../../models/assetGroupSighting/useAddEncounterToAGS';
import useDeleteAGSEncounter from '../../../models/assetGroupSighting/useDeleteAGSEncounter';
import AnnotationsCard from './AnnotationsCard';
import EditEncounterMetadata from './EditEncounterMetadata';
import CreateIndividualModal from './CreateIndividualModal';
import ManuallyAssignModal from './ManuallyAssignModal';

export default function Encounters({
  sightingData,
  refreshSightingData,
  pending,
}) {
  const {
    addEncounter: addEncounterToSighting,
    loading: addEncounterToSightingLoading,
    error: addEncounterToSightingError,
    setError: setAddEncounterError,
  } = useAddEncounter();

  const {
    addEncounterToAGS,
    isLoading: addEncounterToAGSLoading,
    error: addEncounterToAGSError,
  } = useAddEncounterToAGS();

  const addEncounter = pending
    ? addEncounterToAGS
    : addEncounterToSighting;
  const addEncounterLoading = pending
    ? addEncounterToAGSLoading
    : addEncounterToSightingLoading;
  const addEncounterError = pending
    ? addEncounterToAGSError
    : addEncounterToSightingError;

  const {
    deleteEncounter: deleteSightingEncounter,
    loading: deleteSightingEncounterLoading,
    error: deleteSightingEncounterError,
  } = useDeleteEncounter();

  const {
    deleteAGSEncounter,
    isLoading: deleteAGSEncounterLoading,
    error: deleteAGSEncounterError,
  } = useDeleteAGSEncounter();

  const deleteEncounterLoading = pending
    ? deleteAGSEncounterLoading
    : deleteSightingEncounterLoading;

  const [
    createIndividualEncounterId,
    setCreateIndividualEncounterId,
  ] = useState(null);
  const [encounterToDelete, setEncounterToDelete] = useState(null);
  const [editEncounterInfo, setEditEncounterInfo] = useState(null);
  const [encounterToAssign, setEncounterToAssign] = useState(null);
  const [localDeleteError, setLocalDeleteError] = useState(null);

  useEffect(
    () => {
      const localDeleteErrorMessage = pending
        ? deleteAGSEncounterError
        : deleteSightingEncounterError;
      setLocalDeleteError(localDeleteErrorMessage);
    },
    [deleteAGSEncounterError, deleteSightingEncounterError],
  );

  const sightingId = get(sightingData, 'guid');

  const encounterFieldSchemas = useEncounterFieldSchemas();
  const encounters = get(sightingData, 'encounters', []);

  return (
    <div>
      <ConfirmDelete
        open={Boolean(encounterToDelete)}
        onClose={() => setEncounterToDelete(null)}
        onDelete={async () => {
          let successful;
          if (pending) {
            successful = await deleteAGSEncounter(
              sightingId,
              encounterToDelete,
            );
          } else {
            successful = await deleteSightingEncounter(
              encounterToDelete,
            );
          }
          if (successful) {
            setEncounterToDelete(null);
            refreshSightingData();
          }
        }}
        deleteInProgress={deleteEncounterLoading}
        error={localDeleteError}
        onClearError={() => setLocalDeleteError(null)}
        messageId={
          encounters.length <= 1
            ? 'CANNOT_DELETE_FINAL_ENCOUNTER_DESCRIPTION'
            : 'CONFIRM_DELETE_ENCOUNTER_DESCRIPTION'
        }
        deleteDisabled={encounters.length <= 1}
      />

      <CreateIndividualModal
        encounterId={createIndividualEncounterId}
        open={Boolean(createIndividualEncounterId)}
        onClose={() => setCreateIndividualEncounterId(null)}
      />

      <ManuallyAssignModal
        encounterId={encounterToAssign}
        open={Boolean(encounterToAssign)}
        onClose={() => setEncounterToAssign(null)}
      />

      <EditEncounterMetadata
        open={Boolean(editEncounterInfo)}
        sightingId={sightingId}
        onClose={() => setEditEncounterInfo(null)}
        metadata={get(editEncounterInfo, 'encounterMetadata')}
        encounterId={get(editEncounterInfo, 'encounterId')}
        refreshSightingData={refreshSightingData}
        pending={pending}
      />

      {encounters.map((encounter, i) => {
        const encounterId = get(encounter, 'guid');
        const encounterMetadata = encounterFieldSchemas.map(
          schema => ({
            ...schema,
            value: schema.getValue(schema, encounter),
          }),
        );
        return (
          <div
            style={{ marginTop: i > 0 ? 20 : 0 }}
            key={encounter.id}
          >
            <div
              style={{
                margin: '0 30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                id="ANIMAL_CLUSTER_LABEL"
                variant="h6"
                values={{ i: i + 1 }}
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ButtonMenu
                  display="primary"
                  size="small"
                  buttonId="identify-animal-cluster"
                  id="IDENTIFY"
                  actions={[
                    {
                      id: 'start-id',
                      label: 'Kickoff identification',
                      onClick: Function.prototype,
                    },
                    {
                      id: 'create-new-individual',
                      label: 'Create new individual',
                      onClick: () =>
                        setCreateIndividualEncounterId(encounterId),
                    },
                    {
                      id: 'identify-manually',
                      label: 'Manually assign',
                      onClick: () =>
                        setEncounterToAssign(encounterId),
                    },
                  ]}
                />
                <MoreMenu
                  menuId="cluster-actions"
                  items={[
                    {
                      id: 'view-history',
                      onClick: () => {},
                      label: 'View history',
                    },
                    {
                      id: 'delete-cluster',
                      onClick: () =>
                        setEncounterToDelete(encounterId),
                      label: 'Delete cluster',
                    },
                  ]}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <CardContainer>
                <AnnotationsCard annotations={[]} />
              </CardContainer>
              <CardContainer size="small">
                <MetadataCard
                  editable
                  onEdit={() =>
                    setEditEncounterInfo({
                      encounterId,
                      encounterMetadata,
                    })
                  }
                  metadata={encounterMetadata}
                />
              </CardContainer>
            </div>
          </div>
        );
      })}
      {addEncounterError ? (
        <CustomAlert
          onClose={() => setAddEncounterError(null)}
          severity="error"
          style={{ marginTop: 20 }}
          titleId="AN_ERROR_OCCURRED"
          description={addEncounterError}
        />
      ) : null}
      <Button
        id="ADD_CLUSTER"
        loading={addEncounterLoading}
        onClick={async () => {
          await addEncounter(sightingId, {});
          refreshSightingData();
        }}
        startIcon={<AddIcon />}
        style={{ margin: '12px 0px 20px 20px' }}
      />
    </div>
  );
}
