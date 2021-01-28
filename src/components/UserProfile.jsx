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
import EditEntityModal from './EditEntityModal';
import Text from './Text';
import Button from './Button';
import MetadataCard from './cards/MetadataCard';
import SightingsCard from './cards/SightingsCard';
import MembersCard from './cards/MembersCard';
import CardContainer from './cards/CardContainer';

const items = [
  {
    key: 'forum_id',
    titleId: 'PROFILE_LABEL_FORUM_ID',
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
    titleId: 'PROFILE_LABEL_EMAIL',
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
    titleId: 'PROFILE_LABEL_WEBSITE',
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
    titleId: 'PROFILE_LABEL_LOCATION',
    icon: LocationIcon,
    render: location => (
      <FormattedMessage
        id="PROFILE_LABEL_LOCATION"
        values={{ location }}
      />
    ),
  },
];

export default function UserProfile({
  children,
  userData,
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

  return (
    <MainColumn fullWidth>
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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <MetadataCard metadata={items} />
          <MembersCard
            editable
            members={[
              { id: 'bob', name: 'Bob', role: 'Owner' },
              { id: 'schom', name: 'Alice', role: 'Administrator' },
              { id: 'alice', name: 'Steve', role: 'Member' },
            ]}
          />
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
