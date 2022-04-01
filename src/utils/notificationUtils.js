import { deriveIndividualName } from './nameUtils';

export const getNotificationProps = notification => {
  const senderName = notification?.sender_name || 'Unnamed User';
  const user1Name =
    notification?.message_values?.user1_name || 'Unnamed User';
  const user2Name =
    notification?.message_values?.user2_name || 'Unnamed User';

  // TODO flesh out more once this is included in notifications DEX-739
  const individual1AdoptionName = deriveIndividualName(
    notification,
    'AdoptionName',
    'Unnamed individual',
  );

  const individual2AdoptionName = deriveIndividualName(
    notification,
    'AdoptionName',
    'Unnamed individual',
  );
  return {
    senderName,
    user1Name,
    user2Name,
    individual1AdoptionName,
    individual2AdoptionName,
  };
};
