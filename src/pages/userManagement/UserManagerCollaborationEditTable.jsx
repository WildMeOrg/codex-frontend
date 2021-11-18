import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

import Text from '../../components/Text';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import CollaborationsDialog from '../../components/cards/collaborations/CollaborationsDialog';

export default function UserManagersCollaborationEditTable({
  data,
  loading,
  error,
  refresh,
}) {
  function transformData(inputData) {
    if (!inputData || inputData.length === 0) return null;
    // TODO change the below values of userOne, userTwo, and status once DEX-553 gets resolved
    return inputData.map(entry => ({
      guid: get(entry, 'guid'),
      userOne: get(entry, ['user_guids', '0']),
      userTwo: get(entry, ['user_guids', '1']),
      status: 'Accepted',
    }));
  }
  data = transformData(data);
  const intl = useIntl();
  const [editCollaboration, setEditCollaboration] = useState(null);
  const tableColumns = [
    {
      name: 'userOne',
      label: intl.formatMessage({ id: 'USER_ONE' }),
      options: {
        customBodyRender: userOne => (
          <Text variant="body2">{userOne}</Text>
        ),
      },
    },
    {
      name: 'userTwo',
      align: 'left',
      label: intl.formatMessage({ id: 'USER_TWO' }),
      options: {
        customBodyRender: userTwo => (
          <Text variant="body2">{userTwo}</Text>
        ),
      },
    },
    {
      name: 'status',
      align: 'left',
      label: intl.formatMessage({ id: 'COLLABORATION_STATUS' }),
      options: {
        customBodyRender: status => (
          <Text variant="body2">{status}</Text>
        ),
      },
    },
    {
      name: 'actions',
      align: 'left',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        displayInFilter: false,
        customBodyRender: (_, collaboration) => (
          <div style={{ display: 'flex' }}>
            <ActionIcon
              variant="edit"
              onClick={() => setEditCollaboration(collaboration)}
            />
          </div>
        ),
      },
    },
  ];

  return (
    <Grid item>
      <CollaborationsDialog
        open={Boolean(editCollaboration)}
        onClose={() => {
          setEditCollaboration(null);
        }}
        activeCollaboration={editCollaboration}
        refreshCollaborationData={refresh}
      />
      <DataDisplay
        idKey="guid"
        title={<FormattedMessage id="EDIT_COLLABORATIONS" />}
        style={{ marginTop: 8 }}
        variant="secondary"
        columns={tableColumns}
        data={data || []}
      />
      {loading ? (
        <Skeleton style={{ transform: 'unset' }} height={44} />
      ) : null}
      {error ? (
        <Text
          id="COLLABORATION_DATA_ERROR"
          variant="body2"
          style={{ margin: '8px 16px', display: 'block' }}
        />
      ) : null}
    </Grid>
  );
}
