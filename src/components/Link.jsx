import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({
  children,
  href,
  style,
  noUnderline = false,
  external = false,
  ...rest
}) {
  const styles = {
    color: 'unset',
    textDecoration: noUnderline ? 'unset' : 'underline',
    ...style,
  };

  if (external) {
    return (
      <a href={href} style={styles} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} style={styles} {...rest}>
      {children}
    </RouterLink>
  );
}
