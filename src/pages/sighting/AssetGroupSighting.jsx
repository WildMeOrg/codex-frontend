import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import SightingCore from './SightingCore';
import useGetAGS from '../../models/assetGroupSighting/useGetAGS';

export default function AssetGroupSighting() {
  const history = useHistory();
  const { id } = useParams();

  const {
    data: assetGroupSightingData,
    loading: assetGroupLoading,
    error: assetGroupError,
    statusCode: assetGroupStatusCode,
  } = useGetAGS(id);

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
