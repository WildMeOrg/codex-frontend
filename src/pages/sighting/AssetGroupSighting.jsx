import React, { useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import SightingCore from './SightingCore';
import useGetAGS from '../../models/assetGroupSighting/useGetAGS';

export default function AssetGroupSighting() {
  const history = useHistory();
  const { id } = useParams();
  const { hash } = useLocation();

  const {
    data: assetGroupSightingData,
    loading: assetGroupLoading,
    error: assetGroupError,
    statusCode: assetGroupStatusCode,
  } = useGetAGS(id, { refetch: true });

  const sightingId = assetGroupSightingData?.sightingGuid;

  useEffect(() => {
    if (sightingId) {
      history.push(`/sightings/${sightingId}${hash}`);
    }
  }, [sightingId]);

  return (
    <SightingCore
      data={assetGroupSightingData}
      loading={assetGroupLoading}
      error={assetGroupError}
      statusCode={assetGroupStatusCode}
      pending
      id={id}
    />
  );
}
