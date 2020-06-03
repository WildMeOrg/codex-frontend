import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import AvatarGallery from '../../components/AvatarGallery';
import MainColumn from '../../components/MainColumn';
import Header from '../../components/Header';
import { selectUsers } from '../../modules/users/selectors';
import { selectSiteName } from '../../modules/site/selectors';
import { selectIsAdministrator } from '../../modules/app/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ConfirmDelete from './ConfirmDelete';
import CreateUser from './CreateUser';

export default function Users() {
  const intl = useIntl();
  const siteName = useSelector(selectSiteName);
  const pageTitle = intl.formatMessage(
    { id: 'USERS_PAGE_TITLE' },
    { siteName },
  );
  useDocumentTitle(pageTitle, false);

  const users = useSelector(selectUsers);
  const isAdministrator = useSelector(selectIsAdministrator);

  const [creatingUser, setCreatingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const deleteUsername = get(userToDelete, 'name', 'Unknown user');

  const flatUsers = Object.values(users);

  const fakeUsers = [
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
  ];

  return (
    <MainColumn>
      <ConfirmDelete
        onClose={() => setUserToDelete(null)}
        onDelete={() => setUserToDelete(null)}
        open={Boolean(userToDelete)}
        username={deleteUsername}
      />
      <CreateUser
        open={creatingUser}
        onCreateUser={newUser => {
          console.log(newUser);
        }}
        onClose={() => setCreatingUser(false)}
      />
      <Header
        title={pageTitle}
        showButton={isAdministrator}
        buttonText={intl.formatMessage({ id: 'CREATE_USER' })}
        onButtonClick={() => setCreatingUser(true)}
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
          return affiliation ? (
            <Typography>{affiliation}</Typography>
          ) : null;
        }}
      />
    </MainColumn>
  );
}
