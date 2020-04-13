import React from 'react';

export default function ButtonLink({
  children,
  onClick,
  style,
  ...rest
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        textDecoration: 'underline',
        border: 'unset',
        background: 'unset',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
