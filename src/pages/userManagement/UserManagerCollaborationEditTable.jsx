import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import { formatUserMessage } from './utils';
import CustomAlert from '../../components/Alert';
import Text from '../../components/Text';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import ActionIcon from '../../components/ActionIcon';
import usePatchCollaboration from '../../models/collaboration/usePatchCollaboration';

const revokedPermission = 'revoked';

function Actions({ datum: collaborationRow, handleRevoke }) {
  const isRevoked =
    get(collaborationRow, 'viewStatusOne') === revokedPermission ||
    get(collaborationRow, 'viewStatusTwo') === revokedPermission;

  return isRevoked ? null : (
    <ActionIcon
      variant="revoke"
      onClick={() => handleRevoke(collaborationRow)}
    />
  );
}

export default function UserManagersCollaborationEditTable({
  inputData,
  collaborationLoading,
  collaborationError,
}) {
  const intl = useIntl();

  const {
    mutate: revokeCollab,
    success: revokeSuccess,
    loading: revokeLoading,
    clearSuccess: clearRevokeSuccess,
    error: revokeError,
    clearError: onClearRevokeError,
  } = usePatchCollaboration();

  const isLoading = revokeLoading || collaborationLoading;

  function processRevoke(collaborationRow) {
    const {
      guid: collaborationGuid,
      userOneGuid,
      userTwoGuid,
    } = collaborationRow || {};
    
    const operations = [userOneGuid, userTwoGuid].map(userGuid => ({
      op: 'replace',
      path: '/managed_view_permission',
      value: {
        user_guid: userGuid,
        permission: 'revoked',
      },
    }));

    revokeCollab({ collaborationGuid, operations });
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
        userOne: formatUserMessage(
          { fullName: member1?.full_name, email: member1?.email },
          intl,
        ),
        userOneGuid: get(member1, 'guid'),
        userTwo: formatUserMessage(
          { fullName: member2?.full_name, email: member2?.email },
          intl,
        ),
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
        customBodyComponent: Actions,
        cellRendererProps: {
          handleRevoke: processRevoke,
        },
      },
    },
  ];
  return (
    <>
      <DataDisplay
        idKey="guid"
        loading={isLoading}
        titleId="USER_MANAGEMENT_COLLABORATIONS"
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
      {revokeSuccess && (
        <CustomAlert
          style={{ marginTop: 16 }}
          severity="success"
          titleId="COLLABORATION_REVOKE_SUCCESS"
          onClose={clearRevokeSuccess}
        />
      )}
    </>
  );
}
