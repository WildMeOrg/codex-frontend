import React from 'react';

export default function({ children, style, ...rest }) {
  return (
    <div
      style={{
        maxWidth: 851,
        marginTop: 64,
        marginBottom: 200,
        width: '100%',
        position: 'relative',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
