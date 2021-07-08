import React, { useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

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
import AnnotationsCard from './AnnotationsCard';
import EditEncounterMetadata from './EditEncounterMetadata';

export default function Encounters({
  sightingData,
  refreshSightingData,
}) {
  const {
    addEncounter,
    loading: addEncounterLoading,
    error: addEncounterError,
    setError: setAddEncounterError,
  } = useAddEncounter();

  const {
    deleteEncounter,
    loading: deleteEncounterInProgress,
    error: deleteEncounterError,
    setError: setDeleteEncounterError,
  } = useDeleteEncounter();

  const [encounterToDelete, setEncounterToDelete] = useState(null);
  const [editEncounterInfo, setEditEncounterInfo] = useState(null);

  const sightingId = get(sightingData, 'id');

  const encounterFieldSchemas = useEncounterFieldSchemas();
  const encounters = get(sightingData, 'encounters', []);
  return (
    <div>
      <ConfirmDelete
        open={Boolean(encounterToDelete)}
        onClose={() => setEncounterToDelete(null)}
        onDelete={async () => {
          const successful = await deleteEncounter(encounterToDelete);
          if (successful) {
            setEncounterToDelete(null);
            refreshSightingData();
          }
        }}
        deleteInProgress={deleteEncounterInProgress}
        error={deleteEncounterError}
        onClearError={() => setDeleteEncounterError(null)}
        messageId={
          encounters.length <= 1
            ? 'CANNOT_DELETE_FINAL_ENCOUNTER_DESCRIPTION'
            : 'CONFIRM_DELETE_ENCOUNTER_DESCRIPTION'
        }
        deleteDisabled={encounters.length <= 1}
      />

      <EditEncounterMetadata
        open={Boolean(editEncounterInfo)}
        sightingId={sightingId}
        onClose={() => setEditEncounterInfo(null)}
        metadata={get(editEncounterInfo, 'encounterMetadata')}
        encounterId={get(editEncounterInfo, 'encounterId')}
        refreshSightingData={refreshSightingData}
      />

      {encounters.map((encounter, i) => {
        const encounterId = get(encounter, 'id');
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
                      id: 'identify-manually',
                      label: 'Manually assign',
                      onClick: Function.prototype,
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
                      id: 'create-new-individual',
                      label: 'Create new individual',
                      onClick: Function.prototype,
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
