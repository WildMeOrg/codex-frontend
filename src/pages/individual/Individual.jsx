import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { capitalize } from 'lodash-es';

import SexIcon from '@material-ui/icons/Nature';
import AgeIcon from '@material-ui/icons/Height';
import StatusIcon from '@material-ui/icons/LocalHospital';

import useIndividual from '../../models/individual/useIndividual';
import useDeleteIndividual from '../../models/individual/useDeleteIndividual';

import MoreMenu from '../../components/MoreMenu';
import EntityHeaderNew from '../../components/EntityHeaderNew';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import Button from '../../components/Button';
import EditProfile from '../../components/EditEntityModal';
import Text from '../../components/Text';
import CardContainer from '../../components/cards/CardContainer';
import SightingsCard from '../../components/cards/SightingsCard';
import MetadataCard from '../../components/cards/MetadataCard';
import GalleryCard from '../../components/cards/GalleryCard';
import ConfirmDelete from '../../components/ConfirmDelete';
import RelationshipsCard from '../../components/cards/RelationshipsCard';
import CooccurrenceCard from '../../components/cards/CooccurrenceCard';
import { selectIndividuals } from '../../modules/individuals/selectors';
import { selectSpeciesFields } from '../../modules/site/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import fakeAssets from './fakeAssets';
import fakeCoocs from './fakeCoocs';
import fakeRelationships from './fakeRelationships';

const items = [
  {
    key: 'sex',
    id: 'sex',
    icon: SexIcon,
    value: 'Male',
    titleId: 'PROFILE_LABEL_SEX',
  },
  {
    key: 'age',
    id: 'age',
    icon: AgeIcon,
    value: 42,
    titleId: 'PROFILE_LABEL_AGE',
  },
  {
    id: 'status',
    key: 'status',
    icon: StatusIcon,
    value: 'Alive',
    titleId: 'PROFILE_LABEL_STATUS',
  },
];

export default function Individual() {
  const { id } = useParams();
  const { data } = useIndividual(id);
  const history = useHistory();

  const {
    deleteIndividual,
    loading: deleteInProgress,
    error: deleteError,
    setError: setDeleteError,
  } = useDeleteIndividual();

  console.log(data);

  // fetch data for Id...
  const individuals = useSelector(selectIndividuals);

  const speciesFields = useSelector(selectSpeciesFields);
  useDocumentTitle(capitalize(id));
  const [editingProfile, setEditingProfile] = useState(false);
  const [deletingIndividual, setDeletingIndividual] = useState(false);

  const individual = individuals.teddy;
  if (!individual)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="INDIVIDUAL_NOT_FOUND"
      />
    );

  const fieldSchema = speciesFields[individual.species];

  return (
    <MainColumn fullWidth>
      <EditProfile
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={individual.fields}
        fieldSchema={fieldSchema}
      />
      <ConfirmDelete
        open={deletingIndividual}
        onClose={() => setDeletingIndividual(false)}
        onDelete={async () => {
          const deleteSuccessful = await deleteIndividual(id);
          if (deleteSuccessful) {
            setDeletingIndividual(false);
            history.push('/');
          }
        }}
        deleteInProgress={deleteInProgress}
        error={deleteError}
        onClearError={() => setDeleteError(null)}
        messageId="CONFIRM_DELETE_INDIVIDUAL"
      />
      <EntityHeaderNew
        name={individual.name}
        renderAvatar={Function.prototype}
        renderOptions={
          <div style={{ display: 'flex' }}>
            <Button display="primary">SUBSCRIBE</Button>
            <MoreMenu
              menuId="individual-actions"
              items={[
                {
                  id: 'view-history',
                  onClick: Function.prototype,
                  label: 'View history',
                },
                {
                  id: 'delete-individual',
                  onClick: () => setDeletingIndividual(true),
                  label: 'Delete individual',
                },
              ]}
            />
          </div>
        }
      >
        <Text>Also known as Teddles, T3289-K, and Tweeb.</Text>
      </EntityHeaderNew>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <GalleryCard title="Photos of Teddy" assets={fakeAssets} />
          <MetadataCard editable metadata={items} />
        </CardContainer>
        <CardContainer>
          <SightingsCard
            title={
              <FormattedMessage
                id="SIGHTINGS_OF"
                values={{ name: individual.name }}
              />
            }
            encounters={individual.encounters}
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
