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

  /* replace with passed user id later */
  const tempUserId = 'f1ad7600-9420-48eb-9727-e8c5f50d64cc';

  const { data, loading, refresh } = useGetUser(tempUserId);

  const imageSrc = get(data, ['profile_fileupload', 'src']);
  const imageGuid = get(data, ['profile_fileupload', 'guid']);

  return (
    <UserProfile
      userData={users[toLower(displayedUserId)]}
      userId={tempUserId}
      imageSrc={imageSrc}
      imageGuid={imageGuid}
      userDataLoading={loading}
      refreshUserData={refresh}
    />
  );
}
