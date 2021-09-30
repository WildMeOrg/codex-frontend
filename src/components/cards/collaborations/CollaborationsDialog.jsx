import React, { useState } from 'react';
import { get } from 'lodash-es';

import DialogActions from '@material-ui/core/DialogActions';

import useRequestEditAccess from '../../../models/collaboration/useRequestEditAccess';
import Alert from '../../Alert';
import Button from '../../Button';
import Text from '../../Text';
import StandardDialog from '../../StandardDialog';
import collaborationStates from './collaborationStates';

const collaborationSchemas = Object.values(collaborationStates);

function PermissionBlock({ title, schema, setRequest, testKey }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '20px 24px 0 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: 40,
          flexShrink: 1,
        }}
      >
        <Text>{title}</Text>
        <Text variant="body2">{schema.currentStateMessage}</Text>
      </div>
      {schema.actionMessage ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'flex-end',
            minWidth: '30%',
          }}
        >
          <Button
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => {
              const actionPatch = schema.getActionPatch(
                testKey,
                schema,
              );
              setRequest({ ...schema, actionPatch });
            }}
          >
            {schema.actionMessage}
          </Button>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default function UserEditDialog({
  open,
  onClose,
  activeCollaboration,
  refreshCollaborationData,
}) {
  const {
    requestEditAccess,
    loading,
    error,
  } = useRequestEditAccess();

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
      // maxWidth="xs"
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
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="primary"
          onClick={async () => {
            console.log(activeCollaboration);
            console.log(request.actionPatch);
            if (request.sendEditRequest) {
              const successful = await requestEditAccess(
                activeCollaboration.guid,
              );
              console.log(successful);
            }
          }}
          loading={loading}
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
