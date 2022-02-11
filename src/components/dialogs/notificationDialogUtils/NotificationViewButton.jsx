import React from 'react';
import { get } from 'lodash-es';

import Button from '../../Button';
import usePatchNotification from '../../../models/notification/usePatchNotification';

export default function NotificationViewButton({
  notification,
  refreshNotifications,
  setActiveCollaborationNotification,
}) {
  const { markRead } = usePatchNotification();
  return (
    <Button
      onClick={async () => {
        setActiveCollaborationNotification(notification);
        await markRead(get(notification, 'guid'));
        refreshNotifications();
      }}
      style={{ maxHeight: 40 }}
      id="VIEW"
    />
  );
}
