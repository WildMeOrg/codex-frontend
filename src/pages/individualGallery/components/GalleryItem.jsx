import React from 'react';
import { get, omit } from 'lodash-es';

import DerivedAnnotatedPhotograph from './DerivedAnnotatedPhotograph';

export default function GalleryItem(props) {
  return (
    <li>
      <DerivedAnnotatedPhotograph
        assetMetadata={get(props, 'metadata', {})}
        {...omit(props, 'metadata')}
      />
    </li>
  );
}
