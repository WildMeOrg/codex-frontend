import { get } from 'lodash-es';

import { formatDateCustom } from './formatters';

export const getNotificationProps = (
  intl,
  notification,
  currentUserGuid,
) => {
  const userName =
    notification?.sender_name ||
    intl.formatMessage({ id: 'Unnamed User' });
  const userNameGuid = notification?.sender_guid;
  const user1Name =
    notification?.message_values?.user1_name ||
    intl.formatMessage({ id: 'Unnamed User' });
  const user2Name =
    notification?.message_values?.user2_name ||
    intl.formatMessage({ id: 'Unnamed User' });
  const user1Guid = notification?.message_values?.user1_guid || '';
  const user2Guid = notification?.message_values?.user2_guid || '';
  const otherUserGuidForManagerNotifications =
    currentUserGuid === user1Guid ? user2Guid : user1Guid;
  const otherUserNameForManagerNotifications =
    otherUserGuidForManagerNotifications === user1Guid
      ? user1Name
      : user2Name;
  const managerName =
    notification?.message_values?.manager_name ||
    intl.formatMessage({ id: 'UNNAMED_MANAGER' });
  const theirIndividualName = get(notification, [
    'message_values',
    'other_individuals',
    '0',
    'primaryName',
  ]); // @TODO perhaps implement currentUserGuid for this and the below related?
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
    otherUserGuidForManagerNotifications,
    otherUserNameForManagerNotifications,
    managerName,
  };
};
