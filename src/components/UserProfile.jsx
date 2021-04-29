import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

// import IconButton from '@material-ui/core/IconButton';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import LocationIcon from '@material-ui/icons/PersonPin';
// import AddIcon from '@material-ui/icons/Add';
import WebIcon from '@material-ui/icons/WebAssetSharp';

import userSchema, {
  userSchemaCategories,
} from '../constants/userSchema';
import EntityHeaderNew from './EntityHeaderNew';
import BigAvatar from './profilePhotos/BigAvatar';
import MainColumn from './MainColumn';
import Link from './Link';
import SadScreen from './SadScreen';
import EditEntityModal from './EditEntityModal';
import Text from './Text';
import Button from './Button';
import MetadataCard from './cards/MetadataCard';
import SightingsCard from './cards/SightingsCard';
// import UserProjectCard from './cards/UserProjectCard';
import CardContainer from './cards/CardContainer';

const items = [
  {
    key: 'forum_id',
    id: 'forum_id',
    titleId: 'PROFILE_LABEL_FORUM_ID',
    icon: ForumIcon,
    renderValue: forumId => (
      <Link
        external
        href={`https://community.wildbook.org/u/${forumId}/summary`}
      >
        {forumId}
      </Link>
    ),
  },
  {
    key: 'email',
    id: 'email',
    titleId: 'PROFILE_LABEL_EMAIL',
    icon: EmailIcon,
    renderValue: emailAddress => (
      <Link external href={`mailto://${emailAddress}`}>
        {emailAddress}
      </Link>
    ),
  },
  {
    key: 'website',
    id: 'website',
    titleId: 'PROFILE_LABEL_WEBSITE',
    icon: WebIcon,
    renderValue: website => (
      <Link external href={website}>
        {website}
      </Link>
    ),
  },
  {
    key: 'location',
    id: 'location',
    titleId: 'PROFILE_LABEL_LOCATION',
    icon: LocationIcon,
  },
];

export default function UserProfile({
  children,
  userData,
  userId,
  imageSrc,
  imageGuid,
  userDataLoading,
  refreshUserData,
  noCollaborate = false,
}) {
  const [editingProfile, setEditingProfile] = useState(false);

  if (!userData)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="USER_NOT_FOUND"
      />
    );

  const metadataItems = items.map(item => {
    const matchingData = userData.fields.find(
      field => field.name === item.key,
    );
    const matchingSchemaObject = userSchema.find(
      schemaObject => schemaObject.name === item.key,
    );
    const fieldValue = get(matchingData, 'value', null);
    return {
      ...item,
      value: fieldValue,
      valueMatchesDefault:
        matchingSchemaObject.defaultValue === fieldValue,
    };
  });

  return (
    <MainColumn fullWidth>
      <EditEntityModal
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={userData.fields}
        fieldSchema={userSchema}
        categories={userSchemaCategories}
      />
      <EntityHeaderNew
        name={userData.name}
        editable={userData.editable}
        onSettingsClick={() => setEditingProfile(true)}
        renderAvatar={
          <BigAvatar
            editable
            userId={userId}
            imageGuid={imageGuid}
            imageSrc={imageSrc}
            name={userData.name}
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
        <Text variant="subtitle2">User since December 2014</Text>
      </EntityHeaderNew>
      {children}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <MetadataCard
            editable={userData.editable}
            metadata={metadataItems}
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
              !userData.editable ? (
                <FormattedMessage
                  id="USERS_SIGHTINGS"
                  values={{ name: userData.name }}
                />
              ) : (
                <FormattedMessage id="SIGHTINGS" />
              )
            }
            encounters={userData.encounters}
            hideSubmitted
          />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
