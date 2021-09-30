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

export default function UserEditDialog({
  open,
  onClose,
  activeCollaboration,
  refreshCollaborationData,
}) {
  const {
    requestEditAccess,
    loading: requestLoading,
    error: requestError,
  } = useRequestEditAccess();

  const {
    patchCollaboration,
    loading: patchLoading,
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
                successful = await patchCollaboration(
                  activeCollaboration.guid,
                  request.actionPatch,
                );
              }

              if (successful) {
                refreshCollaborationData();
                cleanupAndClose();
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
