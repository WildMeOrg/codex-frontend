import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import errorTypes from '../../constants/errorTypes';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import AvatarGallery from '../../components/AvatarGallery';
import MainColumn from '../../components/MainColumn';
import Header from '../../components/Header';
import Text from '../../components/Text';
import ConfirmDelete from '../../components/ConfirmDelete';
import useGetUsers from '../../models/users/useGetUsers';
import useGetMe from '../../models/users/useGetMe';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Users() {
  const intl = useIntl();

  useDocumentTitle('USERS');
  const [userToDelete, setUserToDelete] = useState(null);

  const { data, loading, error } = useGetUsers();
  const { data: currentUserData } = useGetMe();
  if (loading) return <LoadingScreen />;
  if (error) return <SadScreen variant={errorTypes.genericError} />;

  const safeUsers = data || [];
  const filteredUsers = safeUsers.filter(
    u => u.email !== 'public@localhost',
  );
  const deleteUsername = get(userToDelete, 'name', 'Unknown user');
  const isAdministrator = get(currentUserData, 'is_admin', false);

  return (
    <MainColumn>
      <ConfirmDelete
        onClose={() => setUserToDelete(null)}
        onDelete={() => setUserToDelete(null)}
        open={Boolean(userToDelete)}
        entityToDelete={deleteUsername}
      />
      <Header
        titleId="USERS"
        showButtonLink={isAdministrator}
        buttonLinkHref="/create/user"
        buttonText={intl.formatMessage({ id: 'CREATE_USER' })}
      />
      <AvatarGallery
        entities={filteredUsers}
        titleKey="full_name"
        filterKey="full_name"
        justifyContent="flex-start"
        getHref={entity => `/users/${entity.guid}`}
        canDelete={isAdministrator}
        onDelete={entity => {
          setUserToDelete(entity);
        }}
        renderDetails={entity => {
          const affiliation = null;
          return affiliation ? <Text>{affiliation}</Text> : null;
        }}
      />
    </MainColumn>
  );
}
