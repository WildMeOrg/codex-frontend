import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import queryKeys from '../../constants/queryKeys';
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
  const queryClient = useQueryClient();
  const {
    collabPatchArgs,
    loading,
    error,
    isSuccess,
    isError,
  } = usePatchCollaboration();
  const intl = useIntl();
  // setError,

  // const [localError, setLocalError] = useState(false);
  // setLocalError(error);

  const onCloseDialog = () => {
    // if (error) setLocalError(null);
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
        {isError && (
          <CustomAlert
            severity="error"
            titleId="SERVER_ERROR"
            description={
              error
                ? error.toJSON().message
                : intl.formatMessage({ id: 'UNKNOWN_ERROR' })
            }
          />
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="basic"
          id="DECLINE_REQUEST"
          onClick={async () => {
            collabPatchArgs(collaborationId, [
              {
                op: 'replace',
                path,
                value: 'declined',
              },
            ]);

            if (isSuccess) {
              onCloseDialog();
              invalidateQueries(queryKeys.collaborations);
            }
          }}
        />
        <Button
          loading={loading}
          display="primary"
          onClick={async () => {
            collabPatchArgs(collaborationId, [
              {
                op: 'replace',
                path,
                value: 'approved',
              },
            ]);

            if (isSuccess) {
              onCloseDialog();
              invalidateQueries(queryKeys.collaborations);
            }
          }}
          id="GRANT_ACCESS"
        />
      </DialogActions>
    </StandardDialog>
  );
}
