import React from 'react';
import { get, omit } from 'lodash-es';

import DerivedAnnotatedPhotograph from './DerivedAnnotatedPhotograph';
import FormattedComplexDateTime from './FormattedComplexDateTime';
import FormattedLocationWithDialog from './FormattedLocationWithDialog';
import FormattedReporter from '../../../components/formatters/FormattedReporter';
import Text from '../../../components/Text';

export default function GalleryItem({
  owner,
  time,
  location,
  ...assetProps
}) {
  return (
    <li>
      <DerivedAnnotatedPhotograph
        assetMetadata={get(assetProps, 'metadata', {})}
        {...omit(assetProps, 'metadata')}
      />
      <Text variant="caption" component="div">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '8px',
          }}
        >
          <FormattedLocationWithDialog
            location={location}
            textProps={{ component: 'p' }}
          />
          <FormattedComplexDateTime {...time} component="p" />
        </div>
        <FormattedReporter reporter={owner} component="p" />
      </Text>
    </li>
  );
}
