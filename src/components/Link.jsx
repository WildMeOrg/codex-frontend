import React from 'react';

export default function Link({ children, href, style, ...rest }) {
  return (
    <a
      href={href}
      style={{
        color: 'unset',
        textDecoration: 'underline',
        ...style,
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
