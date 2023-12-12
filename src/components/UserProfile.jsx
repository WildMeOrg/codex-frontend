import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import { EditOutlined, SettingsOutlined } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import { getHighestRoleLabelId } from '../utils/roleUtils';
import useUserMetadataSchemas from '../models/users/useUserMetadataSchemas';
import useGetUserSightings from '../models/users/useGetUserSightings';
import useGetUserUnprocessedAssetGroupSightings from '../models/users/useGetUserUnproccessedAssetGroupSightings';
import { formatDate, formatUserMessage } from '../utils/formatters';
import EntityHeader from './EntityHeader';
import BigAvatar from './profilePhotos/BigAvatar';
import MainColumn from './MainColumn';
import SadScreen from './SadScreen';
import EditUserMetadata from './EditUserMetadata';
import Text from './Text';
import RequestCollaborationButton from './RequestCollaborationButton';
import SightingsCard from './cards/SightingsCard';
import MyCollaborationsCard from './cards/MyCollaborationsCard';
import UserManagerCollaborationsCard from './cards/UserManagerCollaborationsCard';
import CardContainer from './cards/CardContainer';
import PreferenceModal from './PreferenceModal';
import Button from './Button';
import UserProfileMetaDataDisplay from './UserProfileMetaDataDisplay';

export default function UserProfile({
  children,
  userData,
  userId,
  userDataLoading,
  refreshUserData,
  someoneElse,
  viewerIsUserManager,
  noCollaborate = false,
}) {
  const { data: sightingsData, loading: sightingsLoading } =
    useGetUserSightings(userId);
  const intl = useIntl();
  const [editingProfile, setEditingProfile] = useState(false);
  const metadataSchemas = useUserMetadataSchemas(userId);
  const { data: agsData, loading: agsLoading } =
    useGetUserUnprocessedAssetGroupSightings(userId);

  const metadata = useMemo(() => {
    if (!userData || !metadataSchemas) return [];
    return metadataSchemas
      .filter(
        schema => schema?.getValue(schema, userData) || !someoneElse,
      )
      .map(schema => ({
        ...schema,
        value: schema?.getValue(schema, userData),
      }));
  }, [userData, metadataSchemas, someoneElse]);

  const imageSrc = get(userData, ['profile_fileupload', 'src']);
  const imageGuid = get(userData, ['profile_fileupload', 'guid']);
  const name = formatUserMessage(
    { fullName: userData?.full_name },
    intl,
  );
  const dateCreated = formatDate(get(userData, 'created'), true);
  const email = get(userData, 'email') || '';
  const location = get(userData, 'location') || '';
  const affiliation = get(userData, 'affiliation') || '';
  const communityUsername = get(userData, 'forum_id') || '';

  const [preferenceModalOpen, setPreferenceModalOpen] =
    useState(false);

  const theme = useTheme();

  const highestRoleLabelId = getHighestRoleLabelId(userData);

  if (!userData)
    return (
      <SadScreen variant="notFound" subtitleId="USER_NOT_FOUND" />
    );

  return (
    <MainColumn fullWidth>
      <EditUserMetadata
        open={editingProfile}
        userId={userId}
        imageGuid={imageGuid}
        imageSrc={imageSrc}
        name={name}
        refreshUserData={refreshUserData}
        userDataLoading={userDataLoading}
        metadata={metadata}
        communityUsername={communityUsername}
        dateCreated={dateCreated}
        highestRoleLabelId={highestRoleLabelId}
        onClose={() => setEditingProfile(false)}
      />
      <PreferenceModal
        open={preferenceModalOpen}
        onClose={() => setPreferenceModalOpen(false)}
      />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: 90,
          marginLeft: 8,
          marginRight: 8,
        }}
      >
        <CardContainer size="large" style={{ padding: 20 }}>
          <Card size="large" style={{ width: '100%' }}>
            <CardContent>
              <EntityHeader
                name={name}
                editable
                noDivider
                onSettingsClick={
                  () => setEditingProfile(true) // ???
                }
                renderAvatar={
                  <BigAvatar
                    // editable
                    userId={userId}
                    imageGuid={imageGuid}
                    imageSrc={imageSrc}
                    name={name}
                    refreshUserData={refreshUserData}
                    userDataLoading={userDataLoading}
                  />
                }
                renderOptions={
                  noCollaborate ? undefined : (
                    <RequestCollaborationButton
                      otherUserId={userId}
                    />
                  )
                }
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{ display: 'flex', flexDirection: 'row' }}
                  >
                    {communityUsername && <>
                      <Typography
                      variant="body2"
                      sx={{ textDecoration: 'underline' }}
                    >
                      {`@${communityUsername}`}
                    </Typography>
                    <div
                      style={{
                        height: '20px',
                        width: '2px',
                        backgroundColor: 'gray',
                        margin: '0 10px',
                      }}
                    />
                    </>}
                    
                    <Text
                      variant="body2"
                      domId="selenium-user-since"
                      id="USER_SINCE"
                      values={{ date: dateCreated }}
                    />
                  </div>
                  <div
                    style={{ display: 'flex', flexDirection: 'row' }}
                  >
                    <Button
                      display="primary"
                      style={{ marginRight: 10 }}
                      onClick={() => setEditingProfile(true)}
                    >
                      <EditOutlined />
                    </Button>
                    <Button
                      display="primary"
                      style={{ marginRight: 10 }}
                      onClick={() => setPreferenceModalOpen(true)}
                    >
                      <SettingsOutlined />
                    </Button>
                  </div>
                </div>
                <Chip
                  label={highestRoleLabelId}
                  style={{
                    marginTop: 14,
                    color: theme.palette.common.black,
                    backgroundColor:
                      theme.palette.primary.main + '26',
                  }}
                />
              </EntityHeader>
              <UserProfileMetaDataDisplay
                email={email}
                location={location}
                affiliation={affiliation}
              />
            </CardContent>
          </Card>
        </CardContainer>
      </div>

      {children}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="large">
          {/* <MetadataCard
            editable
            onEdit={
              () => setEditingProfile(true) // ?
            }
            metadata={metadata}
          /> */}
          {/* <UserProjectCard
            renderActions={<IconButton><AddIcon /></IconButton>}
            projects={[
              { id: 'bob', name: 'NOAA Capricorn', count: 22, href: '/projects/noaa' },
              { id: 'suz', name: 'Project Exodia', count: 14, href: '/projects/noaa' },
              { id: 'zfeq', name: 'Turtle Kingdom LLC', count: 153, href: '/projects/noaa' },
            ]}
          /> */}
        </CardContainer>
        <CardContainer size="large">
          {!someoneElse && (
            <Grid item xs={12} id="collab-card">
              <MyCollaborationsCard userData={userData} />
            </Grid>
          )}
          {someoneElse && viewerIsUserManager && (
            <Grid item xs={12} id="collab-card">
              <UserManagerCollaborationsCard userData={userData} />
            </Grid>
          )}
          <SightingsCard
            id="pending-sightings-card"
            title={
              someoneElse
                ? intl.formatMessage(
                    { id: 'USERS_UNPROCESSED_AGS' },
                    { name },
                  )
                : intl.formatMessage({ id: 'PENDING_SIGHTINGS' })
            }
            columns={['date', 'location', 'actions']}
            sightings={agsData || []}
            linkPath="pending-sightings"
            noSightingsMsg={
              someoneElse
                ? 'NO_PENDING_SIGHTINGS_NON_SELF'
                : 'NO_PENDING_SIGHTINGS'
            }
            loading={agsLoading}
          />
          <SightingsCard
            id="sightings-card"
            title={
              someoneElse
                ? intl.formatMessage(
                    { id: 'USERS_SIGHTINGS' },
                    { name },
                  )
                : intl.formatMessage({ id: 'SIGHTINGS' })
            }
            columns={[
              'individual',
              'date',
              'locationIdValue',
              'actions',
            ]}
            hideSubmitted
            sightings={sightingsData || []}
            loading={sightingsLoading}
            noSightingsMsg={
              someoneElse ? 'NO_SIGHTINGS_NON_SELF' : 'NO_SIGHTINGS'
            }
          />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
