import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import AvatarGallery from '../../components/AvatarGallery';
import MainColumn from '../../components/MainColumn';
import Header from '../../components/Header';
import Text from '../../components/Text';
import ConfirmDelete from '../../components/ConfirmDelete';
import useGetUsers from '../../models/users/useGetUsers';
import { selectUsers } from '../../modules/users/selectors';
import { selectSiteName } from '../../modules/site/selectors';
import { selectIsAdministrator } from '../../modules/app/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Users() {
  const intl = useIntl();
  const siteName = useSelector(selectSiteName);
  const pageTitle = intl.formatMessage(
    { id: 'USERS_PAGE_TITLE' },
    { siteName },
  );
  useDocumentTitle(pageTitle, false);

  const stuff = useGetUsers();
  console.log(stuff);

  const users = useSelector(selectUsers);
  const isAdministrator = useSelector(selectIsAdministrator);

  const [userToDelete, setUserToDelete] = useState(null);
  const deleteUsername = get(userToDelete, 'name', 'Unknown user');

  const flatUsers = Object.values(users);

  const fakeUsers = [...flatUsers];

  return (
    <MainColumn>
      <ConfirmDelete
        onClose={() => setUserToDelete(null)}
        onDelete={() => setUserToDelete(null)}
        open={Boolean(userToDelete)}
        entityToDelete={deleteUsername}
      />
      <Header
        title={pageTitle}
        showButtonLink={isAdministrator}
        buttonLinkHref="/create/user"
        buttonText={intl.formatMessage({ id: 'CREATE_USER' })}
      />
      <AvatarGallery
        entities={fakeUsers}
        getHref={entity => `/users/${entity.id}`}
        canDelete={isAdministrator}
        onDelete={entity => {
          setUserToDelete(entity);
        }}
        renderDetails={entities => {
          const affiliation = get(
            entities.fields.find(
              field => field.name === 'affiliation',
            ),
            'value',
            null,
          );
          return affiliation ? <Text>{affiliation}</Text> : null;
        }}
      />
    </MainColumn>
  );
}
