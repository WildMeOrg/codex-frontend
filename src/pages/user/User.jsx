import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { get, capitalize, toLower } from 'lodash-es';
import { selectUsers } from '../../modules/users/selectors';
import useGetUser from '../../models/users/useGetUser';
import UserProfile from '../../components/UserProfile';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User({ userId }) {
  const { id } = useParams();
  const displayedUserId = userId || id;
  useDocumentTitle(capitalize(displayedUserId));
  const users = useSelector(selectUsers);

  const { data, loading, refresh } = useGetUser(
    '5d9ac656-426b-40bf-a7a1-99ffe52f8786',
  );

  const imageSrc = get(data, ['profile_fileupload', 'src']);
  const imageGuid = get(data, ['profile_fileupload', 'guid']);

  return (
    <UserProfile
      userData={users[toLower(displayedUserId)]}
      imageSrc={imageSrc}
      imageGuid={imageGuid}
      userDataLoading={loading}
      refreshUserData={refresh}
    />
  );
}
