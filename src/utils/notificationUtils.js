import { get } from 'lodash-es';

import { formatDateCustom } from './formatters';

export const getNotificationProps = (intl, notification) => {
  console.log('deleteMe notification in notificationUtils is: ');
  console.log(notification);
  const userName = notification?.sender_name || 'Unnamed User';
  const userNameGuid = notification?.sender_guid;
  const user1Name =
    notification?.message_values?.user1_name || 'Unnamed User';
  const user2Name =
    notification?.message_values?.user2_name || 'Unnamed User';

  const theirIndividualName = get(notification, [
    'message_values',
    'other_individuals',
    '0',
    'primaryName',
  ]);
  const theirIndividualGuid = get(notification, [
    'message_values',
    'other_individuals',
    '0',
    'guid',
  ]);
  const yourIndName =
    notification?.message_values?.target_individual_name ||
    'Unnamed Individual';
  const yourIndividualGuid =
    notification?.message_values?.target_individual_guid;

  const deadline = notification?.message_values?.deadline;
  const formattedDeadline = deadline
    ? formatDateCustom(deadline, 'LLLL do')
    : intl.formatMessage({ id: 'DATE_MISSING' });
  return {
    userName,
    userNameGuid,
    user1Name,
    user2Name,
    yourIndName,
    yourIndividualGuid,
    theirIndividualName,
    theirIndividualGuid,
    formattedDeadline,
  };
};
