import React from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import IdIcon from '@material-ui/icons/Fingerprint';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';
import CardContainer from '../../components/cards/CardContainer';
import SightingsCard from '../../components/cards/SightingsCard';
import MembersCard from '../../components/cards/MembersCard';
import MetadataCard from '../../components/cards/MetadataCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import EditMembersButton from './EditMembersButton';
import fakeProjects from './fakeProjects';

const noaa = fakeProjects[0];

export default function Project() {
  const { id } = useParams();
  useDocumentTitle(id, { translateMessage: false });

  const project = noaa;
  if (!project)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="PROJECT_NOT_FOUND"
      />
    );

  return (
    <MainColumn fullWidth>
      <EntityHeader
        noAvatar
        square
        name={project.name}
        imgSrc={project.profile}
      >
        <Text>
          The NOAA project contains all sightings from within
          NOAA-controlled waters.
        </Text>
      </EntityHeader>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <MetadataCard
            editable
            titleId="PROFILE"
            metadata={[
              {
                id: 'pid',
                icon: IdIcon,
                titleId: 'PROJECT_ID',
                value: 'NOAA',
              },
            ]}
          />
          <MembersCard
            renderActions={<EditMembersButton />}
            members={[
              {
                id: 'joe',
                name: 'Joe Blasio',
                role: 'Member',
              },
              {
                id: 'sam',
                name: 'Samantha Kvork',
                role: 'Owner',
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
            encounters={project.encounters}
          />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
