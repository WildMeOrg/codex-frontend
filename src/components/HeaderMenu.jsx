import React from 'react';

export default function HeaderMenu({
  open,
  itemCount,
  children,
  style,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'black',
        padding: '0 12px',
        height: open ? itemCount * 36 + 16 : 0,
        transition: 'height 0.1s ease-in-out',
        overflow: 'hidden',
        top: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
