import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import LocationIcon from '@material-ui/icons/PersonPin';
import WebIcon from '@material-ui/icons/WebAssetSharp';

import userSchema, {
  userSchemaCategories,
} from '../constants/userSchema';
import EntityHeader from './EntityHeader';
import MainColumn from './MainColumn';
import Link from './Link';
import SadScreen from './SadScreen';
import EncounterGallery from './EncounterGallery';
import EditEntityModal from './EditEntityModal';
import Text from './Text';

const items = [
  {
    key: 'forum_id',
    icon: ForumIcon,
    render: forumId => (
      <>
        <FormattedMessage id="PROFILE_LABEL_FORUM_ID" />
        <Link href="google.com">{forumId}</Link>
      </>
    ),
  },
  {
    key: 'email',
    icon: EmailIcon,
    render: emailAddress => (
      <FormattedMessage
        id="PROFILE_LABEL_EMAIL"
        values={{ emailAddress }}
      />
    ),
  },
  {
    key: 'website',
    icon: WebIcon,
    render: website => (
      <>
        <FormattedMessage id="PROFILE_LABEL_WEBSITE" />
        <Link external href={website}>
          {website}
        </Link>
      </>
    ),
  },
  {
    key: 'location',
    icon: LocationIcon,
    render: location => (
      <FormattedMessage
        id="PROFILE_LABEL_LOCATION"
        values={{ location }}
      />
    ),
  },
];

export default function UserProfile({ children, userData }) {
  const [editingProfile, setEditingProfile] = useState(false);

  if (!userData)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="USER_NOT_FOUND"
      />
    );

  return (
    <MainColumn>
      <EditEntityModal
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={userData.fields}
        fieldSchema={userSchema}
        categories={userSchemaCategories}
      />
      <EntityHeader
        name={userData.name}
        imgSrc={userData.profile}
        editable={userData.editable}
        onSettingsClick={() => setEditingProfile(true)}
      >
        <Grid container direction="column" spacing={1}>
          {items.map(item => {
            const matchingData = userData.fields.find(
              field => field.name === item.key,
            );
            const matchingSchemaObject = userSchema.find(
              schemaObject => schemaObject.name === item.key,
            );
            const fieldValue = get(matchingData, 'value', null);
            if (!matchingData || !matchingSchemaObject) return null;
            if (matchingSchemaObject.defaultValue === fieldValue)
              return null;

            const Icon = item.icon;

            return (
              <Grid key={item.key} item style={{ display: 'flex' }}>
                <Icon color="action" style={{ marginRight: 8 }} />
                <Text>{item.render(matchingData.value)}</Text>
              </Grid>
            );
          })}
        </Grid>
      </EntityHeader>
      {children}
      <EncounterGallery
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
    </MainColumn>
  );
}
