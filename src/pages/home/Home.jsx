import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import useGetMe from '../../models/users/useGetMe';
import LoadingScreen from '../../components/LoadingScreen';
import UserProfile from '../../components/UserProfile';
import Button from '../../components/Button';
import UnprocessedBulkImportAlert from '../../components/bulkImport/UnprocessedBulkImportAlert';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ProfileSetup from './ProfileSetup';

export default function Home() {
  const intl = useIntl();
  const [crash, setCrash] = useState(false);

  const { data, loading, refresh } = useGetMe();
  const unprocessedAssetGroupId = get(data, [
    'unprocessed_asset_groups',
    '0',
  ]);

  const fullName = get(data, ['full_name']);
  const userId = get(data, 'guid');

  useDocumentTitle(
    intl.formatMessage({ id: 'HOME' }),
    true,
    fullName,
  );

  if (crash) {
    const b = a.b.c.d.e.f;
  }

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
      <Button onClick={() => setCrash(true)}>Crash!!!!</Button>
    </UserProfile>
  );
}
