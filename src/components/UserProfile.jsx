import React, { useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import { getHighestRoleLabelId } from '../utils/roleUtils';
import useUserMetadataSchemas from '../models/users/useUserMetadataSchemas';
import useGetUserSightings from '../models/users/useGetUserSightings';
import useGetUserUnprocessedAssetGroupSightings from '../models/users/useGetUserUnproccessedAssetGroupSightings';
import { formatDate } from '../utils/formatters';
import EntityHeader from './EntityHeader';
import BigAvatar from './profilePhotos/BigAvatar';
import MainColumn from './MainColumn';
import SadScreen from './SadScreen';
import EditUserMetadata from './EditUserMetadata';
import Text from './Text';
import RequestCollaborationButton from './RequestCollaborationButton';
import MetadataCard from './cards/MetadataCard';
import SightingsCard from './cards/SightingsCard';
import CollaborationsCard from './cards/CollaborationsCard';
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
  const {
    data: sightingsData,
    loading: sightingsLoading,
  } = useGetUserSightings(userId);
  const intl = useIntl();
  const [editingProfile, setEditingProfile] = useState(false);
  const metadataSchemas = useUserMetadataSchemas(userId);
  const {
    data: agsData,
    loading: agsLoading,
  } = useGetUserUnprocessedAssetGroupSightings(userId);

  const metadata = useMemo(
    () => {
      if (!userData || !metadataSchemas) return [];
      return metadataSchemas
        .filter(
          schema =>
            schema?.getValue(schema, userData) || !someoneElse,
        )
        .map(schema => ({
          ...schema,
          value: schema?.getValue(schema, userData),
        }));
    },
    [userData, metadataSchemas],
  );

  const imageSrc = get(userData, ['profile_fileupload', 'src']);
  const imageGuid = get(userData, ['profile_fileupload', 'guid']);
  let name = get(
    userData,
    'full_name',
    intl.formatMessage({ id: 'UNNAMED_USER' }),
  );
  if (name === '') name = intl.formatMessage({ id: 'UNNAMED_USER' });
  const dateCreated = formatDate(get(userData, 'created'), true);

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
        metadata={metadata}
        onClose={() => setEditingProfile(false)}
      />
      <EntityHeader
        name={name}
        editable
        onSettingsClick={
          () => setEditingProfile(true) // ???
        }
        renderAvatar={
          <BigAvatar
            editable
            userId={userId}
            imageGuid={imageGuid}
            imageSrc={imageSrc}
            name={name}
            chipLabel={<FormattedMessage id={highestRoleLabelId} />}
            refreshUserData={refreshUserData}
            userDataLoading={userDataLoading}
          />
        }
        renderOptions={
          noCollaborate ? (
            undefined
          ) : (
            <RequestCollaborationButton otherUserId={userId} />
          )
        }
      >
        <Text
          variant="body2"
          domId="selenium-user-since"
          id="USER_SINCE"
          values={{ date: dateCreated }}
        />
      </EntityHeader>
      {children}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer size="small">
          <MetadataCard
            editable
            onEdit={
              () => setEditingProfile(true) // ?
            }
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
          {!someoneElse && (
            <CollaborationsCard
              htmlId="collab-card"
              userId={userId}
            />
          )}
        </CardContainer>
      </div>
    </MainColumn>
  );
}
