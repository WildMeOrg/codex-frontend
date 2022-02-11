import React from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { get } from 'lodash-es';
import DialogContent from '@material-ui/core/DialogContent';

import Button from '../../Button';
import CustomAlert from '../../Alert';
import usePatchCollaboration from '../../../models/collaboration/usePatchCollaboration';
import queryKeys from '../../../constants/queryKeys';
// import Text from '../../Text';

export default function NotificationCollaborationGrantAccessButton({
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
    // <Text>Hi there</Text>
    <DialogContent>
      {/* I know that this is a nested DialogContent. If you have better advice for how to handle the fact that isError now lives locally withing these button files instead of the in the NotificationDetailsDialog, I'm all ears */}
      <Button
        loading={loading}
        display="primary"
        onClick={async () => {
          const response = await patchCollaborationsAsync(
            collaborationId,
            [
              {
                op: 'replace',
                path,
                value: 'approved',
              },
            ],
          );
          if (response?.status === 200) {
            onCloseDialog();
            queryClient.invalidateQueries(queryKeys.me);
          }
        }}
        id="GRANT_ACCESS"
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
    </DialogContent>
  );
}
