import React from 'react';
import Link from '../../Link';

export default function EmailViewer({ value }) {
  return (
    <Link
      external
      href={`https://community.wildme.org/u/${value}/summary`}
      variant="body2"
    >
      {value}
    </Link>
  );
}
