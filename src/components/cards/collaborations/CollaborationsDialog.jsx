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
  setCollabDialogButtonClickLoading = null,
}) {
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
              if (request.sendEditRequest) {
                const response = await requestEditAccess({
                  collaborationGuid: activeCollaboration.guid,
                });
                requestSuccessful = response?.status === 200;
              } else {
                const response = await patchCollaboration({
                  collaborationGuid: activeCollaboration.guid,
                  operations: request.actionPatch,
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
