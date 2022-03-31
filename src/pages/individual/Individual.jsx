import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { get, capitalize } from 'lodash-es';
import { useQueryClient } from 'react-query';

import { getIndividualQueryKey } from '../../constants/queryKeys';
import useIndividual from '../../models/individual/useIndividual';
import useDeleteIndividual from '../../models/individual/useDeleteIndividual';
import usePatchIndividual from '../../models/individual/usePatchIndividual';

// VERILY BAD HOTFIX //
import defaultIndividualSrc from '../../assets/defaultIndividual.png';
import FeaturedPhoto from '../sighting/featuredPhoto/FeaturedPhoto';
// VERILY BAD HOTFIX //

import useIndividualFieldSchemas from '../../models/individual/useIndividualFieldSchemas';
import LoadingScreen from '../../components/LoadingScreen';
import MoreMenu from '../../components/MoreMenu';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
// import Button from '../../components/Button';
import Text from '../../components/Text';
import CardContainer from '../../components/cards/CardContainer';
import EncountersCard from '../../components/cards/EncountersCard';
import MetadataCard from '../../components/cards/MetadataCard';
import GalleryCard from '../../components/cards/GalleryCard';
import ConfirmDelete from '../../components/ConfirmDelete';
import RelationshipsCard from '../../components/cards/RelationshipsCard';
import CooccurrenceCard from '../../components/cards/CooccurrenceCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import EditIndividualMetadata from './EditIndividualMetadata';
import MergeDialog from './MergeDialog';
import fakeAssets from './fakeAssets';
import fakeCoocs from './fakeCoocs';
import fakeRelationships from './fakeRelationships';
import {
  deriveIndividualName,
  deriveIndividualNameGuid,
} from '../../utils/nameUtils';

export default function Individual() {
  const intl = useIntl();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: individualData, statusCode, loading } = useIndividual(
    id,
  );
  const history = useHistory();
  const fieldSchemas = useIndividualFieldSchemas();

  const refreshIndividualData = useCallback(
    () => {
      const queryKey = getIndividualQueryKey(id);
      queryClient.invalidateQueries(queryKey);
    },
    [queryClient, id],
  );

  const metadata = useMemo(
    () => {
      if (!individualData || !fieldSchemas) return null;
      return fieldSchemas.map(schema => {
        const augmentedSchema = {
          ...schema,
          value: schema.getValue(schema, individualData),
        };

        if (schema.name === 'firstName') {
          augmentedSchema.nameGuid = deriveIndividualNameGuid(
            individualData,
            'FirstName',
          );
        } else if (schema.name === 'adoptionName') {
          augmentedSchema.nameGuid = deriveIndividualNameGuid(
            individualData,
            'AdoptionName',
          );
        }

        return augmentedSchema;
      });
    },
    [individualData, fieldSchemas],
  );

  const [firstName, adoptionName] = useMemo(
    () => [
      deriveIndividualName(
        individualData,
        'FirstName',
        'Unnamed individual',
      ),
      deriveIndividualName(
        individualData,
        'AdoptionName',
        'Unnamed individual',
      ),
    ],
    [individualData],
  );

  const {
    deleteIndividual,
    loading: deleteInProgress,
    error: deleteError,
    setError: setDeleteError,
  } = useDeleteIndividual();

  const {
    removeEncounterFromIndividual,
    loading: patchInProgress,
    error: patchError,
    setError: setPatchError,
  } = usePatchIndividual();

  useDocumentTitle(capitalize(firstName), {
    translateMessage: false,
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [merging, setMerging] = useState(false);
  const [deletingIndividual, setDeletingIndividual] = useState(false);
  const [deleteEncounterId, setDeleteEncounterId] = useState(null);

  if (loading) return <LoadingScreen />;

  if (statusCode === 404 || !individualData)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="INDIVIDUAL_NOT_FOUND"
      />
    );

  return (
    <MainColumn fullWidth>
      <MergeDialog
        open={merging}
        onClose={() => setMerging(false)}
        individualGuid={id}
      />
      <EditIndividualMetadata
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        individualId={id}
        metadata={metadata}
        refreshIndividualData={refreshIndividualData}
      />
      <ConfirmDelete
        open={Boolean(deleteEncounterId)}
        onClose={() => setDeleteEncounterId(null)}
        onDelete={async () => {
          const deleteSuccessful = await removeEncounterFromIndividual(
            id,
            deleteEncounterId,
          );
          if (deleteSuccessful) {
            setDeleteEncounterId(null);
            refreshIndividualData();
          }
        }}
        deleteInProgress={patchInProgress}
        error={patchError}
        onClearError={() => setPatchError(null)}
        messageId="CONFIRM_REMOVE_CLUSTER_FROM_INDIVIDUAL"
      />
      <ConfirmDelete
        open={deletingIndividual}
        onClose={() => setDeletingIndividual(false)}
        onDelete={async () => {
          const deleteSuccessful = await deleteIndividual(id);
          if (deleteSuccessful) {
            setDeletingIndividual(false);
            history.push('/individuals');
          }
        }}
        deleteInProgress={deleteInProgress}
        error={deleteError}
        onClearError={() => setDeleteError(null)}
        messageId="CONFIRM_DELETE_INDIVIDUAL"
      />
      <EntityHeader
        name={firstName}
        renderAvatar={
          <FeaturedPhoto
            data={null}
            loading={false}
            refreshSightingData={Function.prototype}
            defaultPhotoSrc={defaultIndividualSrc}
          />
        }
        renderOptions={
          <div style={{ display: 'flex' }}>
            {/* <Button display="primary">SUBSCRIBE</Button> */}
            <MoreMenu
              menuId="individual-actions"
              items={[
                {
                  id: 'merge',
                  onClick: () => setMerging(true),
                  labelId: 'MERGE_WITH_ANOTHER_INDIVIDUAL',
                },
                {
                  id: 'delete-individual',
                  onClick: () => setDeletingIndividual(true),
                  labelId: 'DELETE_INDIVIDUAL',
                },
              ]}
            />
          </div>
        }
      >
        {adoptionName && (
          <Text>{`Also known as ${adoptionName}.`}</Text>
        )}
      </EntityHeader>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <GalleryCard
            title={intl.formatMessage(
              { id: 'PHOTOS_OF' },
              { name: firstName },
            )}
            assets={fakeAssets}
          />
          <MetadataCard
            editable
            metadata={metadata}
            onEdit={() => setEditingProfile(true)}
          />
        </CardContainer>
        <CardContainer>
          <EncountersCard
            title={
              <FormattedMessage
                id="SIGHTINGS_OF"
                values={{ name: firstName }}
              />
            }
            columns={['date', 'owner', 'location', 'actions']}
            onDelete={encounterId =>
              setDeleteEncounterId(encounterId)
            }
            encounters={get(individualData, 'encounters', [])}
          />
          <RelationshipsCard
            title="Relationships"
            relationships={fakeRelationships}
          />
          <CooccurrenceCard data={fakeCoocs} />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
