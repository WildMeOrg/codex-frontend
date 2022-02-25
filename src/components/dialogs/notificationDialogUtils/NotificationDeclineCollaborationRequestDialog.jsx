import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { get } from 'lodash-es';

import Button from '../../Button';
import CustomAlert from '../../Alert';
import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import queryKeys from '../../../constants/queryKeys';

export default function NotificationDeclineCollaborationRequestDialog({
  notification,
  onCloseDialog,
  path,
}) {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const {
    patchCollaborationsAsync,
    loading,
    error,
    isError,
  } = usePatchCollaboration();
  const collaborationId = get(notification, [
    'message_values',
    'collaboration_guid',
  ]);
  return (
    <div>
      <Button
        display="basic"
        id="DECLINE_REQUEST"
        loading={loading}
        onClick={async () => {
          const response = await patchCollaborationsAsync(
            collaborationId,
            [
              {
                op: 'replace',
                path,
                value: 'declined',
              },
            ],
          );
          if (response?.status === 200) {
            onCloseDialog();
            queryClient.invalidateQueries(queryKeys.me);
          }
        }}
      />
      {isError && (
        <CustomAlert
          severity="error"
          titleId="SERVER_ERROR"
          description={
            error || intl.formatMessage({ id: 'UNKNOWN_ERROR' })
          }
        />
      )}
    </div>
  );
}
