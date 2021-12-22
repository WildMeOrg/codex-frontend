import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import DialogActions from '@material-ui/core/DialogActions';

import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import useRequestEditAccess from '../../../models/collaboration/useRequestEditAccess';
import Alert from '../../Alert';
import Button from '../../Button';
import Text from '../../Text';
import StandardDialog from '../../StandardDialog';
import PermissionBlock from './PermissionBlock';
import collaborationStates from './collaborationStates';
import queryKeys from '../../../constants/queryKeys';

const collaborationSchemas = Object.values(collaborationStates);

export default function UserEditDialog({
  open,
  onClose,
  activeCollaboration,
}) {
  const queryClient = useQueryClient();
  const {
    requestEditAccess,
    loading: requestLoading,
    error: requestError,
    setError: setRequestError,
  } = useRequestEditAccess();

  const {
    collabPatchArgs,
    isLoading: patchLoading,
    isError,
    isSuccess,
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
    setRequestError(null);
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
              let successful;
              if (request.sendEditRequest) {
                successful = await requestEditAccess(
                  activeCollaboration.guid,
                );
              } else {
                collabPatchArgs(
                  activeCollaboration.guid,
                  request.actionPatch,
                );
              }

              if (isSuccess || successful) {
                cleanupAndClose();
                queryClient.invalidateQueries(queryKeys.me);
              }
            }}
            loading={loading}
            id="SAVE"
          />
        </DialogActions>
      )}
    </StandardDialog>
  );
}
