import React from 'react';
import Button from '@material-ui/core/Button';
import Link from './Link';

export default function ButtonLink({
  children,
  href,
  external = false,
  linkProps,
  ...rest
}) {
  return (
    <Button {...rest}>
      <Link
        noUnderline
        href={href}
        external={external}
        {...linkProps}
      >
        {children}
      </Link>
    </Button>
  );
}
