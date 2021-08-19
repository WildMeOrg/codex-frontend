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

function makePretty(word) {
  const lowerCased = word.toLowerCase();
  const capitalizedFirst =
    lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
  return capitalizedFirst;
}
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
        customBodyRender: (_, userObj) => {
          // filter all possible roles by whether an attribute
          // in userObj by name of currentRole.id exists
          const rolesInCurrentUser = roleSchema.filter(
            currentRole => userObj[currentRole.id],
          );
          const roleLabelInCurrentUser = rolesInCurrentUser.map(
            currentRole => makePretty(currentRole.titleId),
          );
          return roleLabelInCurrentUser.join(', ');
        },
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
