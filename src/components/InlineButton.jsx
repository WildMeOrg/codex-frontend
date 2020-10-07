import React from 'react';

export default function InlineButton({
  children,
  style = {},
  noUnderline,
  ...rest
}) {
  return (
    <button
      style={{
        border: 'unset',
        textDecoration: noUnderline ? undefined : 'underline',
        cursor: 'pointer',
        color: 'inherit',
        padding: 0,
        background: 'unset',
        letterSpacing: '0.04em',
        ...style,
      }}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
}
