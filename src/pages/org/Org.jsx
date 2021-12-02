import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { toLower } from 'lodash-es';
import WebIcon from '@material-ui/icons/Web';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import EditEntityModal from '../../components/EditEntityModal';
import Link from '../../components/Link';
import Text from '../../components/Text';
import CardContainer from '../../components/cards/CardContainer';
import SightingsCard from '../../components/cards/SightingsCard';
import MembersCard from '../../components/cards/MembersCard';
import MetadataCard from '../../components/cards/MetadataCard';
import orgSchema, {
  orgSchemaCategories,
} from '../../constants/orgSchema';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import EditMembersButton from './EditMembersButton';

export default function Org() {
  const { id } = useParams();
  useDocumentTitle(id, { translateMessage: false });

  // fetch data for Id...
  const orgs = [];
  const [editingProfile, setEditingProfile] = useState(false);

  const org = orgs[toLower(id)];
  if (!org)
    return (
      <SadScreen variant="notFoundOcean" subtitleId="ORG_NOT_FOUND" />
    );

  return (
    <MainColumn fullWidth>
      <EditEntityModal
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={org.fields}
        fieldSchema={orgSchema}
        categories={orgSchemaCategories}
      />
      <EntityHeader
        square
        name={org.name}
        imgSrc={org.profile}
        editable={org.editable}
        onSettingsClick={() => setEditingProfile(true)}
      >
        <Text>
          NOAA is an agency that enriches life through science. Our
          reach goes from the surface of the sun to the depths of the
          ocean floor as we work to keep the public informed of the
          changing environment around them.
        </Text>
      </EntityHeader>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <MetadataCard
            titleId="PROFILE"
            metadata={[
              {
                id: 'website',
                icon: WebIcon,
                titleId: 'PROFILE_LABEL_WEBSITE',
                value: 'https://www.noaa.gov/',
                renderValue: value => (
                  <Link external href={value}>
                    {value}
                  </Link>
                ),
              },
            ]}
          />
          <MembersCard
            renderActions={<EditMembersButton />}
            members={[
              {
                id: 'joe',
                name: 'Joe Blasio',
                role: 'Adminstrator',
              },
              {
                id: 'sam',
                name: 'Samantha Kvork',
                role: 'Adminstrator',
              },
              {
                id: 'jam',
                name: 'Jam Blvork',
                role: 'Member',
              },
              {
                id: 'som',
                name: 'Sommelia',
                role: 'Member',
              },
            ]}
          />
        </CardContainer>
        <CardContainer>
          <SightingsCard
            title={<FormattedMessage id="SIGHTINGS" />}
            encounters={org.encounters}
          />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
