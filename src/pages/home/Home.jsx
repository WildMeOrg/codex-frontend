import React from 'react';
import { get } from 'lodash-es';

import useGetMe from '../../models/users/useGetMe';
import LoadingScreen from '../../components/LoadingScreen';
import UserProfile from '../../components/UserProfile';
import UnprocessedBulkImportAlert from '../../components/bulkImport/UnprocessedBulkImportAlert';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ProfileSetup from './ProfileSetup';

export default function Home() {
  const { data, loading } = useGetMe();
  const unprocessedAssetGroups = get(
    data,
    'unprocessed_asset_groups',
    [],
  );
  const unprocessedBulks = unprocessedAssetGroups.filter(
    ag => get(ag, 'uploadType') !== 'form',
  );
  const unprocessedAssetGroupId = get(unprocessedBulks, [
    '0',
    'uuid',
  ]);

  const fullName = get(data, ['full_name']);
  const userId = get(data, 'guid');

  useDocumentTitle('HOME', { refreshKey: fullName });

  if (loading) return <LoadingScreen />;
  // if (error) handle error
  if (!fullName) return <ProfileSetup userData={data} />;

  const isUserManager = get(data, ['is_user_manager'], false);

  return (
    <UserProfile
      someoneElse={false}
      viewerIsUserManager={isUserManager}
      userData={data}
      userId={userId}
      userDataLoading={loading}
      noCollaborate
    >
      {unprocessedAssetGroupId && (
        <UnprocessedBulkImportAlert
          unprocessedAssetGroupId={unprocessedAssetGroupId}
        />
      )}
    </UserProfile>
  );
}
