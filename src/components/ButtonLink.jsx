import React from 'react';
import { HashLink } from 'react-router-hash-link';
import Button from './Button';
import Link from './Link';

export default function ButtonLink({
  children,
  href,
  external = false,
  newTab = false,
  isHashLink = false,
  linkProps,
  ...rest
}) {
  if (isHashLink) {
    return (
      <HashLink
        style={{ textDecoration: 'unset' }}
        to={href}
        {...linkProps}
      >
        <Button {...rest}>{children}</Button>
      </HashLink>
    );
  }
  return (
    <Link
      noUnderline
      href={href}
      external={external}
      newTab={newTab}
      {...linkProps}
    >
      <Button {...rest}>{children}</Button>
    </Link>
  );
}
