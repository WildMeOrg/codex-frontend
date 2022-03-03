import React, { useState, useEffect } from 'react';
import { get, pick } from 'lodash-es';

import AddIcon from '@material-ui/icons/Add';

import CustomAlert from '../../../components/Alert';
import CardContainer from '../../../components/cards/CardContainer';
import MetadataCard from '../../../components/cards/MetadataCard';
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
import AddAnnotationsDialog from './AddAnnotationsDialog';

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
    onClearError: deleteEncounterOnClearError,
    setError: deleteEncounterSetError,
    vulnerableObject,
    setVulnerableObject,
  } = useDeleteEncounter();

  const {
    deleteAGSEncounter,
    isLoading: deleteAGSEncounterLoading,
    error: deleteAGSEncounterError,
    onClearError: deleteAgsEncounterOnClearError,
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
  const [
    messageForConfirmDelete,
    setMessageForConfirmDelete,
  ] = useState(null);
  const [
    encounterToAddAnnotations,
    setEncounterToAddAnnotations,
  ] = useState(null);

  const sightingId = get(sightingData, 'guid');

  const encounterFieldSchemas = useEncounterFieldSchemas();
  const encounters = get(sightingData, 'encounters', []);

  useEffect(
    () => {
      setMessageForConfirmDelete(
        'CONFIRM_DELETE_ENCOUNTER_DESCRIPTION',
      );
      if (vulnerableObject) {
        console.log('deleteMe got here a0');
        const encounterIdHolder = encounterToDelete;
        setEncounterToDelete(null);
        deleteEncounterSetError(null);
        console.log(vulnerableObject);

        const whichVulnerableObj = get(
          Object.keys(vulnerableObject),
          '0',
        );
        console.log('deleteMe whichVulnerableObj is: ');
        console.log(whichVulnerableObj);
        setMessageForConfirmDelete(
          whichVulnerableObj === 'vulnerableIndividualGuid'
            ? 'VULNERABLE_INDIVIDUAL_MESSAGE'
            : 'VULNERABLE_SIGHTING_MESSAGE',
        );
        console.log('deleteMe messageForConfirmDelete is now : ');
        console.log(messageForConfirmDelete);
        setEncounterToDelete(encounterIdHolder);
      }
    },
    [vulnerableObject],
  );
  console.log('deleteMe re-render happens');

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
          } else if (vulnerableObject) {
            console.log('deleteMe got here instead');
            if (
              get(Object.keys(vulnerableObject), '0') ===
              'vulnerableIndividualGuid'
            ) {
              successful = await deleteSightingEncounter(
                encounterToDelete,
                false,
                true,
              );
            } else {
              successful = await deleteSightingEncounter(
                encounterToDelete,
                true,
                false,
              );
            }
            console.log('deleteMe got here and successful is: ');
            console.log(successful);
          } else {
            successful = await deleteSightingEncounter(
              encounterToDelete,
            );
          }
          if (successful) {
            setEncounterToDelete(null);
            setVulnerableObject(null);
            refreshSightingData();
          }
        }}
        deleteInProgress={deleteEncounterLoading}
        error={
          pending
            ? deleteAGSEncounterError
            : deleteSightingEncounterError
        }
        onClearError={
          pending
            ? deleteAgsEncounterOnClearError
            : deleteEncounterOnClearError
        }
        messageId={messageForConfirmDelete}
        // deleteDisabled={encounters.length <= 1}
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

      <AddAnnotationsDialog
        sightingData={sightingData}
        pending={pending}
        encounter={encounterToAddAnnotations}
        onClose={() => setEncounterToAddAnnotations(null)}
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
            key={encounterId}
          >
            <div
              style={{
                margin: '0 30px 4px 30px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Text
                id="ANIMAL_CLUSTER_LABEL"
                variant="h5"
                values={{ i: i + 1 }}
                style={{ marginRight: 20 }}
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ButtonMenu
                  display="primary"
                  size="small"
                  buttonId="identify-animal-cluster"
                  id="IDENTIFY"
                  disabled={pending}
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
                      label: 'Delete animal',
                    },
                  ]}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <CardContainer>
                <AnnotationsCard
                  pending={pending}
                  sightingData={sightingData}
                  onAddAnnotations={() =>
                    setEncounterToAddAnnotations(encounter)
                  }
                  annotationReferences={get(
                    encounter,
                    'annotations',
                    [],
                  )}
                  assets={get(sightingData, 'assets', [])}
                />
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
          const copiedProperties = pick(sightingData, [
            'time',
            'timeSpecificity',
            'locationId',
          ]);
          await addEncounter(sightingId, copiedProperties);
          refreshSightingData();
        }}
        startIcon={<AddIcon />}
        style={{ margin: '12px 0px 20px 20px' }}
      />
    </div>
  );
}
