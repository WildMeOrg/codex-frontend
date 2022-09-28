import React, { useState } from 'react';
import { get } from 'lodash-es';

import DialogActions from '@material-ui/core/DialogActions';

import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import useRequestEditAccess from '../../../models/collaboration/useRequestEditAccess';
import Alert from '../../Alert';
import Button from '../../Button';
import Text from '../../Text';
import StandardDialog from '../../StandardDialog';
import PermissionBlock from './PermissionBlock';
import collaborationStates from './collaborationStates';

const collaborationSchemas = Object.values(collaborationStates);

export default function CollaborationsDialog({
  open,
  onClose,
  activeCollaboration,
  isUserManager,
  someoneElse,
  setCollabDialogButtonClickLoading = null,
}) {
  const isUserManagerViewingOtherUser = isUserManager && someoneElse;

  const {
    mutate: requestEditAccess,
    loading: requestLoading,
    error: requestError,
    clearError: clearRequestError,
  } = useRequestEditAccess();

  const {
    mutate: patchCollaboration,
    isLoading: patchLoading,
    error: patchError,
  } = usePatchCollaboration();

  const loading = requestLoading || patchLoading;
  const error = requestError || patchError;

  const [request, setRequest] = useState(null);

  const viewStateSchema = collaborationSchemas.find(c =>
    c.test('viewState', activeCollaboration),
  );
  const editStateSchema = collaborationSchemas.find(c =>
    c.test('editState', activeCollaboration),
  );

  function cleanupAndClose() {
    setRequest(null);
    clearRequestError();
    onClose();
  }

  return (
    <StandardDialog
      open={open}
      onClose={cleanupAndClose}
      title={`Collaboration with ${get(
        activeCollaboration,
        'otherUserName',
        '',
      )}`}
    >
      <div
        style={{ width: '100%', minWidth: 360, paddingBottom: 32 }}
      >
        {request ? (
          <Text
            style={{ padding: '20px 24px 0 24px' }}
            variant="body2"
          >
            {request.actionVerificationMessage}
          </Text>
        ) : (
          <>
            <PermissionBlock
              title="View"
              testKey="viewState"
              schema={viewStateSchema}
              setRequest={setRequest}
            />
            <PermissionBlock
              title="Edit"
              testKey="editState"
              schema={editStateSchema}
              setRequest={setRequest}
              disabled={get(
                viewStateSchema,
                'viewDisablesEdit',
                false,
              )}
            />
          </>
        )}
      </div>
      {error && (
        <Alert
          style={{ margin: '0px 24px 20px 24px' }}
          severity="error"
          titleId="SERVER_ERROR"
        >
          {error}
        </Alert>
      )}
      {request && (
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button
            display="primary"
            onClick={async () => {
              if (setCollabDialogButtonClickLoading)
                setCollabDialogButtonClickLoading(true);
              let requestSuccessful;
              console.log('deleteMe request is: ');
              console.log(request);
              const deleteMeActionPatch = request.actionPatch;
              console.log('deleteMe deleteMeActionPatch is: ');
              console.log(deleteMeActionPatch);
              const managerPatch = {
                op: 'replace',
                path: get(request.actionPatch, 0)?.path?.startsWith(
                  '/view',
                )
                  ? '/managed_view_permission'
                  : '/managed_edit_permission',
                value: {
                  permission: get(
                    request.actionPatch,
                    0,
                  )?.value?.startsWith('revoked')
                    ? 'revoked'
                    : 'approved',
                },
              };
              if (request.sendEditRequest) {
                const response = (await isUserManagerViewingOtherUser)
                  ? patchCollaboration({
                      collaborationGuid: activeCollaboration.guid,
                      operations: [managerPatch],
                    })
                  : requestEditAccess({
                      collaborationGuid: activeCollaboration.guid,
                    });
                console.log('deleteMe response is: ');
                console.log(response?.status);
                // @TODO LEFT OFF HERE I don't understand why response is behaving differently here than it is below in the other patchCollaboration call. Response seems to be coming back from useMutate AFTER it comes back here??
                requestSuccessful = response?.status === 200;
              } else {
                const response = await patchCollaboration({
                  collaborationGuid: activeCollaboration.guid,
                  operations: isUserManagerViewingOtherUser
                    ? [managerPatch]
                    : request.actionPatch,
                });
                requestSuccessful = response?.status === 200;
              }

              if (requestSuccessful) cleanupAndClose();
            }}
            loading={loading}
            id="SAVE"
          />
        </DialogActions>
      )}
    </StandardDialog>
  );
}
