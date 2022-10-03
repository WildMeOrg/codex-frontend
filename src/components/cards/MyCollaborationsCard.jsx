import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { get, partition } from 'lodash-es';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { cellRendererTypes } from '../dataDisplays/cellRenderers';
import Text from '../Text';
import DataDisplay from '../dataDisplays/DataDisplay';
import CollaborationsDialog from './collaborations/CollaborationsDialog';

export default function MyCollaborationsCard({ userData }) {
  const intl = useIntl();
  const [activeCollaboration, setActiveCollaboration] =
    useState(null);
  const [
    collabDialogButtonClickLoading,
    setCollabDialogButtonClickLoading,
  ] = useState(false);

  const handleEdit = useCallback((_, collaboration) => {
    setActiveCollaboration(collaboration);
  }, []);

  useEffect(() => {
    setCollabDialogButtonClickLoading(false);
  }, [userData]);

  const collaborations = get(userData, ['collaborations'], []);
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
      member => member.guid === userData?.guid,
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
        cellRenderer: cellRendererTypes.user,
        cellRendererProps: {
          guidProperty: 'otherUserId',
          nameProperty: 'otherUserName',
        },
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
        cellRenderer: cellRendererTypes.actionGroup,
        cellRendererProps: { onEdit: handleEdit },
      },
    },
  ];

  return (
    <>
      <CollaborationsDialog
        open={Boolean(activeCollaboration)}
        onClose={() => setActiveCollaboration(null)}
        activeCollaboration={activeCollaboration}
        setCollabDialogButtonClickLoading={
          setCollabDialogButtonClickLoading
        }
      />
      <Card>
        <CardContent>
          <Text id="COLLABORATIONS" style={{ fontWeight: 'bold' }} />
          <DataDisplay
            loading={collabDialogButtonClickLoading}
            noResultsTextId="NO_COLLABORATIONS"
            style={{ marginTop: 12 }}
            noTitleBar
            columns={columns}
            data={tableData}
            idKey="guid"
            tableContainerStyles={{ maxHeight: 600 }}
          />
        </CardContent>
      </Card>
    </>
  );
}
