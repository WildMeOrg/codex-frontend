export const getNotificationProps = notification => {
  const senderName = notification?.sender_name || 'Unnamed User';
  const user1Name =
    notification?.message_values?.user1_name || 'Unnamed User';
  const user2Name =
    notification?.message_values?.user2_name || 'Unnamed User';
  const individual1Names = notification?.names || []; // TODO flesh out more once this is included in notifications DEX-739
  const individual1NicknameObject = individual1Names.find(
    n => n.context === 'nickname',
  );
  const individual1Nickname =
    individual1NicknameObject?.value || 'Unnamed individual';
  const individual2Names = notification?.names || []; // TODO flesh out more once this is included in notifications DEX-739
  const individual2NicknameObject = individual2Names.find(
    n => n.context === 'nickname',
  );
  const individual2Nickname =
    individual2NicknameObject?.value || 'Unnamed individual';
  return {
    senderName,
    user1Name,
    user2Name,
    individual1Nickname,
    individual2Nickname,
  };
};
