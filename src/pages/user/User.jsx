import React from 'react';
import { useParams } from 'react-router-dom';

import useGetUser from '../../models/users/useGetUser';
import UserProfile from '../../components/UserProfile';
import LoadingScreen from '../../components/LoadingScreen';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User() {
  const { id } = useParams();

  const { data, loading, refresh } = useGetUser(id);
  const name = data?.full_name || 'Unnamed User';
  useDocumentTitle(name, { translateMessage: false });
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
