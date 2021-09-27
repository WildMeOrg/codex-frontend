import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import LinearProgress from '@material-ui/core/LinearProgress';

import useGetMe from '../../models/users/useGetMe';
import Card from './Card';
import ActionIcon from '../ActionIcon';
import Text from '../Text';
import DataDisplay from '../dataDisplays/DataDisplay';

function stateBodyRender(collaborationState) {
  const stateLabels = {
    pending: 'Pending',
    approved: 'Approved',
    not_initiated: 'Not initiated',
  };
  const label = get(stateLabels, collaborationState, '-');
  return <Text variant="body2">{label}</Text>;
}

export default function CollaborationsCard({ userId }) {
  const intl = useIntl();

  const {
    data,
    loading,
    refresh
  } = useGetMe();

  const collaborations = get(data, ['collaborations'], []);
  const tableData = collaborations.map(collaboration => {
    console.log(collaboration);
    const collaborationMembers = Object.values(get(collaboration, 'members', []));
    const otherUserData = collaborationMembers.find(member => member.guid !== userId);
    return {
      created: collaboration.created,
      ...otherUserData,
    };
  });

  const columns = [
    {
      name: 'full_name',
      label: intl.formatMessage({ id: 'NAME' }),
    },
    {
      name: 'viewState',
      label: intl.formatMessage({ id: 'VIEW' }),
      options: {
        customBodyRender: stateBodyRender,
      },
    },
    {
      name: 'editState',
      label: intl.formatMessage({ id: 'EDIT' }),
      options: {
        customBodyRender: stateBodyRender,
      },
    },
    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, collaboration) => {
          console.log(collaboration);
          return (
            <div>
              <ActionIcon
                labelId="VIEW_USER_PROFILE"
                variant="view"
              />
              <ActionIcon
                labelId="REMOVE"
                variant="delete"
              />
            </div>
          );
        },
      },
    },
  ];

  return (
    <Card title="Collaborations">
      {loading ? <LinearProgress style={{ marginTop: 24, marginBottom: 8 }} /> : (
        <DataDisplay style={{ marginTop: 12 }} noTitleBar columns={columns} data={tableData} />
      )}
    </Card>
  );
}
