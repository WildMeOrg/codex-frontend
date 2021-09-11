import React from 'react';
import { useParams } from 'react-router-dom';
import { get } from 'lodash-es';

import useGetUser from '../../models/users/useGetUser';
import UserProfile from '../../components/UserProfile';
import LoadingScreen from '../../components/LoadingScreen';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User() {
  const { id } = useParams();

  const { data, loading, refresh } = useGetUser(id);
  const name = get(data, 'full_name', 'Unnamed user');
  useDocumentTitle(name);

  if (loading) return <LoadingScreen />;

  return (
    <UserProfile
      someoneElse
      userData={data}
      userId={id}
      userDataLoading={loading}
      refreshUserData={refresh}
    />
  );
}
