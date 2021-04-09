import React from 'react';

export default function({
  children,
  style,
  fullWidth = false,
  ...rest
}) {
  const marginTop = 64;

  return (
    <div
      style={{
        margin: `${marginTop}px auto 120px auto`,
        width: '100%',
        position: 'relative',
        maxWidth: fullWidth ? 905 : 851,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
