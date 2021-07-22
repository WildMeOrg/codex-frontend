import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import Text from '../../components/Text';
import useGetUsers from '../../models/users/useGetUsers';
import UserEditDialog from './UserEditDialog';

export default function DefaultFieldTable() {
  const intl = useIntl();
  const [editUser, setEditUser] = useState(null);
  const {
    data,
    loading,
    error: usersError,
    refresh: refreshUserData,
  } = useGetUsers();

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
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, user) => (
          <div>
            <ActionIcon
              variant="view"
              href={`/users/${get(user, 'guid')}`}
              linkProps={{ newTab: true }}
            />
            <ActionIcon
              variant="edit"
              onClick={() => setEditUser(user)}
            />
            <ActionIcon variant="delete" onClick={() => {}} />
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
      <DataDisplay
        idKey="guid"
        style={{ marginTop: 8 }}
        noTitleBar
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
