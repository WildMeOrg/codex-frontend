import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import SightingCore from './SightingCore';
import useAssetGroupSighting from '../../models/assetGroupSighting/useAssetGroupSighting';

export default function AssetGroupSighting() {
  const history = useHistory();
  const { id } = useParams();

  const {
    data: assetGroupSightingData,
    loading: assetGroupLoading,
    error: assetGroupError,
    statusCode: assetGroupStatusCode,
  } = useAssetGroupSighting(id);

  const sightingId = assetGroupSightingData?.sightingGuid;

  useEffect(
    () => {
      if (sightingId) {
        history.push(`/sightings/${sightingId}`);
      }
    },
    [sightingId],
  );

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
