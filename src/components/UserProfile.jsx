import React, { useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

// import IconButton from '@material-ui/core/IconButton';
// import AddIcon from '@material-ui/icons/Add';

import useUserMetadataSchemas from '../models/users/useUserMetadataSchemas';
import { formatDate } from '../utils/formatters';
import EntityHeaderNew from './EntityHeaderNew';
import BigAvatar from './profilePhotos/BigAvatar';
import MainColumn from './MainColumn';
import SadScreen from './SadScreen';
import EditUserMetadata from './EditUserMetadata';
import Text from './Text';
import Button from './Button';
import MetadataCardNew from './cards/MetadataCardNew';
import SightingsCard from './cards/SightingsCard';
// import UserProjectCard from './cards/UserProjectCard';
import CardContainer from './cards/CardContainer';

export default function UserProfile({
  children,
  userData,
  userId,
  userDataLoading,
  refreshUserData,
  someoneElse,
  noCollaborate = false,
}) {
  const [editingProfile, setEditingProfile] = useState(false);
  const metadataSchemas = useUserMetadataSchemas();

  const metadata = useMemo(
    () => {
      if (!userData || !metadataSchemas) return [];
      return metadataSchemas.map(schema => ({
        ...schema,
        value: schema.getValue(schema, userData),
      }));
    },
    [userData, metadataSchemas],
  );

  if (!userData)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="USER_NOT_FOUND"
      />
    );

  const imageSrc = get(userData, ['profile_fileupload', 'src']);
  const imageGuid = get(userData, ['profile_fileupload', 'guid']);
  const name = get(userData, 'full_name', 'Unnamed user');
  const dateCreated = formatDate(get(userData, 'created'), true);

  return (
    <MainColumn fullWidth>
      <EditUserMetadata
        open={editingProfile}
        userId={userId}
        metadata={metadata}
        onClose={() => setEditingProfile(false)}
        refreshUserData={refreshUserData}
      />
      <EntityHeaderNew
        name={name}
        editable // ???
        onSettingsClick={() => setEditingProfile(true)}
        renderAvatar={
          <BigAvatar
            editable
            userId={userId}
            imageGuid={imageGuid}
            imageSrc={imageSrc}
            name={name}
            admin={userData.admin}
            refreshUserData={refreshUserData}
            userDataLoading={userDataLoading}
          />
        }
        renderOptions={
          noCollaborate ? (
            undefined
          ) : (
            <Button>
              <FormattedMessage id="ADD_COLLABORATOR" />
            </Button>
          )
        }
      >
        <Text
          variant="subtitle2"
          id="USER_SINCE"
          values={{ date: dateCreated }}
        />
      </EntityHeaderNew>
      {children}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <MetadataCardNew
            editable // ?
            onEdit={() => setEditingProfile(true)}
            metadata={metadata}
          />
          {/* <UserProjectCard
            renderActions={<IconButton><AddIcon /></IconButton>}
            projects={[
              { id: 'bob', name: 'NOAA Capricorn', count: 22, href: '/projects/noaa' },
              { id: 'suz', name: 'Project Exodia', count: 14, href: '/projects/noaa' },
              { id: 'zfeq', name: 'Turtle Kingdom LLC', count: 153, href: '/projects/noaa' },
            ]}
          /> */}
        </CardContainer>
        <CardContainer>
          <SightingsCard
            title={
              someoneElse ? (
                <FormattedMessage
                  id="USERS_SIGHTINGS"
                  values={{ name }}
                />
              ) : (
                <FormattedMessage id="SIGHTINGS" />
              )
            }
            hideSubmitted
          />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
