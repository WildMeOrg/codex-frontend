import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import { collaborationLabelIds } from '../pages/userManagement/constants/collaboration';
import { formatUserMessage } from '../pages/userManagement/utils';
import EditCollaborationDialog from '../pages/userManagement/components/EditCollaborationDialog';
import CustomAlert from './Alert';
import Text from './Text';
import DataDisplay from './dataDisplays/DataDisplay';
import ActionIcon from './ActionIcon';
import { cellRenderers } from './dataDisplays/cellRenderers';
import usePatchCollaboration from '../models/collaboration/usePatchCollaboration';
import {
  getRequestedState,
  getSummaryState,
  summaryStates,
} from '../utils/collaborationUtils';

const ActionGroupRenderer = cellRenderers.actionGroup;

function Actions({ onRevoke, ...actionGroupRendererProps }) {
  const collaborationRow = actionGroupRendererProps.datum;

  return (
    <ActionGroupRenderer {...actionGroupRendererProps}>
      <ActionIcon
        variant="revoke"
        disabled={!collaborationRow?.isRevocable}
        onClick={() => onRevoke(collaborationRow?.guid)}
      />
    </ActionGroupRenderer>
  );
}

export default function UserManagerCollaborationEditTable({
  inputData,
  collaborationLoading,
  collaborationError,
}) {
  const intl = useIntl();
  const [activeCollaborationGuid, setActiveCollaborationGuid] =
    useState(null);

  const activeCollaboration = inputData?.find(
    collaboration => collaboration?.guid === activeCollaborationGuid,
  );

  const {
    mutate: revokeCollab,
    success: revokeSuccess,
    loading: revokeLoading,
    clearSuccess: clearRevokeSuccess,
    error: revokeError,
    clearError: onClearRevokeError,
  } = usePatchCollaboration();

  const isLoading = revokeLoading || collaborationLoading;

  function processRevoke(collaborationGuid) {
    const operations = [
      {
        op: 'replace',
        path: '/managed_view_permission',
        value: { permission: 'revoked' },
      },
    ];

    revokeCollab({ collaborationGuid, operations });
  }

  function handleEditCollaboration(_, collaborationRow) {
    setActiveCollaborationGuid(collaborationRow?.guid);
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
      const currentAccess = getSummaryState(collaboration);
      const currentAccessLabelId =
        collaborationLabelIds[currentAccess];
      const requestedAccessLabelId =
        collaborationLabelIds[getRequestedState(collaboration)];

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
        currentAccess: currentAccessLabelId
          ? intl.formatMessage({ id: currentAccessLabelId })
          : '',
        requestedAccess: requestedAccessLabelId
          ? intl.formatMessage({ id: requestedAccessLabelId })
          : '',
        isRevocable: Boolean(
          currentAccess && currentAccess !== summaryStates.revoked,
        ), // Only collaborations that are mutually approved can be mutually revoked.
      };
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
      name: 'userTwo',
      align: 'left',
      labelId: 'USER_TWO',
    },
    {
      name: 'currentAccess',
      align: 'left',
      labelId: 'COLLABORATION_CURRENT_ACCESS',
    },
    {
      name: 'requestedAccess',
      align: 'left',
      labelId: 'COLLABORATION_REQUESTED_ACCESS',
    },
    {
      name: 'actions',
      align: 'right',
      labelId: 'ACTIONS',
      options: {
        displayInFilter: false,
        customBodyComponent: Actions,
        cellRendererProps: {
          onRevoke: processRevoke,
          onEdit: handleEditCollaboration,
        },
      },
    },
  ];
  return (
    <>
      <EditCollaborationDialog
        open={Boolean(activeCollaborationGuid)}
        onClose={() => setActiveCollaborationGuid(null)}
        collaboration={activeCollaboration}
      />
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
          descriptionId="COLLAB_REVOKE_ERROR_SUPPLEMENTAL"
          descriptionValues={{ error: revokeError }}
        />
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
