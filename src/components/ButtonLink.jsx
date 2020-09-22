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
    <Button {...rest}>
      <Link
        noUnderline
        href={href}
        external={external}
        newTab={newTab}
        {...linkProps}
      >
        {children}
      </Link>
    </Button>
  );
}
