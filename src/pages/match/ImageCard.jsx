import React from 'react';
import Card from '../../components/cards/Card';

export default function ImageCard({ titleId, annotation }) {
  return (
    <Card titleId={titleId}>
      <img src={annotation?.image_url} alt={titleId} />
    </Card>
  );
}
