import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import CustomAlert from '../../components/Alert';
import Text from '../../components/Text';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import usePatchCollaboration from '../../models/collaboration/usePatchCollaboration';
import useGetMe from '../../models/users/useGetMe';

const revokedPermission = 'revoked';

export default function UserManagersCollaborationEditTable({
  inputData,
  collaborationLoading,
  collaborationError,
}) {
  const intl = useIntl();

  const { data: currentUserData, loading: userDataLoading } =
    useGetMe();

  const {
    mutate: revokeCollab,
    success: revokeSuccess,
    loading: revokeLoading,
    clearSuccess: clearRevokeSuccess,
    error: revokeError,
    clearError: onClearRevokeError,
  } = usePatchCollaboration();

  const {
    mutate: restoreCollab,
    success: restoreSuccess,
    loading: restoreLoading,
    clearSuccess: clearRestoreSuccess,
    error: restoreError,
    clearError: onClearRestoreError,
  } = usePatchCollaboration();

  const isLoading =
    userDataLoading ||
    revokeLoading ||
    restoreLoading ||
    collaborationLoading;

  function processRevoke(collaboration) {
    const operations = [
      {
        op: 'replace',
        path: '/managed_view_permission',
        value: {
          user_guid: get(currentUserData, 'guid'),
          permission: 'revoked',
        },
      },
    ];
    revokeCollab({
      collaborationGuid: collaboration?.guid,
      operations,
    });
  }

  function processRestore(collaboration) {
    const operations = [
      {
        op: 'replace',
        path: '/managed_view_permission',
        value: {
          user_guid: get(currentUserData, 'guid'),
          permission: 'approved',
        },
      },
    ];
    restoreCollab({
      collaborationGuid: collaboration?.guid,
      operations,
    });
  }

  function tranformDataForCollabTable(originalData) {
    if (!originalData || originalData.length === 0) return null;
    return originalData.map(collaboration => {
      const collaborators = Object.values(
        get(collaboration, 'members', {}),
      );
      const member1 = get(collaborators, 0, {});
      const member2 = get(collaborators, 1, {});

      // Note: the collaboration API call returned a members OBJECT instead of array of objects, which made some tranformation gymnastics here necessary
      return {
        guid: get(collaboration, 'guid'),
        userOne: get(member1, 'full_name', get(member1, 'email')),
        userOneGuid: get(member1, 'guid'),
        userTwo: get(member2, 'full_name', get(member2, 'email')),
        userTwoGuid: get(member2, 'guid'),
        viewStatusOne: get(member1, 'viewState'),
        viewStatusTwo: get(member2, 'viewState'),
      };
      // editStatusOne: get(
      //   member1,
      //   'editState',
      // ),
      // editStatusTwo: get(
      //   member2,
      //   'editState',
      // ),
    });
  }
  const tableFriendlyData = tranformDataForCollabTable(inputData);
  const tableColumns = [
    {
      name: 'userOne',
      align: 'left',
      labelId: 'USER_ONE',
      options: {
        customBodyRender: userOne => (
          <Text variant="body2">{userOne}</Text>
        ),
      },
    },
    {
      name: 'viewStatusOne',
      align: 'left',
      labelId: 'USER_ONE_VIEW_STATUS',
      options: {
        customBodyRender: viewStatusOne => (
          <Text variant="body2">{viewStatusOne}</Text>
        ),
      },
    }, //     ), //       <Text variant="body2">{editStatusOne}</Text> //     customBodyRender: editStatusOne => ( //   options: { //   label: intl.formatMessage({ id: 'USER_ONE_EDIT_STATUS' }), //   name: 'editStatusOne', // {
    //   },
    // },
    {
      name: 'userTwo',
      align: 'left',
      labelId: 'USER_TWO',
      options: {
        customBodyRender: userTwo => (
          <Text variant="body2">{userTwo}</Text>
        ),
      },
    },
    {
      name: 'viewStatusTwo',
      align: 'left',
      labelId: 'USER_TWO_VIEW_STATUS',
      options: {
        customBodyRender: viewStatusTwo => (
          <Text variant="body2">{viewStatusTwo}</Text>
        ),
      },
    }, //     ), //       <Text variant="body2">{editStatusTwo}</Text> //     customBodyRender: editStatusTwo => ( //   options: { //   label: intl.formatMessage({ id: 'USER_TWO_EDIT_STATUS' }), //   name: 'editStatusTwo', // {
    //   },
    // },
    {
      name: 'actions',
      align: 'right',
      labelId: 'ACTIONS',
      options: {
        displayInFilter: false,
        customBodyRender: (_, collaboration) => {
          const isRevoked =
            get(collaboration, 'viewStatusOne') ===
              revokedPermission ||
            get(collaboration, 'viewStatusTwo') === revokedPermission;
          return (
            <div
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              {isRevoked ? (
                <ActionIcon
                  variant="restore"
                  onClick={() => processRestore(collaboration)}
                />
              ) : (
                <ActionIcon
                  variant="revoke"
                  onClick={() => processRevoke(collaboration)}
                />
              )}
            </div>
          );
        },
      },
    },
  ];
  return (
    <>
      <DataDisplay
        idKey="guid"
        loading={isLoading}
        titleId="EDIT_COLLABORATIONS"
        style={{ marginTop: 8 }}
        variant="secondary"
        columns={tableColumns}
        data={tableFriendlyData || []}
        noResultsTextId="NO_COLLABORATIONS_MESSAGE"
        tableContainerStyles={{ maxHeight: 500 }}
      />
      {collaborationError ? (
        <Text
          id="COLLABORATION_DATA_ERROR"
          variant="body2"
          style={{ margin: '8px 16px', display: 'block' }}
        />
      ) : null}
      {revokeError && (
        <CustomAlert
          style={{ marginTop: 16 }}
          severity="error"
          titleId="COLLABORATION_REVOKE_ERROR"
          onClose={onClearRevokeError}
        >
          {revokeError +
            '. ' +
            intl.formatMessage({
              id: 'COLLAB_REVOKE_ERROR_SUPPLEMENTAL',
            })}
        </CustomAlert>
      )}
      {restoreError && (
        <CustomAlert
          style={{ marginTop: 16 }}
          severity="error"
          titleId="COLLABORATION_RESTORE_ERROR"
          onClose={onClearRestoreError}
        >
          {restoreError +
            '. ' +
            intl.formatMessage({
              id: 'COLLAB_RESTORE_ERROR_SUPPLEMENTAL',
            })}
        </CustomAlert>
      )}
      {revokeSuccess && (
        <CustomAlert
          style={{ marginTop: 16 }}
          severity="success"
          titleId="COLLABORATION_REVOKE_SUCCESS"
          onClose={clearRevokeSuccess}
        />
      )}
      {restoreSuccess && (
        <CustomAlert
          style={{ marginTop: 16 }}
          severity="success"
          titleId="COLLABORATION_RESTORE_SUCCESS"
          onClose={clearRestoreSuccess}
        />
      )}
    </>
  );
}
