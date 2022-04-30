// import React from 'react';
// import Link from '../components/Link';
// import { formatDateCustom } from '../../utils/formatters'; // TODO comment back in after DEX-927 is resolved

export const getNotificationProps = notification => {
  const userName = notification?.sender_name || 'Unnamed User';
  const user1Name =
    notification?.message_values?.user1_name || 'Unnamed User';
  const user2Name =
    notification?.message_values?.user2_name || 'Unnamed User';

  const yourIndividualName =
    'one of the individuals in your data set';
  // notification?.message_values?.user2_name || 'Unnamed Individual'; //TODO update after DEX-927 is resolved
  // TODO send off this individual's guid as well and then combine then in a Link in a formatMessage after DEX-927 is resolved
  const theirIndName =
    notification?.message_values?.target_individual_name ||
    'Unnamed Individual';
  const theirIndividualGuid =
    notification?.message_values?.target_individual_guid;

  // TODO implement deadline after DEX-927 is resolved
  // const deadline = notification?.message_values?.eta;
  // const formattedDeadline = deadline ? formatDateCustom(deadline, 'LLLL do') : intl.formatMessage(
  //       { id: 'DATE_MISSING' },
  //     );
  const formattedDeadline = 'two weeks after the merge was requested'; // TODO remove after DEX-927 is resolved
  return {
    userName,
    user1Name,
    user2Name,
    yourIndividualName,
    theirIndName,
    theirIndividualGuid,
    formattedDeadline,
  };
};
