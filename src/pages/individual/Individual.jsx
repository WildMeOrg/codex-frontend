import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  get,
  capitalize,
  map,
  reduce,
  uniqBy,
  slice,
} from 'lodash-es';
import { useQueryClient } from 'react-query';

import errorTypes from '../../constants/errorTypes';
import { getIndividualQueryKey } from '../../constants/queryKeys';
import useIndividual from '../../models/individual/useIndividual';
import useDeleteIndividual from '../../models/individual/useDeleteIndividual';
import usePatchIndividual from '../../models/individual/usePatchIndividual';

// VERILY BAD HOTFIX //
import defaultIndividualSrc from '../../assets/defaultIndividual.png';
import FeaturedPhoto from '../../components/FeaturedPhoto';
// VERILY BAD HOTFIX //

import useIndividualFieldSchemas from '../../models/individual/useIndividualFieldSchemas';
import LoadingScreen from '../../components/LoadingScreen';
import MoreMenu from '../../components/MoreMenu';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';
import CardContainer from '../../components/cards/CardContainer';
import EncountersCard from '../../components/cards/EncountersCard';
import MetadataCard from '../../components/cards/MetadataCard';
import GalleryCard from '../../components/cards/GalleryCard';
import ConfirmDelete from '../../components/ConfirmDelete';
import RelationshipsCard from '../../components/cards/RelationshipsCard';
import SocialGroupsCard from '../../components/cards/SocialGroupsCard';
// import CooccurrenceCard from '../../components/cards/CooccurrenceCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import EditIndividualMetadata from './EditIndividualMetadata';
import MergeDialog from './MergeDialog';
import {
  deriveIndividualName,
  deriveIndividualNameGuid,
} from '../../utils/nameUtils';

export default function Individual() {
  const intl = useIntl();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const {
    data: individualData,
    statusCode: individualDataStatusCode,
    loading,
    error: individualDataError,
  } = useIndividual(id);
  const history = useHistory();
  const fieldSchemas = useIndividualFieldSchemas();

  const refreshIndividualData = useCallback(() => {
    const queryKey = getIndividualQueryKey(id);
    queryClient.invalidateQueries(queryKey);
  }, [queryClient, id]);

  const individualDataForFeaturedPhoto = useMemo(() => {
    const allAssets = reduce(
      individualData?.encounters,
      (memo, encounter) => {
        const newAssets = map(
          get(encounter, 'annotations', []),
          annotation => ({
            src: annotation?.asset_src,
            guid: annotation?.asset_guid,
            altText: annotation?.created
              ? intl.formatMessage(
                  { id: 'ANNOTATION_CREATED_ON_DATE' },
                  { date: annotation.created },
                )
              : intl.formatMessage({
                  id: 'ANNOTATION_WITH_CREATION_DATE_UNKNOWN',
                }),
          }),
        );
        return [...memo, ...newAssets];
      },
      [],
    );
    const assets = uniqBy(allAssets, asset => asset.src);
    return {
      assets,
      featuredAssetGuid: individualData?.featuredAssetGuid,
      guid: individualData?.guid,
    };
  }, [intl, individualData]);

  const metadata = useMemo(() => {
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
  }, [individualData, fieldSchemas]);
  const encounters = get(individualData, 'encounters', []);

  const assetSources = useMemo(() => {
    const combinedAssets = reduce(
      encounters,
      (memo, encounter) => {
        const annotations = get(encounter, 'annotations', []);
        const modifiedAssets = map(
          annotations,
          (annotation, index) => ({
            number: index,
            guid: annotation?.asset_guid,
            src: annotation?.asset_src,
            alt: annotation?.created
              ? intl.formatMessage(
                  { id: 'ANNOTATION_CREATED_ON_DATE' },
                  { date: annotation.created },
                )
              : intl.formatMessage({
                  id: 'ANNOTATION_WITH_CREATION_DATE_UNKNOWN',
                }),
          }),
        );
        return [...memo, ...modifiedAssets];
      },
      [],
    );
    const uniqueModifiedAssets = uniqBy(
      combinedAssets,
      asset => asset.src,
    );
    const firstNineAssets = slice(uniqueModifiedAssets, 0, 9);
    return firstNineAssets;
  }, [encounters, intl]);

  const [firstName, adoptionName] = useMemo(
    () => [
      deriveIndividualName(
        individualData,
        'FirstName',
        intl.formatMessage({ id: 'UNNAMED_INDIVIDUAL' }),
      ),
      deriveIndividualName(individualData, 'AdoptionName'),
    ],
    [intl, individualData],
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

  if (individualDataError)
    return (
      <SadScreen
        statusCode={individualDataStatusCode}
        variantOverrides={{
          [errorTypes.notFound]: {
            subtitleId: 'INDIVIDUAL_NOT_FOUND',
            descriptionId: 'INDIVIDUAL_NOT_FOUND_DESCRIPTION',
          },
        }}
      />
    );
  if (loading) return <LoadingScreen />;

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
          const deleteSuccessful =
            await removeEncounterFromIndividual(
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
            data={individualDataForFeaturedPhoto}
            loading={loading}
            defaultPhotoSrc={defaultIndividualSrc}
            refreshData={refreshIndividualData}
            individualId={individualData?.guid}
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
            individualGuid={id}
            assets={assetSources}
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
            encounters={encounters}
          />
          <RelationshipsCard
            relationships={individualData?.relationships}
            individualGuid={id}
            loading={loading}
            titleId="RELATIONSHIPS"
          />
          <SocialGroupsCard
            socialGroups={get(individualData, 'social_groups', [])}
            individualGuid={id}
            loading={loading}
            titleId="SOCIAL_GROUPS"
          />
          {/* <CooccurrenceCard data={fakeCoocs} /> */}
        </CardContainer>
      </div>
    </MainColumn>
  );
}
