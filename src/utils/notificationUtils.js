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
  const theirIndName =
    notification?.message_values?.target_individual_name ||
    'Unnamed Individual';
  const theirIndividualGuid =
    notification?.message_values?.target_individual_guid;
  const theirIndividualName = (
    <span>
      <p>Testing</p>
    </span>
  );
  // const theirIndividualName = (
  //   <Link
  //     newTab
  //     external
  //     href={`/individuals/${theirIndividualGuid}`}
  //   >
  //     {theirIndName}
  //   </Link>
  // );

  // TODO implement deadline after DEX-927 is resolved
  // const deadline = notification?.message_values?.eta;
  // const formattedDeadline = deadline ? formatDateCustom(deadline, 'LLLL do') : intl.formatMessage(
  //       { id: 'DATE_MISSING' },
  //     );
  const formattedDeadline = 'two weeks after the merge was requested'; // TODO remove after DEX-927 is resolved
  return {
    senderName,
    user1Name,
    user2Name,
    yourIndividualName,
    theirIndividualName,
    formattedDeadline,
  };
};
