import React, { useState, useEffect } from 'react';
import { get, pick } from 'lodash-es';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import AddIcon from '@material-ui/icons/Add';

import CustomAlert from '../../../components/Alert';
import CardContainer from '../../../components/cards/CardContainer';
import MetadataCard from '../../../components/cards/MetadataCard';
import Link from '../../../components/Link';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import ButtonMenu from '../../../components/ButtonMenu';
import MoreMenu from '../../../components/MoreMenu';
import ConfirmDelete from '../../../components/ConfirmDelete';
import useEncounterFieldSchemas from '../../../models/encounter/useEncounterFieldSchemas';
import useGetMe from '../../../models/users/useGetMe';
import useAddEncounter from '../../../models/encounter/useAddEncounter';
import useDeleteEncounter from '../../../models/encounter/useDeleteEncounter';
import useAddEncounterToAGS from '../../../models/assetGroupSighting/useAddEncounterToAGS';
import useDeleteAGSEncounter from '../../../models/assetGroupSighting/useDeleteAGSEncounter';
import AnnotationsCard from './AnnotationsCard';
import EditEncounterMetadata from './EditEncounterMetadata';
import CreateIndividualModal from './CreateIndividualModal';
import ManuallyAssignModal from './ManuallyAssignModal';
import AddAnnotationsDialog from './AddAnnotationsDialog';
import queryKeys, {
  getUserSightingsQueryKey,
} from '../../../constants/queryKeys';
import { deriveIndividualName } from '../../../utils/nameUtils';

export default function Encounters({
  sightingData,
  refreshSightingData,
  pending,
}) {
  const { data, loading: userDataLoading } = useGetMe();
  const userId = get(data, 'guid');
  const history = useHistory();
  const queryClient = useQueryClient();
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
      const message = vulnerableObject
        ? 'BOTH_VULNERABLE_MESSAGE'
        : 'CONFIRM_DELETE_ENCOUNTER_DESCRIPTION';
      setMessageForConfirmDelete(message);
    },
    [vulnerableObject],
  );

  return (
    <div>
      <ConfirmDelete
        open={encounterToDelete && !userDataLoading}
        onClose={() => {
          setMessageForConfirmDelete(
            'CONFIRM_DELETE_ENCOUNTER_DESCRIPTION',
          );
          setVulnerableObject(null);
          setEncounterToDelete(null);
        }}
        onDelete={async () => {
          let successful;
          if (pending) {
            successful = await deleteAGSEncounter(
              sightingId,
              encounterToDelete,
            );
          }
          if (!pending && vulnerableObject) {
            successful = await deleteSightingEncounter(
              encounterToDelete,
              true,
              true,
            );
          }
          if (!pending && !vulnerableObject) {
            successful = await deleteSightingEncounter(
              encounterToDelete,
            );
          }
          if (successful) {
            setEncounterToDelete(null);
            const navigateAway =
              vulnerableObject && encounters.length <= 1;
            setVulnerableObject(null);
            if (navigateAway) {
              history.push('/');
              refreshSightingData();
              queryClient.invalidateQueries(queryKeys.me);
              queryClient.invalidateQueries(
                getUserSightingsQueryKey(userId),
              );
            } else {
              refreshSightingData();
            }
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

        const individualGuid = encounter?.individual?.guid;
        const individualName = deriveIndividualName(
          encounter?.individual,
          'FirstName',
          'Unnamed Individual',
        );

        const actionButtonActions = [
          {
            id: 'rerun-id',
            labelId: 'RERUN_IDENTIFICATION',
            onClick: Function.prototype,
          },
        ];

        const identifyButtonActions = [
          {
            id: 'start-id',
            labelId: 'START_IDENTIFICATION',
            onClick: Function.prototype,
          },
          {
            id: 'create-new-individual',
            labelId: 'CREATE_NEW_INDIVIDUAL',
            onClick: () =>
              setCreateIndividualEncounterId(encounterId),
          },
          {
            id: 'identify-manually',
            labelId: 'MANUALLY_ASSIGN',
            onClick: () => setEncounterToAssign(encounterId),
          },
        ];

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
              {individualGuid ? (
                <Link
                  newTab
                  href={`/individuals/${individualGuid}`}
                  style={{ marginRight: 20 }}
                >
                  <Text variant="h5">{individualName}</Text>
                </Link>
              ) : (
                <Text
                  id="ANIMAL_CLUSTER_LABEL"
                  variant="h5"
                  values={{ i: i + 1 }}
                  style={{ marginRight: 20 }}
                />
              )}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ButtonMenu
                  display="primary"
                  size="small"
                  buttonId="identify-animal-cluster"
                  id={individualGuid ? 'ACTIONS' : 'IDENTIFY'}
                  disabled={pending}
                  actions={
                    individualGuid
                      ? actionButtonActions
                      : identifyButtonActions
                  }
                />
                <MoreMenu
                  menuId="cluster-actions"
                  items={[
                    {
                      id: 'delete-cluster',
                      onClick: () =>
                        setEncounterToDelete(encounterId),
                      labelId: 'DELETE_ANIMAL',
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
          await addEncounter(sightingId, copiedProperties); //TODO umm... do we really want this just going if there's an error?
          refreshSightingData();
        }}
        startIcon={<AddIcon />}
        style={{ margin: '12px 0px 20px 20px' }}
      />
    </div>
  );
}
