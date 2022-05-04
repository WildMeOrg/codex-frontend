import React from 'react';
// import { useIntl } from 'react-intl';

import Text from '../Text';
import Link from '../Link';

export default function NotificationPaneDisplayText({
  currentNotificationSchema,
  userName,
  user1Name,
  user2Name,
  yourIndividualName,
  theirIndName,
  theirIndividualGuid,
  formattedDeadline,
}) {
  // const intl = useIntl();
  return (
    <Text
      style={{ maxWidth: 200, margin: '0 20px' }}
      id={currentNotificationSchema?.notificationMessage}
      values={{
        userName,
        user1Name,
        user2Name,
        yourIndividualName,
        theirIndividualName: (
          <span>
            <Link newTab href={`/individuals/${theirIndividualGuid}`}>
              {theirIndName}
            </Link>
          </span>
        ),
        formattedDeadline,
      }}
    >
      {/* {intl.formatMessage(
        { id: currentNotificationSchema?.notificationMessage },
        {
          userName,
          user1Name,
          user2Name,
          yourIndividualName,
          theirIndividualName: (
            <span>
              <Link
                newTab
                href={`/individuals/${theirIndividualGuid}`}
              >
                {theirIndName}
              </Link>
            </span>
          ),
          formattedDeadline,
        },
      )} */}
    </Text>
  );
}
