import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get, capitalize, toLower } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import LocationIcon from '@material-ui/icons/PersonPin';
import WebIcon from '@material-ui/icons/WebAssetSharp';
import AffiliationIcon from '@material-ui/icons/AccountBalance';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import Link from '../../components/Link';
import NotFoundPage from '../../components/NotFoundPage';
import EncounterGallery from '../../components/EncounterGallery';
import EditEntityModal from '../../components/EditEntityModal';
import { selectUsers } from '../../modules/users/selectors';
import userSchema, {
  userSchemaCategories,
} from '../../constants/userSchema';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Tasks from './Tasks';

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
    key: 'affiliation',
    icon: AffiliationIcon,
    render: affiliation => (
      <FormattedMessage
        id="PROFILE_LABEL_AFFILIATION"
        values={{ affiliation }}
      />
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

export default function User({ userId }) {
  const { id } = useParams();
  const displayedUserId = userId || id;
  useDocumentTitle(capitalize(displayedUserId));

  const activeTab = window.location.hash || '#sightings';
  console.log(activeTab);

  // fetch data for Id...
  const users = useSelector(selectUsers);
  const [editingProfile, setEditingProfile] = useState(false);

  const user = users[toLower(displayedUserId)];
  if (!user)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="USER_NOT_FOUND" />}
      />
    );

  return (
    <MainColumn>
      <EditEntityModal
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={user.fields}
        fieldSchema={userSchema}
        categories={userSchemaCategories}
      />
      <EntityHeader
        name={user.name}
        imgSrc={user.profile}
        editable={user.editable}
        onSettingsClick={() => setEditingProfile(true)}
      >
        <Grid container direction="column" spacing={1}>
          {items.map(item => {
            const matchingData = user.fields.find(
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
                <Typography>
                  {item.render(matchingData.value)}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </EntityHeader>
      {user.editable && (
        <Tabs
          value={activeTab.replace('#', '')}
          onChange={(_, newValue) => {
            window.location.hash = newValue;
          }}
          style={{ margin: '20px 0' }}
        >
          <Tab
            label={<FormattedMessage id="SIGHTINGS" />}
            value="sightings"
          />
          <Tab
            label={<FormattedMessage id="TASKS" />}
            value="tasks"
          />
        </Tabs>
      )}
      {activeTab === '#sightings' && (
        <EncounterGallery
          title={
            !user.editable ? (
              <FormattedMessage
                id="USERS_SIGHTINGS"
                values={{ name: user.name }}
              />
            ) : (
              undefined
            )
          }
          encounters={user.encounters}
          hideSubmitted
        />
      )}
      {activeTab === '#tasks' && <Tasks />}
    </MainColumn>
  );
}
