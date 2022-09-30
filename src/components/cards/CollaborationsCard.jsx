import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { get, partition } from 'lodash-es';

import useGetUser from '../../models/users/useGetUser';
import Card from './Card';
import ActionIcon from '../ActionIcon';
import Text from '../Text';
import Link from '../Link';
import DataDisplay from '../dataDisplays/DataDisplay';
import CollaborationsDialog from './collaborations/CollaborationsDialog';

export default function CollaborationsCard({
  userId,
  htmlId = null,
}) {
  const intl = useIntl();
  const [activeCollaboration, setActiveCollaboration] =
    useState(null);
  const [
    collabDialogButtonClickLoading,
    setCollabDialogButtonClickLoading,
  ] = useState(false);

  const { data, loading } = useGetUser(userId);

  useEffect(() => {
    setCollabDialogButtonClickLoading(false);
  }, [data]);

  const collaborations = get(data, ['collaborations'], []);
  const tableData = collaborations.map(collaboration => {
    const collaborationMembers = Object.values(
      get(collaboration, 'members', []),
    );
    /* If there is a member with viewState "creator", this is not actually a collaboration
       member it is the user manager who created the collaboration. */
    const filteredCollaborationMembers = collaborationMembers.filter(
      member => member.viewState !== 'creator',
    );
    const [thisUserDataArray, otherUserDataArray] = partition(
      filteredCollaborationMembers,
      member => member.guid === userId,
    );

    const thisUserData = get(thisUserDataArray, '0', {});
    const otherUserData = get(otherUserDataArray, '0', {});

    let teamViewState = 'No access';
    let teamEditState = 'No access';
    if (
      thisUserData.viewState === 'pending' ||
      otherUserData.viewState === 'pending'
    ) {
      teamViewState = 'Pending';
    }
    if (
      thisUserData.editState === 'pending' ||
      otherUserData.editState === 'pending'
    ) {
      teamEditState = 'Pending';
    }
    if (
      thisUserData.viewState === 'approved' &&
      otherUserData.viewState === 'approved'
    ) {
      teamViewState = 'Access granted';
    }
    if (
      thisUserData.editState === 'approved' &&
      otherUserData.editState === 'approved'
    ) {
      teamEditState = 'Access granted';
    }

    return {
      created: collaboration.created,
      guid: collaboration.guid,
      teamViewState,
      teamEditState,
      thisUserData,
      otherUserData,
      otherUserName:
        get(otherUserData, 'full_name') || 'Unnamed User',
      otherUserId: get(otherUserData, 'guid', ''),
    };
  });

  const columns = [
    {
      name: 'otherUserName',
      label: intl.formatMessage({ id: 'NAME' }),
      options: {
        customBodyRender: (otherUserName, datum) => (
          <Link to={`/users/${get(datum, 'otherUserId')}`}>
            <Text variant="body2">{otherUserName}</Text>
          </Link>
        ),
      },
    },
    {
      name: 'teamViewState',
      label: intl.formatMessage({ id: 'VIEW' }),
    },
    {
      name: 'teamEditState',
      label: intl.formatMessage({ id: 'EDIT' }),
    },
    {
      name: 'actions',
      label: intl.formatMessage({ id: 'ACTIONS' }),
      options: {
        customBodyRender: (_, collaboration) => (
          <ActionIcon
            labelId="EDIT"
            variant="edit"
            onClick={() => setActiveCollaboration(collaboration)}
          />
        ),
      },
    },
  ];

  return (
    <Card titleId="COLLABORATIONS" htmlId={htmlId}>
      <CollaborationsDialog
        open={Boolean(activeCollaboration)}
        onClose={() => setActiveCollaboration(null)}
        activeCollaboration={activeCollaboration}
        setCollabDialogButtonClickLoading={
          setCollabDialogButtonClickLoading
        }
      />
      <DataDisplay
        loading={loading || collabDialogButtonClickLoading}
        noResultsTextId="NO_COLLABORATIONS"
        style={{ marginTop: 12 }}
        noTitleBar
        columns={columns}
        data={tableData}
        idKey="guid"
        tableContainerStyles={{ maxHeight: 600 }}
      />
    </Card>
  );
}
