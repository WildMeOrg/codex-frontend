import React from 'react';
import { useParams } from 'react-router-dom';

import SightingCore from './SightingCore';
import useSighting from '../../models/sighting/useSighting';

export default function Sighting() {
  const { id } = useParams();

  const {
    data,
    loading,
    error,
    statusCode,
  } = useSighting(id, { refetch: true });

  return (
    <SightingCore
      data={data}
      loading={loading}
      error={error}
      statusCode={statusCode}
      pending={false}
      id={id}
    />
  );
}
