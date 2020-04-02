import React from 'react';
import { avenirNext } from '../styles/materialTheme';

export default function({ children, ...rest }) {
  return (
    <text textAnchor="middle" fontFamily={avenirNext} {...rest}>
      {children}
    </text>
  );
}
