import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { get, capitalize, map } from 'lodash-es';
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
import Button from '../../components/Button';
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
  console.log('deleteMe individualData is: ');
  console.log(individualData);
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

        if (schema.name === 'defaultName') {
          augmentedSchema.nameGuid = deriveIndividualNameGuid(
            individualData,
            'defaultName',
          );
        } else if (schema.name === 'nickname') {
          augmentedSchema.nameGuid = deriveIndividualNameGuid(
            individualData,
            'nickname',
          );
        }

        return augmentedSchema;
      });
    },
    [individualData, fieldSchemas],
  );

  const names = individualData?.names || [];
  const encounters = get(individualData, 'encounters', []);

  const assetSources = map(encounters, encounter => {
    const annotations = get(encounter, 'annotations');
    const assetSourcesFromAnnotations = map(
      annotations,
      (annotation, index) => ({
        number: index,
        id: annotation?.id,
        src: annotation?.asset_src,
        alt: annotation?.created
          ? 'Annotation created: ' + annotation?.created
          : 'Annotation image with no creation date',
      }),
    ); //.filter(entry => entry?.number < 9);
    return assetSourcesFromAnnotations;
  }); // TODO check that it works if there's more than one encounter after the "can't add a second encounter to an individual" issue is resolved
  console.log('deleteMe assetSources are: ');
  console.log(assetSources);
  console.log('deleteMe fakeAssets are: ');
  console.log(fakeAssets);

  const [defaultName, nickname] = useMemo(
    () => [
      deriveIndividualName(
        individualData,
        'defaultName',
        'Unnamed individual',
      ),
      deriveIndividualName(
        individualData,
        'nickname',
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

  useDocumentTitle(capitalize(defaultName), {
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
        name={defaultName}
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
            <Button display="primary">SUBSCRIBE</Button>
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
        {nickname && <Text>{`Also known as ${nickname}.`}</Text>}
      </EntityHeader>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <GalleryCard
            title={intl.formatMessage(
              { id: 'PHOTOS_OF' },
              { name: defaultName },
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
                values={{ name: defaultName }}
              />
            }
            columns={['date', 'owner', 'location', 'actions']}
            onDelete={encounterId =>
              setDeleteEncounterId(encounterId)
            }
            encounters={encounters}
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
