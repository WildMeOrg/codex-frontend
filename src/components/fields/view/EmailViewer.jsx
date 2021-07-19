import React from 'react';
import Link from '../../Link';

export default function EmailViewer({ value }) {
  return (
    <Link external href={`mailto://${value}`} variant="body2">
      {value}
    </Link>
  );
}
