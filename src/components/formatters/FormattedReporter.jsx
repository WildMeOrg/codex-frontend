import React from 'react';

import Link from '../Link';
import Text from '../Text';

export default function FormattedReporter({
  reporter,
  ...textProps
}) {
  const { guid, fullName } = reporter || {};

  function getUserLink(text) {
    return guid ? <Link to={`/users/${guid}`}>{text}</Link> : text;
  }

  return (
    <Text
      variant="inherit"
      id={fullName ? 'REPORTED_BY_USER' : 'REPORTED_BY_UNNAMED_USER'}
      values={{
        name: fullName,
        link: getUserLink,
      }}
      {...textProps}
    />
  );
}
