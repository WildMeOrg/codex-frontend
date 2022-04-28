import React from 'react';
import Link from '../components/Link';

export const getNotificationProps = notification => {
  const senderName = notification?.sender_name || 'Unnamed User';
  const user1Name =
    notification?.message_values?.user1_name || 'Unnamed User';
  const user2Name =
    notification?.message_values?.user2_name || 'Unnamed User';

  const yourIndividualName = 'one of your individuals';
  // notification?.message_values?.user2_name || 'Unnamed Individual'; //TODO update after DEX-927 is resolved
  // TODO make a link
  const theirIndividualName =
    notification?.message_values?.target_individual_name ||
    'Unnamed Individual';
  console.log('deleteMe theirIndividualName is: ');
  console.log(theirIndividualName);
  const theirIndividualGuid =
    notification?.message_values?.target_individual_guid;
  console.log('deleteMe theirIndividualGuid is: ');
  console.log(theirIndividualGuid);
  const theirIndividualContent = (
    <Link
      newTab
      external
      href={`/individuals/${theirIndividualGuid}`}
    >
      {theirIndividualName}
    </Link>
  );
  return {
    senderName,
    user1Name,
    user2Name,
    yourIndividualName,
    theirIndividualContent,
  };
};
