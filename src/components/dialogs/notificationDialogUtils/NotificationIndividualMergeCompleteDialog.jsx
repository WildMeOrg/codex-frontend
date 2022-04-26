import React from 'react';
import { useHistory } from 'react-router-dom';

import { get } from 'lodash-es';

import { notificationSchema } from '../../../constants/notificationSchema';
import NotificationDetailsDialog from '../NotificationDetailsDialog';

export default function NotificationIndividualMergeCompleteDialog({
  open,
  onClose,
  notification,
}) {
  const history = useHistory();
  const notificationType = notification?.message_type;
  const currentNotificationSchema = get(
    notificationSchema,
    notificationType,
  );
  const mergedIndividualGuid =
    notification?.message_values?.target_individual_guid;
  const onClickView = () =>
    history.push(`/individuals/${mergedIndividualGuid}`);
  const availableButtons = [
    {
      name: 'view',
      buttonId: 'VIEW_INDIVIDUAL',
      onClick: onClickView,
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
    />
  );
}
