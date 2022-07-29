import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import UserDeleteDialog from '../../components/dialogs/UserDeleteDialog';
import Text from '../../components/Text';
import useGetUsers from '../../models/users/useGetUsers';
import UserEditDialog from './UserEditDialog';
import roleSchema from './constants/roleSchema';

function getRoleLabels(user, intl) {
  const rolesInCurrentUser = roleSchema.filter(
    currentRole => user[currentRole.id],
  );
  const translatedRoles = rolesInCurrentUser.map(role =>
    intl.formatMessage({ id: role.titleId }),
  );
  return translatedRoles.join(', ');
}
export default function UserEditTable() {
  const intl = useIntl();
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const { data, loading, error: usersError } = useGetUsers();

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
      align: 'left',
      label: intl.formatMessage({ id: 'FULLNAME' }),
      options: {
        customBodyRender: fullName => (
          <Text variant="body2">{fullName}</Text>
        ),
      },
    },
    {
      name: 'roles',
      align: 'left',
      label: intl.formatMessage({ id: 'ROLES' }),
      options: {
        getStringValue: (_, userObj) => getRoleLabels(userObj, intl),
        customBodyRender: (_, userObj) =>
          getRoleLabels(userObj, intl),
      },
    },
    {
      name: 'actions',
      align: 'right',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        displayInFilter: false,
        customBodyRender: (_, user) => (
          <div
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
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

  const safeUsers = data || [];
  const activeUsers = safeUsers.filter(
    u => u?.full_name !== 'Inactivated User',
  );

  return (
    <Grid item>
      <UserEditDialog
        open={Boolean(editUser)}
        onClose={() => {
          setEditUser(null);
        }}
        userData={editUser}
      />
      <UserDeleteDialog
        open={Boolean(deleteUser)}
        onClose={() => {
          setDeleteUser(null);
        }}
        userData={deleteUser}
      />
      <DataDisplay
        idKey="guid"
        title={<FormattedMessage id="EDIT_USERS" />}
        style={{ marginTop: 8 }}
        variant="secondary"
        columns={tableColumns}
        data={activeUsers}
        loading={loading}
        tableContainerStyles={{ maxHeight: 500 }}
      />
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
