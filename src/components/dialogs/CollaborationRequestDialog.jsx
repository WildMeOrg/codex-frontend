import React from 'react';
import { get } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CustomAlert from '../Alert';

import usePatchCollaboration from '../../models/collaboration/usePatchCollaboration';
import StandardDialog from '../StandardDialog';
import Text from '../Text';
import Button from '../Button';

export default function CollaborationRequestDialog({
  open,
  onClose,
  notification,
}) {
  const {
    patchCollaboration,
    loading,
    error,
    setError,
  } = usePatchCollaboration();

  const onCloseDialog = () => {
    if (error) setError(null);
    onClose();
  };

  const collaborationId = get(notification, [
    'message_values',
    'collaboration_guid',
  ]);
  const senderName = get(notification, 'sender_name', 'Unnamed User');
  const mode =
    get(notification, 'message_type') === 'collaboration_request'
      ? 'view'
      : 'edit';

  const path =
    mode === 'view' ? '/view_permission' : '/edit_permission';
  const messageId =
    mode === 'view'
      ? 'COLLABORATION_VIEW_REQUEST_DESCRIPTION'
      : 'COLLABORATION_EDIT_REQUEST_DESCRIPTION';

  return (
    <StandardDialog
      open={open}
      onClose={onCloseDialog}
      titleId="COLLABORATION_REQUEST"
    >
      <DialogContent>
        <Text
          style={{ marginBottom: 20 }}
          id={messageId}
          values={{ userName: senderName }}
        />
        {error && (
          <CustomAlert
            severity="error"
            titleId="SERVER_ERROR"
            description={error}
          />
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="basic"
          id="DECLINE_REQUEST"
          onClick={async () => {
            const successful = await patchCollaboration(
              collaborationId,
              [
                {
                  op: 'replace',
                  path,
                  value: 'declined',
                },
              ],
            );

            if (successful) onCloseDialog(); // NEEDS TEST
          }}
        />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            const successful = await patchCollaboration(
              collaborationId,
              [
                {
                  op: 'replace',
                  path,
                  value: 'approved',
                },
              ],
            );

            if (successful) onCloseDialog(); // NEEDS TEST
          }}
          id="GRANT_ACCESS"
        />
      </DialogActions>
    </StandardDialog>
  );
}
