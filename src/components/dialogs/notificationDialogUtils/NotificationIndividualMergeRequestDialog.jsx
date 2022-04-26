import React from 'react';
import { get } from 'lodash-es';

import useBlockMerge from '../../../models/individual/useBlockMerge';
import useAllowMerge from '../../../models/individual/useAllowMerge';
import { notificationSchema } from '../../../constants/notificationSchema';
import NotificationDetailsDialog from '../NotificationDetailsDialog';

export default function NotificationIndividualMergeDialog({
  open,
  onClose,
  notification,
}) {
  const notificationType = notification?.message_type;
  const mergeRequestId = notification?.message_values?.request_id;
  const currentNotificationSchema = get(
    notificationSchema,
    notificationType,
  );
  const {
    mutate: blockMerge,
    error: blockError,
    loading: blockLoading,
  } = useBlockMerge();

  const {
    mutate: allowMerge,
    error: allowError,
    loading: allowLoading,
  } = useAllowMerge();

  const error = blockError || allowError;
  const isError = blockError || allowError;

  const onClickAllow = async requestId => {
    const response = await allowMerge({
      mergeRequestId: requestId,
    });
    if (response?.status === 200) onClose();
  };
  const onClickBlock = async requestId => {
    const response = await blockMerge({
      mergeRequestId: requestId,
    });
    if (response?.status === 200) onClose();
  };
  const availableButtons = [
    {
      name: 'allow',
      buttonId: 'ALLOW_MERGE',
      onClick: () => onClickAllow(mergeRequestId),
      loading: allowLoading,
    },
    {
      name: 'block',
      buttonId: 'BLOCK_MERGE',
      onClick: () => onClickBlock(mergeRequestId),
      loading: blockLoading,
    },
  ];
  return (
    <NotificationDetailsDialog
      open={open}
      onClose={onClose}
      notification={notification}
      titleId={get(currentNotificationSchema, 'titleId')}
      moreDetailedDescription={get(
        currentNotificationSchema,
        'moreDetailedDescription',
      )}
      buttons={availableButtons}
      isError={isError}
      error={error}
    />
  );
}
