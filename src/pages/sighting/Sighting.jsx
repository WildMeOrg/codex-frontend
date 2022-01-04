import React from 'react';
import { useParams } from 'react-router-dom';

import SightingCore from './SightingCore';
import useSighting from '../../models/sighting/useSighting';

export default function Sighting() {
  const { id } = useParams();

  const {
    data: sightingData,
    loading: sightingLoading,
    error: sightingError,
    statusCode: sightingStatusCode,
  } = useSighting(id);

  return (
    <SightingCore
      data={sightingData}
      loading={sightingLoading}
      error={sightingError}
      statusCode={sightingStatusCode}
      pending={false}
      id={id}
    />
  );
}
