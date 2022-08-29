import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import Alert from '../../../components/Alert';
import Button from '../../../components/Button';
import InputRow from '../../../components/fields/edit/InputRow';
import SelectionEditor from '../../../components/fields/edit/SelectionEditor';
import StandardDialog from '../../../components/StandardDialog';
import Text from '../../../components/Text';
import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import { formatUserMessage } from '../../../utils/formatters';
import {
  getSummaryState,
  isEditApproved,
  isViewApproved,
  isViewRevoked,
  states as collaborationStates,
  summaryStates,
} from '../../../utils/collaborationUtils';

const coreStateChoices = [
  {
    value: 'view',
    labelId: 'COLLABORATION_STATE_VIEW',
  },
  {
    value: 'edit',
    labelId: 'COLLABORATION_STATE_EDIT',
  },
];

const fullStateChoices = [
  ...coreStateChoices,
  {
    value: 'revoked',
    labelId: 'COLLABORATION_STATE_REVOKED',
  },
];

function getPatchCollaborationOperations(
  newSummaryState,
  collaboration,
) {
  if (newSummaryState === summaryStates.revoked) {
    return [
      {
        op: 'replace',
        path: '/managed_view_permission',
        value: {
          permission: collaborationStates.revoked,
        },
      },
    ];
  }

  if (newSummaryState === summaryStates.edit) {
    return [
      {
        op: 'replace',
        path: '/managed_edit_permission',
        value: {
          permission: collaborationStates.approved,
        },
      },
    ];
  }

  if (newSummaryState === summaryStates.view) {
    const operations = [
      {
        op: 'replace',
        path: '/managed_view_permission',
        value: {
          permission: collaborationStates.approved,
        },
      },
    ];

    if (isEditApproved(collaboration)) {
      operations.push({
        op: 'replace',
        path: '/managed_edit_permission',
        value: {
          permission: collaborationStates.revoked,
        },
      });
    }

    return operations;
  }

  return [];
}

export default function EditCollaborationDialog({
  collaboration,
  open,
  onClose,
}) {
  const intl = useIntl();
  const [collaborationState, setCollaborationState] = useState(
    getSummaryState(collaboration),
  );
  const members = Object.values(collaboration?.members || {});

  const {
    mutate: patchCollaboration,
    isLoading,
    error,
    clearError,
  } = usePatchCollaboration();

  useEffect(() => {
    setCollaborationState(getSummaryState(collaboration));
  }, [collaboration]);

  const stateChoices =
    isViewApproved(collaboration) || isViewRevoked(collaboration)
      ? fullStateChoices
      : coreStateChoices;

  function handleClose() {
    setCollaborationState('');
    clearError();
    onClose();
  }

  return (
    <StandardDialog
      maxWidth="md"
      titleId="EDIT_COLLABORATION"
      open={open}
      onClose={handleClose}
    >
      <DialogContent>
        <dl style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {members.map((member, index) => (
            <div
              key={member?.guid}
              style={{
                flexGrow: 1,
                // The maxWidth aligns the user information with selection input
                maxWidth: index === 1 ? 280 : 'unset',
              }}
            >
              <Text
                component="dt"
                variant="h6"
                id="USER_X"
                values={{ userNumber: index + 1 }}
              />
              <Text component="dd" style={{ margin: 0 }}>
                {formatUserMessage(
                  { fullName: member?.full_name },
                  intl,
                )}
              </Text>
              {member?.email && (
                <Text
                  component="dd"
                  variant="caption"
                  style={{ margin: 0 }}
                >
                  {member.email}
                </Text>
              )}
            </div>
          ))}
        </dl>
        <InputRow
          schema={{
            labelId: 'EDIT_COLLABORATION_CURRENT_STATE_LABEL',
            descriptionId:
              'EDIT_COLLABORATION_CURRENT_STATE_DESCRIPTION',
          }}
          containerStyles={{ padding: '28px 0 0 0' }}
        >
          <SelectionEditor
            schema={{
              labelId: 'EDIT_COLLABORATION_CURRENT_STATE_LABEL',
              choices: stateChoices,
            }}
            value={collaborationState}
            onChange={setCollaborationState}
          />
        </InputRow>
        {error && (
          <Alert
            style={{ marginTop: 16 }}
            severity="error"
            titleId="SERVER_ERROR"
            description={error}
            onClose={clearError}
          />
        )}
      </DialogContent>
      <DialogActions
        style={{ padding: '0px 24px 24px 24px', rowGap: 4 }}
      >
        <Button display="basic" id="CANCEL" onClick={handleClose} />
        <Button
          display="primary"
          id="SAVE"
          loading={isLoading}
          onClick={async () => {
            const operations = getPatchCollaborationOperations(
              collaborationState,
              collaboration,
            );

            const result = await patchCollaboration({
              collaborationGuid: collaboration?.guid,
              operations,
            });

            if (result?.status === 200) handleClose();
          }}
        />
      </DialogActions>
    </StandardDialog>
  );
}
