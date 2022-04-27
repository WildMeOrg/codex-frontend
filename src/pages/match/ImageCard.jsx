import React from 'react';

import AnnotatedPhotograph from '../../components/AnnotatedPhotograph';
import Card from '../../components/cards/Card';

export default function ImageCard({ titleId, annotation }) {
  return (
    <Card titleId={titleId} maxHeight="unset">
      <AnnotatedPhotograph
        assetMetadata={{
          alt: 'Selected query annotation',
          src: annotation?.image_url,
          dimensions: annotation?.asset_dimensions,
        }}
        annotations={[annotation]}
        width="100%"
        height={420}
      />
    </Card>
  );
}
