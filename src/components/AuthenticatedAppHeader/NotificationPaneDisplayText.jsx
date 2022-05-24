import React from 'react';
// import { useIntl } from 'react-intl';

import Text from '../Text';
import Link from '../Link';

export default function NotificationPaneDisplayText({
  currentNotificationSchema,
  usrName,
  userNameGuid,
  user1Name,
  user2Name,
  yourIndName,
  yourIndividualGuid,
  theirIndName,
  theirIndividualGuid,
  formattedDeadline,
}) {
  return (
    <Text
      style={{ maxWidth: 200, margin: '0 20px' }}
      id={currentNotificationSchema?.notificationMessage}
      values={{
        userName: (
          <span>
            <Link newTab href={`/users/${userNameGuid}`}>
              {usrName}
            </Link>
          </span>
        ),
        user1Name,
        user2Name,
        yourIndividualName: (
          <span>
            <Link newTab href={`/individuals/${yourIndividualGuid}`}>
              {yourIndName}
            </Link>
          </span>
        ),
        theirIndividualName: (
          <span>
            <Link newTab href={`/individuals/${theirIndividualGuid}`}>
              {theirIndName}
            </Link>
          </span>
        ),
        formattedDeadline,
      }}
    />
  );
}
