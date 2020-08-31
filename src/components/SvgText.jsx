import React from 'react';
import { lato } from '../styles/materialTheme';

export default function({ children, ...rest }) {
  return (
    <text textAnchor="middle" fontFamily={lato} {...rest}>
      {children}
    </text>
  );
}
