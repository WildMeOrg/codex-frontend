import React from 'react';

export default function({ children }) {
  return (
    <div
      style={{
        maxWidth: 851,
        marginTop: 64,
        marginBottom: 200,
        width: '100%',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
}
