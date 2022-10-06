import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import Text from '../Text';
import Link from '../Link';

export default function NotificationPaneDisplayText({
  currentNotificationSchema,
  userName,
  userNameGuid,
  user1Name,
  user2Name,
  yourIndName,
  yourIndividualGuid,
  theirIndividualName,
  theirIndividualGuid,
  formattedDeadline,
  otherUserGuidForManagerNotifications,
  otherUserNameForManagerNotifications,
  managerName,
  timeSince,
}) {
  const theme = useTheme();

  return (
    <div style={{ maxWidth: 280, margin: '0 12px' }}>
      <Text
        id={currentNotificationSchema?.notificationMessage}
        values={{
          userName: (
            <span>
              <Link newTab href={`/users/${userNameGuid}`}>
                {userName}
              </Link>
            </span>
          ),
          user1Name,
          user2Name,
          yourIndividualName: (
            <span>
              <Link
                newTab
                href={`/individuals/${yourIndividualGuid}`}
              >
                {yourIndName}
              </Link>
            </span>
          ),
          theirIndividualName: (
            <span>
              <Link
                newTab
                href={`/individuals/${theirIndividualGuid}`}
              >
                {theirIndividualName}
              </Link>
            </span>
          ),
          formattedDeadline,
          otherUserNameForManagerNotifications: (
            <span>
              <Link
                newTab
                href={`/users/${otherUserGuidForManagerNotifications}`}
              >
                {otherUserNameForManagerNotifications}
              </Link>
            </span>
          ),
          managerName,
        }}
      />
      <Text
        variant="body2"
        style={{
          color: theme.palette.text.secondary,
        }}
        id="TIME_SINCE"
        values={{ timeSince }}
      />
    </div>
  );
}
