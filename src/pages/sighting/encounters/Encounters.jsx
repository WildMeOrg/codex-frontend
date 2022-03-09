import React, { useState, useEffect } from 'react';
import { get, pick } from 'lodash-es';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';

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
import queryKeys from '../../../constants/queryKeys';

export default function Encounters({
  sightingData,
  refreshSightingData,
  pending,
}) {
  console.log('deleteMe sightingData is: ');
  console.log(sightingData);
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
    // setError: deleteEncounterSetError,
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
  // const [pastVulnerableObject, setPastVulnerableObject] = useState(
  //   null,
  // );
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
        console.log('deleteMe got here f0');
        const encounterIdHolder = encounterToDelete;
        // setEncounterToDelete(null);
        // deleteEncounterSetError(null);
        // deleteAgsEncounterOnClearError();
        console.log(vulnerableObject);

        const whichVulnerableObj = get(
          Object.keys(vulnerableObject),
          '0',
        );
        console.log('deleteMe whichVulnerableObj is: ');
        console.log(whichVulnerableObj);
        setMessageForConfirmDelete('BOTH_VULNERABLE_MESSAGE');
        // deleteEncounterSetError(
        //   'Cannot delete without additional confirmation',
        // );
        // setVulnerableObjectsTracker(whichVulnerableObj);
        console.log(
          'deleteMe setting past vulnerable object to: ' +
            whichVulnerableObj,
        );
        // setPastVulnerableObject(whichVulnerableObj);
        console.log('deleteMe messageForConfirmDelete is now : ');
        console.log(messageForConfirmDelete);
        setEncounterToDelete(encounterIdHolder);
        deleteEncounterOnClearError();
      }
    },
    [vulnerableObject],
  );
  console.log('deleteMe re-render happens');
  // const bothVulnerable =
  //   vulnerableObject &&
  //   pastVulnerableObject &&
  //   vulnerableObject !== pastVulnerableObject;
  // if (bothVulnerable) {
  //   console.log('deleteMe got here d0');
  //   setMessageForConfirmDelete('BOTH_VULNERABLE_MESSAGE');
  // }

  return (
    <div>
      <ConfirmDelete
        open={Boolean(encounterToDelete)}
        onClose={() => setEncounterToDelete(null)}
        onDelete={async () => {
          console.log('deleteMe onDelete is run');
          let successful;
          const vulnObjKeys = vulnerableObject
            ? Object.keys(vulnerableObject)
            : [];
          // const pastVulnObjKeys = pastVulnerableObject
          //   ? Object.keys(pastVulnerableObject)
          //   : [];
          const vulnerableObjStr = get(vulnObjKeys, '0');
          // const pastVulnerableObjStr = get(pastVulnObjKeys, '0');
          // const vulnerableIndividual =
          //   vulnerableObjStr === 'vulnerableIndividualGuid';
          // console.log(
          //   'deleteMe vulnerableIndividual is: ' +
          //     vulnerableIndividual,
          // );
          // const vulnerableSighting =
          //   vulnerableObjStr === 'vulnerableSightingGuid';
          // console.log(
          //   'deleteMe vulnerableSighting is: ' + vulnerableSighting,
          // );
          // const bothVulnerable =
          //   vulnerableObject &&
          //   pastVulnerableObject &&
          //   vulnerableObjStr !== pastVulnerableObjStr;
          // console.log(
          //   'deleteMe bothVulnerable is: ' + bothVulnerable,
          // );
          // if (bothVulnerable) {
          //   console.log('deleteMe got here d0');
          //   setMessageForConfirmDelete('BOTH_VULNERABLE_MESSAGE'); //TODO may need to put this in the useEffect?
          // }
          if (pending) {
            successful = await deleteAGSEncounter(
              sightingId,
              encounterToDelete,
            );
          }
          // if (!pending && vulnerableIndividual && !bothVulnerable) {
          //   console.log('deleteMe got here b0');
          //   successful = await deleteSightingEncounter(
          //     encounterToDelete,
          //     false,
          //     true,
          //   );
          //   setPastVulnerableObject(vulnerableObject);
          //   console.log('deleteMe got here b1.5 ');
          // }
          // if (!pending && vulnerableSighting && !bothVulnerable) {
          //   console.log('deleteMe got here b1');
          //   successful = await deleteSightingEncounter(
          //     encounterToDelete,
          //     true,
          //     false,
          //   );
          //   setPastVulnerableObject(vulnerableObject);
          //   console.log('deleteMe got here b1.75 ');
          // }
          if (!pending && vulnerableObjStr) {
            successful = await deleteSightingEncounter(
              encounterToDelete,
              true,
              true,
            );
          }
          if (!pending && !vulnerableObjStr) {
            successful = await deleteSightingEncounter(
              encounterToDelete,
            );
          }
          if (successful) {
            setEncounterToDelete(null);
            const navigateAway =
              Boolean(vulnerableObject) && encounters.length <= 1;
            setVulnerableObject(null);
            if (navigateAway) {
              history.push('/');
              refreshSightingData();
              queryClient.invalidateQueries(queryKeys.me);
            } else {
              refreshSightingData();
            }
          } else {
            console.log('deleteMe got here e0');
            console.log('deleteMe error is hi there: ');
            console.log(deleteSightingEncounterError);
            // deleteEncounterSetError(
            //   'Encounter could not yet be deleted',
            // );
            // deleteEncounterSetError(null);
            // if (vulnerableObject) {
            //   console.log('deleteMe got here e1');
            //   deleteEncounterSetError(
            //     'Cannot delete without additional confirmation',
            //   );
            // }
            // setEncounterToDelete(encounterId);
            // setEncounterToDelete(null);
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
