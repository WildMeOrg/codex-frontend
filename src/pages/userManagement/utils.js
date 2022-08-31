export function formatUserMessage(user, intl) {
  const { fullName, email } = user || {};

  if (fullName && email) {
    return intl.formatMessage(
      { id: 'USER_WITH_EMAIL' },
      { fullName, email },
    );
  }

  if (fullName) {
    return intl.formatMessage(
      { id: 'USER_WITH_UNKNOWN_EMAIL' },
      { fullName },
    );
  }

  if (email) {
    return intl.formatMessage(
      { id: 'UNNAMED_USER_WITH_EMAIL' },
      { email },
    );
  }

  return intl.formatMessage({
    id: 'UNNAMED_USER_WITH_UNKNOWN_EMAIL',
  });
}
