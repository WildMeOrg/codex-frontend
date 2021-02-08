import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { capitalize, toLower } from 'lodash-es';
import SexIcon from '@material-ui/icons/Nature';
import AgeIcon from '@material-ui/icons/Height';
import StatusIcon from '@material-ui/icons/LocalHospital';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import Button from '../../components/Button';
import EditProfile from '../../components/EditEntityModal';
import CardContainer from '../../components/cards/CardContainer';
import SightingsCard from '../../components/cards/SightingsCard';
import MetadataCard from '../../components/cards/MetadataCard';
import GalleryCard from '../../components/cards/GalleryCard';
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

  // fetch data for Id...
  const individuals = useSelector(selectIndividuals);
  const speciesFields = useSelector(selectSpeciesFields);
  useDocumentTitle(capitalize(id));
  const [editingProfile, setEditingProfile] = useState(false);

  const individual = individuals[toLower(id)];
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
      <EntityHeader
        name={individual.name}
        imgSrc="https://mediaproxy.salon.com/width/1200/https://media.salon.com/2001/05/shrek.jpg"
        renderOptions={<Button display="primary">SUBSCRIBE</Button>}
      >
        Also known as Teddles, T3289-K, and Tweeb.
      </EntityHeader>
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
