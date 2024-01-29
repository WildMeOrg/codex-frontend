import React from 'react';
import { useParams } from 'react-router-dom';
import { get } from 'lodash-es';

import useGetUser from '../../models/users/useGetUser';
import useGetMe from '../../models/users/useGetMe';
import UserProfile from '../../components/UserProfile';
import LoadingScreen from '../../components/LoadingScreen';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User() {
  const { id } = useParams();

  const { data, loading, refresh } = useGetUser(id);
  const name = data?.full_name || 'Unnamed User';
  useDocumentTitle(name, { translateMessage: false });

  const { data: me, loading: meLoading } = useGetMe();

  if (loading || meLoading) return <LoadingScreen />;

  const viewerIsUserManager = get(me, ['is_user_manager'], false);
  const viewerIsUserAdmin = get(me, ['is_admin'], false);

  return (
    <UserProfile
      someoneElse
      viewerIsUserManager={viewerIsUserManager}
      viewerIsUserAdmin={viewerIsUserAdmin}
      userData={data}
      userId={id}
      userDataLoading={loading}
      refreshUserData={refresh}
    />
  );
}
