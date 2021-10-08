import React from 'react';
import Button from './Button';
import Link from './Link';

export default function ButtonLink({
  children,
  href,
  external = false,
  newTab = false,
  linkProps,
  ...rest
}) {
  return (
    <Link
      noUnderline
      href={href}
      external={external}
      newTab={newTab}
      role="button"
      {...linkProps}
    >
      <Button {...rest}>{children}</Button>
    </Link>
  );
}
