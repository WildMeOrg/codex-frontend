// import { deriveIndividualName } from './nameUtils';

export const getNotificationProps = notification => {
  const senderName = notification?.sender_name || 'Unnamed User';
  const user1Name =
    notification?.message_values?.user1_name || 'Unnamed User';
  const user2Name =
    notification?.message_values?.user2_name || 'Unnamed User';

  const yourIndividualName = 'one of your individuals';
  // notification?.message_values?.user2_name || 'Unnamed Individual'; //TODO update after DEX-927 is resolved
  // TODO make a link
  console.log('deleteMe notification in getNotificationProps is: ');
  console.log(notification);
  const theirIndividualName =
    notification?.message_values?.target_individual_name ||
    'Unnamed Individual';
  return {
    senderName,
    user1Name,
    user2Name,
    yourIndividualName,
    theirIndividualName,
  };
};
