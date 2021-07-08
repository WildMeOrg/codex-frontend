import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

// import IconButton from '@material-ui/core/IconButton';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import LocationIcon from '@material-ui/icons/PersonPin';
// import AddIcon from '@material-ui/icons/Add';
import WebIcon from '@material-ui/icons/WebAssetSharp';

// import userSchema, {
//   userSchemaCategories,
// } from '../constants/userSchema';
import { formatDate } from '../utils/formatters';
import EntityHeaderNew from './EntityHeaderNew';
import BigAvatar from './profilePhotos/BigAvatar';
import MainColumn from './MainColumn';
import Link from './Link';
import SadScreen from './SadScreen';
// import EditEntityModal from './EditEntityModal';
import Text from './Text';
import Button from './Button';
import MetadataCard from './cards/MetadataCard';
import SightingsCard from './cards/SightingsCard';
// import UserProjectCard from './cards/UserProjectCard';
import CardContainer from './cards/CardContainer';

const metadataSchema = [
  {
    id: 'forum_id',
    titleId: 'PROFILE_LABEL_FORUM_ID',
    defaultValue: null,
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
    id: 'email',
    titleId: 'PROFILE_LABEL_EMAIL',
    defaultValue: null,
    icon: EmailIcon,
    renderValue: emailAddress => (
      <Link external href={`mailto://${emailAddress}`}>
        {emailAddress}
      </Link>
    ),
  },
  {
    id: 'website',
    titleId: 'PROFILE_LABEL_WEBSITE',
    defaultValue: null,
    icon: WebIcon,
    renderValue: website => (
      <Link external href={website}>
        {website}
      </Link>
    ),
  },
  {
    id: 'location',
    titleId: 'PROFILE_LABEL_LOCATION',
    defaultValue: null,
    icon: LocationIcon,
  },
];

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

  const metadataItems = metadataSchema.map(displaySchema => {
    const value = get(userData, displaySchema.id);
    return {
      ...displaySchema,
      value,
      valueMatchesDefault:
      displaySchema.defaultValue === value,
    };
  });

  return (
    <MainColumn fullWidth>
      {/* <EditEntityModal
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={userData.fields}
        fieldSchema={userSchema}
        categories={userSchemaCategories}
      /> */}
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
        <Text variant="subtitle2" id="USER_SINCE" values={{ date: dateCreated }} />
      </EntityHeaderNew>
      {children}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <MetadataCard
            editable // ? 
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
