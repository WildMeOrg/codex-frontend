import React from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../modules/users/selectors';
import useGetMe from '../../models/users/useGetMe';
import useAssetGroup from '../../models/assetGroup/useAssetGroup';
import UserProfile from '../../components/UserProfile';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import UnprocessedBulkImportAlert from './UnprocessedBulkImportAlert';

export default function Home() {
  const intl = useIntl();
  const users = useSelector(selectUsers);

  useDocumentTitle(intl.formatMessage({ id: 'HOME' }));

  const { data, loading, refresh } = useGetMe();
  const unprocessedAssetGroupId = get(data, [
    'unprocessed_asset_groups',
    '0',
  ]);
  const { data: assetGroupData } = useAssetGroup(
    unprocessedAssetGroupId,
  );

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
      {assetGroupData && (
        <UnprocessedBulkImportAlert assetGroupData={assetGroupData} />
      )}
    </UserProfile>
  );
}
