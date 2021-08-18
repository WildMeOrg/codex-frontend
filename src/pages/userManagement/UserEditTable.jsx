import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import Text from '../../components/Text';
import UserEditDialog from './UserEditDialog';
import UserDeleteDialog from './UserDeleteDialog';
import roleSchema from './constants/roleSchema';

export default function UserEditTable({
  data,
  loading,
  usersError,
  refreshUserData,
}) {
  const intl = useIntl();
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const tableColumns = [
    {
      name: 'email',
      label: intl.formatMessage({ id: 'EMAIL_ADDRESS' }),
      options: {
        customBodyRender: email => (
          <Text variant="body2">{email}</Text>
        ),
      },
    },
    {
      name: 'full_name',
      label: intl.formatMessage({ id: 'FULLNAME' }),
      options: {
        customBodyRender: fullName => (
          <Text variant="body2">{fullName}</Text>
        ),
      },
    },
    {
      name: 'roles',
      label: intl.formatMessage({ id: 'ROLES' }),
      options: {
        customBodyRender: roles => (
          <Text variant="body2">{roles}</Text>
        ),
      },
    },
    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, user) => (
          <div style={{ display: 'flex' }}>
            <ActionIcon
              variant="view"
              href={`/users/${get(user, 'guid')}`}
              linkProps={{ newTab: true }}
            />
            <ActionIcon
              variant="edit"
              onClick={() => setEditUser(user)}
            />
            <ActionIcon
              variant="delete"
              onClick={() => setDeleteUser(user)}
            />
          </div>
        ),
      },
    },
  ];

  function makePretty(word) {
    const lowerCased = word.toLowerCase();
    const capitalizedFirst =
      lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
    return capitalizedFirst;
  }

  function getListOfRolesFromUser(userObj) {
    const listOfRoles = [];
    roleSchema.forEach(role => {
      const roleId = role.id;
      if (userObj[roleId]) {
        const prettyRoleTitle = makePretty(role.titleId);
        listOfRoles.push(prettyRoleTitle);
      }
    });
    return listOfRoles;
  }

  // add a new property to data that's a joined and prettified list of roles to enable search/filter
  if (data) {
    data.map(currentUser => {
      const currentUserRoles = getListOfRolesFromUser(currentUser);
      currentUser.roles = currentUserRoles.join(', ');
      return currentUserRoles;
    });
  }
  return (
    <Grid item>
      <UserEditDialog
        open={Boolean(editUser)}
        onClose={() => {
          setEditUser(null);
        }}
        userData={editUser}
        refreshUserData={refreshUserData}
      />
      <UserDeleteDialog
        open={Boolean(deleteUser)}
        onClose={() => {
          setDeleteUser(null);
        }}
        userData={deleteUser}
        refreshUserData={refreshUserData}
      />
      <DataDisplay
        idKey="guid"
        title={<FormattedMessage id="EDIT_USERS" />}
        style={{ marginTop: 8 }}
        variant="secondary"
        columns={tableColumns}
        data={data || []}
      />
      {loading ? (
        <Skeleton style={{ transform: 'unset' }} height={44} />
      ) : null}
      {usersError ? (
        <Text
          id="USER_DATA_ERROR"
          variant="body2"
          style={{ margin: '8px 16px', display: 'block' }}
        />
      ) : null}
    </Grid>
  );
}
