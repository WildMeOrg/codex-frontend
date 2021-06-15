import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../modules/users/selectors';
import useGetMe from '../../models/users/useGetMe';
import UserProfile from '../../components/UserProfile';
import UnprocessedBulkImportAlert from '../../components/bulkImport/UnprocessedBulkImportAlert';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Home() {
  const intl = useIntl();
  const users = useSelector(selectUsers);

  useDocumentTitle(intl.formatMessage({ id: 'HOME' }));

  const { data, loading, refresh } = useGetMe();
  const unprocessedAssetGroupId = get(data, [
    'unprocessed_asset_groups',
    '0',
  ]);

  const imageSrc = get(data, ['profile_fileupload', 'src']);
  const imageGuid = get(data, ['profile_fileupload', 'guid']);
  const userId = get(data, 'guid');

  return (
    <UserProfile
      userData={users.bob}
      userId={userId}
      imageSrc={imageSrc}
      imageGuid={imageGuid}
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
