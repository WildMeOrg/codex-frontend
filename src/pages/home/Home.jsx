import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import useGetMe from '../../models/users/useGetMe';
import LoadingScreen from '../../components/LoadingScreen';
import UserProfile from '../../components/UserProfile';
import UnprocessedBulkImportAlert from '../../components/bulkImport/UnprocessedBulkImportAlert';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ProfileSetup from './ProfileSetup';

export default function Home() {
  const intl = useIntl();

  useDocumentTitle(intl.formatMessage({ id: 'HOME' }));

  const { data, loading, refresh } = useGetMe();
  const unprocessedAssetGroupId = get(data, [
    'unprocessed_asset_groups',
    '0',
  ]);

  const fullName = get(data, ['full_name']);
  const userId = get(data, 'guid');

  if (loading) return <LoadingScreen />;
  // if (error) handle error
  if (!fullName)
    return <ProfileSetup userData={data} refreshUserData={refresh} />;

  return (
    <UserProfile
      someoneElse={false}
      userData={data}
      userId={userId}
      userDataLoading={loading}
      refreshUserData={refresh}
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
