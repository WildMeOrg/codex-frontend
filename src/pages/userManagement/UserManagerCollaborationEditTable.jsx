import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { filter, get } from 'lodash-es';

import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

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
  const {
    data: currentUserData,
    isLoading: userDataLoading,
  } = useGetMe();

  const intl = useIntl();

  const {
    mutate: patchCollaboration,
    isLoading: patchLoading,
    error: patchError,
    clearError: onClearPatchError,
  } = usePatchCollaboration();

  const isLoading = userDataLoading || patchLoading;
  const [revokeSuccess, setRevokeSuccess] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  async function processRevoke(collaboration) {
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
    const revokeResults = await patchCollaboration({
      collaborationGuid: collaboration?.guid,
      operations: operations,
    });
    if (revokeResults?.status === 200) setRevokeSuccess(true);
  }

  async function processRestore(collaboration) {
    const userOneOperations = [
      {
        op: 'replace',
        path: '/managed_view_permission',
        value: {
          user_guid: collaboration?.userOneGuid,
          permission: 'approved',
        },
      },
    ];
    const userTwoOperations = [
      {
        op: 'replace',
        path: '/managed_view_permission',
        value: {
          user_guid: collaboration?.userTwoGuid,
          permission: 'approved',
        },
      },
    ];
    const results = await Promise.all([
      patchCollaboration({
        collaborationGuid: collaboration?.guid,
        operations: userOneOperations,
      }),
      patchCollaboration({
        collaborationGuid: collaboration?.guid,
        operations: userTwoOperations,
      }),
    ]);
    if (
      filter(results, result => result?.status === 200, []).length ===
      2
    )
      setRestoreSuccess(true);
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
    // ?.filter(
    //   collab =>
    //     get(collab, 'viewStatusOne') !== revokedPermission ||
    //     get(collab, 'viewStatusTwo') !== revokedPermission,
    // );
  }
  const tableFriendlyData = tranformDataForCollabTable(inputData);
  const tableColumns = [
    {
      name: 'userOne',
      align: 'right',
      label: intl.formatMessage(
        // Alignments in this table don't look great, but they are grouped into visually meaningful chunks. I'm open to more aesthetically pleasing ideas
        { id: 'USER_ONE' },
      ),
      options: {
        customBodyRender: userOne => (
          <Text variant="body2">{userOne}</Text>
        ),
      },
    },
    {
      name: 'viewStatusOne',
      align: 'left',
      label: intl.formatMessage({ id: 'USER_ONE_VIEW_STATUS' }),
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
      align: 'right',
      label: intl.formatMessage({
        id: 'USER_TWO',
      }),
      options: {
        customBodyRender: userTwo => (
          <Text variant="body2">{userTwo}</Text>
        ),
      },
    },
    {
      name: 'viewStatusTwo',
      align: 'left',
      label: intl.formatMessage({ id: 'USER_TWO_VIEW_STATUS' }),
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
      align: 'left',
      label: intl.formatMessage({
        id: 'ACTIONS',
      }),
      options: {
        displayInFilter: false,
        customBodyRender: (_, collaboration) => {
          const isRevoked =
            get(collaboration, 'viewStatusOne') ===
              revokedPermission ||
            get(collaboration, 'viewStatusTwo') === revokedPermission;
          return isRevoked ? (
            <div style={{ display: 'flex' }}>
              <ActionIcon
                variant="restore"
                onClick={() => processRestore(collaboration)}
                loading={isLoading}
              />
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <ActionIcon
                variant="revoke"
                onClick={() => processRevoke(collaboration)}
                loading={isLoading}
              />
            </div>
          );
        },
      },
    },
  ];
  return [
    <Grid item>
      <DataDisplay
        idKey="guid"
        loading={isLoading}
        title={<FormattedMessage id="EDIT_COLLABORATIONS" />}
        style={{ marginTop: 8 }}
        variant="secondary"
        columns={tableColumns}
        data={tableFriendlyData || []}
        noResultsTextId="NO_COLLABORATIONS_MESSAGE"
      />
      {collaborationLoading ? (
        <Skeleton style={{ transform: 'unset' }} height={44} />
      ) : null}
      {collaborationError ? (
        <Text
          id="COLLABORATION_DATA_ERROR"
          variant="body2"
          style={{ margin: '8px 16px', display: 'block' }}
        />
      ) : null}
      {patchError && (
        <CustomAlert
          severity="error"
          titleId="COLLABORATION_REVOKE_ERROR"
          onClose={() => {
            onClearPatchError();
          }}
        >
          {patchError
            ? patchError +
              '. ' +
              intl.formatMessage({
                id: 'COLLAB_REVOKE_ERROR_SUPPLEMENTAL',
              })
            : intl.formatMessage({ id: 'UNKNOWN_ERROR' })}
        </CustomAlert>
      )}
      {revokeSuccess && (
        <CustomAlert
          severity="success"
          titleId="COLLABORATION_REVOKE_SUCCESS"
          onClose={() => {
            setRevokeSuccess(false);
          }}
        />
      )}
      {restoreSuccess && (
        <CustomAlert
          severity="success"
          titleId="COLLABORATION_RESTORE_SUCCESS"
          onClose={() => {
            setRestoreSuccess(false);
          }}
        />
      )}
    </Grid>,
  ];
}
